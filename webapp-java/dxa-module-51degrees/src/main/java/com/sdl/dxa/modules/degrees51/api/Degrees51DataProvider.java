package com.sdl.dxa.modules.degrees51.api;

import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.exceptions.DxaException;
import fiftyone.mobile.detection.AutoUpdate;
import fiftyone.mobile.detection.AutoUpdateStatus;
import fiftyone.mobile.detection.Match;
import fiftyone.mobile.detection.Provider;
import fiftyone.mobile.detection.entities.stream.Dataset;
import fiftyone.mobile.detection.factories.StreamFactory;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;

import static org.apache.commons.io.FileUtils.readFileToByteArray;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.joda.time.DateTime.now;

/**
 * Provider for data from 51degrees. Also is responsible to keep data files up to date.
 */
@Component
@Slf4j
public class Degrees51DataProvider {

    private static final Semaphore liteFileWrite = new Semaphore(1);

    private static final Map<String, String> fileNamesByLicense = new HashMap<>();

    private static final Map<String, DateTime> fileNextUpdatesByNames = new HashMap<>();

    private static final Map<String, DateTime> fileDelaysByNames = new HashMap<>();

    private static final Map<String, Provider> dataProvidersByNames = new HashMap<>();

    @Autowired
    private WebRequestContext webRequestContext;

    @Value("${dxa.modules.51degrees.file.lite.url}")
    private String degrees51DataLiteUrl;

    @Value("${dxa.modules.51degrees.file.lite.location}")
    private String liteFileLocation;

    @Value("${dxa.modules.51degrees.file.locationPattern}")
    private String dataFileLocationPattern;

    @Value("${dxa.modules.51degrees.file.lite.timeout.mins}")
    private int fileLiteUpdateTimeoutMinutes;

    @Value("${dxa.modules.51degrees.file.reattempt.delay.mins}")
    private int fileUpdateReattemptDelayMinutes;

    @Value("${dxa.modules.51degrees.license:#{null}}")
    private String preConfiguredLicenseKey;

    /**
     * Tries to match user agent using 51degrees.
     *
     * @param userAgent user agent
     * @return match result
     */
    public Match match(String userAgent) {
        try {
            String fileName = getCurrentFileName();

            Provider provider = dataProvidersByNames.containsKey(fileName) ? dataProvidersByNames.get(fileName) :
                    memorize(dataProvidersByNames, fileName, new Provider(StreamFactory.create(readFileToByteArray(new File(fileName))), 32));

            return provider.match(userAgent);
        } catch (IOException e) {
            log.error("Exception while trying to match", e);
        }
        return null;
    }

    private String getCurrentFileName() {
        String fileName;

        String licenseKey = webRequestContext.getLocalization().getConfiguration("51degrees.licenseKey");
        if (!isEmpty(licenseKey) && (fileName = updateAndGiveFileName(licenseKey, true)) != null) {
            log.debug("Using licenseKey key configured in CM");
            return fileName;
        }

        if (!isEmpty(preConfiguredLicenseKey) && (fileName = updateAndGiveFileName(preConfiguredLicenseKey, true)) != null) {
            log.debug("Using licenseKey key configured in properties");
            return fileName;
        }

        fileName = updateLiteAndGiveFileName();
        log.debug("No licenseKey key found for 51degrees module, fallback to Lite");
        return fileName;
    }

    @PostConstruct
    private void onAppStart() {

        log.debug("Check if the 51degrees licenseKey is in properties");
        if (preConfiguredLicenseKey != null) {
            log.debug("The licenseKey key for 51degrees found in properties, pre-loading data file");
            if (null == updateAndGiveFileName(preConfiguredLicenseKey, false)) {
                log.debug("Failed to pre-load data file for 51degrees, pre-loading Lite file");
                updateLiteAndGiveFileName();
            }
        } else {
            log.debug("The licenseKey key for 51degrees is not in properties, pre-loading Lite file");
            updateLiteAndGiveFileName();
        }
    }

    @SneakyThrows(IOException.class)
    private String updateAndGiveFileName(final String licenseKey, boolean isRequestPending) {
        final String fileName = getDataFileName(licenseKey);

        if (!isUpdateNeeded(fileName, 0)) {
            log.info("51degrees data file is up-to-date, update is not needed");
            return fileName;
        }

        boolean fileExists = new File((fileName)).exists();
        if (fileDelaysByNames.containsKey(fileName)) {
            DateTime pauseUntil = fileDelaysByNames.get(fileName);
            if (now().isBefore(pauseUntil)) {
                log.info("File update for {} is paused until {}, cannot be updated now", fileName, pauseUntil);
                return fileExists ? fileName : null;
            }
            fileDelaysByNames.remove(fileName);
        }

        if (!fileExists && isRequestPending) {
            log.info("File needs an update but we have a pending request. " +
                    "So we fallback to lite, set this file on pause, and update file in background");
            memorize(fileDelaysByNames, fileName, now().plusMinutes(fileUpdateReattemptDelayMinutes));
            Executors.newSingleThreadExecutor().execute(new Runnable() {
                @Override
                public void run() {
                    updateDataFile(licenseKey, fileName);
                }
            });
            return null;
        }

        return updateDataFile(licenseKey, fileName);
    }

    private String updateDataFile(String licenseKey, String fileName) {
        try {
            AutoUpdateStatus status = AutoUpdate.update(licenseKey, fileName);
            switch (status) {
                case AUTO_UPDATE_SUCCESS:
                    log.info("API: 51degrees data file has been updated");
                    getAndSetNextUpdate(fileName);
                    return fileName;
                case AUTO_UPDATE_NOT_NEEDED:
                    log.info("API: 51degrees data file is up-to-date, updateDataFile is not needed");
                    return fileName;
                case AUTO_UPDATE_ERR_429_TOO_MANY_ATTEMPTS:
                    log.warn("API: Too many attempts to update data file for 51degrees, pause for {} mins", fileUpdateReattemptDelayMinutes);
                    memorize(fileDelaysByNames, fileName, now().plusMinutes(fileUpdateReattemptDelayMinutes));
                    // no break or return here, falling to default block
                default:
                    log.error("There was a problem updating the data file: {}", status);
                    throw new DxaException("There was a problem updating the data file: " + status);
            }
        } catch (Exception e) {
            log.error("Exception while updating 51degrees data file.", e);
            return null;
        }
    }


    @SneakyThrows({NoSuchAlgorithmException.class, UnsupportedEncodingException.class})
    private String getDataFileName(String licenseKey) {
        String fileName = fileNamesByLicense.get(licenseKey);
        if (fileName != null) {
            return fileName;
        }

        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(licenseKey.getBytes("UTF-8"));
        return memorize(fileNamesByLicense, licenseKey, String.format(dataFileLocationPattern,
                String.format("%032x", new BigInteger(1, md.digest()))));
    }

    @Scheduled(cron = "0 0 4 * * ?")
    private void updateLiteScheduled() {
        updateLiteAndGiveFileName();
    }

    private String updateLiteAndGiveFileName() {
        File liteFile = new File(liteFileLocation);
        try {
            if (!isUpdateNeeded(liteFileLocation, 24)) {
                log.debug("51degrees lite file doesn't need to be updated");
                return liteFileLocation;
            }

            log.info("51degrees lite file needs to be updated");

            File temp = new File(liteFileLocation + UUID.randomUUID());
            FileUtils.copyURLToFile(new URL(degrees51DataLiteUrl), temp,
                    fileLiteUpdateTimeoutMinutes * 60 * 1000 / 2,
                    fileLiteUpdateTimeoutMinutes * 60 * 1000);
            try {
                liteFileWrite.acquire();
                if (!deleteDataFile(liteFileLocation)) {
                    throw new IOException("Could not delete Lite file, (access denied?)");
                }
                FileUtils.moveFile(temp, liteFile);
            } finally {
                liteFileWrite.release();
            }

            log.info("51degrees lite file is updated");
            getAndSetNextUpdate(liteFileLocation);
        } catch (IOException | InterruptedException e) {
            log.error("Exception while updating the 51degrees lite file, deleting", e);
            FileUtils.deleteQuietly(liteFile);
            return null;
        }
        return liteFileLocation;
    }

    private boolean isUpdateNeeded(String fileName, int hoursPostpone) throws IOException {
        DateTime nextUpdateDate;
        if (fileNextUpdatesByNames.containsKey(fileName)) {
            nextUpdateDate = fileNextUpdatesByNames.get(fileName);
        } else {
            File file = new File(fileName);
            if (!file.exists()) {
                FileUtils.forceMkdir(file.getParentFile());
                return true;
            }

            nextUpdateDate = getAndSetNextUpdate(fileName);
        }
        return now().isAfter(new DateTime(nextUpdateDate).plusHours(hoursPostpone));
    }

    private DateTime getAndSetNextUpdate(String fileName) throws IOException {
        try (Dataset dataset = StreamFactory.create(readFileToByteArray(new File(fileName)))) {
            Date nextUpdate = dataset.nextUpdate;
            log.trace("Next expected updated for {} is {}", fileName, nextUpdate);
            return memorize(fileNextUpdatesByNames, fileName, new DateTime(nextUpdate));
        }
    }

    private boolean deleteDataFile(String fileName) throws IOException {
        if (dataProvidersByNames.containsKey(fileName)) {
            Provider provider = dataProvidersByNames.get(fileName);
            dataProvidersByNames.remove(fileName);
            provider.dataSet.close();
        }
        File file = new File(fileName);
        return !file.exists() || FileUtils.deleteQuietly(file);
    }

    private <T> T memorize(Map<String, T> map, String key, T value) {
        map.put(key, value);
        return value;
    }
}
