package com.sdl.dxa.modules.degrees51.api;

import com.sdl.webapp.common.exceptions.DxaException;
import fiftyone.mobile.detection.AutoUpdate;
import fiftyone.mobile.detection.AutoUpdateStatus;
import fiftyone.mobile.detection.Match;
import fiftyone.mobile.detection.Provider;
import fiftyone.mobile.detection.factories.StreamFactory;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.joda.time.DateTime;
import org.joda.time.Weeks;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.FutureTask;
import java.util.concurrent.TimeUnit;

import static com.google.common.base.Strings.isNullOrEmpty;

@Component
@Slf4j
public class Degrees51DataProvider {

    @Value("${dxa.modules.51degrees.file.lite.url}")
    private String degrees51DataLiteUrl;

    @Value("${dxa.modules.51degrees.file.lite.location}")
    private String liteFileLocation;

    @Value("${dxa.modules.51degrees.license}")
    private String licenseKey;

    @Value("${dxa.modules.51degrees.file.location}")
    private String dataFileLocation;

    @Value("${dxa.modules.51degrees.file.timeout.mins}")
    private long fileUpdateTimeoutMinutes;

    private boolean isFallback = false;

    private boolean isDataNotAvailable;

    public Match match(String userAgent) {
//        fileAccess.acquire();
        try {
            Provider provider = new Provider(StreamFactory.create(getFileName(), false));

            return provider.match(userAgent);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private String getFileName() {
        return isFallback ? liteFileLocation : dataFileLocation;
    }

    @Scheduled(cron = "0 0 0/6 * * ?")
    //todo enable?
//    @PostConstruct
    private void update() {
        if (isNullOrEmpty(licenseKey)) {
            log.warn("Update of 51degrees data file failed, because license key is not set, fallback to Lite data file");
            updateLite();
            return;
        }

        final ExecutorService executorService = Executors.newFixedThreadPool(2);
        executorService.execute(new Runnable() {
            @Override
            public void run() {
                FutureTask<AutoUpdateStatus> futureTask = new FutureTask<>(new Callable<AutoUpdateStatus>() {
                    @Override
                    public AutoUpdateStatus call() throws Exception {
                        return AutoUpdate.update(licenseKey, dataFileLocation);
                    }
                });

                log.info("Update of 51degrees data file {} started...", dataFileLocation);

                AutoUpdateStatus status;
                try {
                    executorService.execute(futureTask);
                    status = futureTask.get(fileUpdateTimeoutMinutes, TimeUnit.MINUTES);
                    executorService.shutdown();

                    switch (status) {
                        case AUTO_UPDATE_SUCCESS:
                            log.info("51degrees data file has been updated");
                            isFallback = false;
                            isDataNotAvailable = false;
                            break;
                        case AUTO_UPDATE_NOT_NEEDED:
                            log.info("51degrees data file is up-to-date, update is not needed");
                            isFallback = false;
                            isDataNotAvailable = false;
                            break;
                        default:
                            log.error("There was a problem updating the data file: {}", status);
                            throw new DxaException("There was a problem updating the data file: " + status);
                    }
                } catch (Exception e) {
                    log.error("Exception while updating 51degrees data file.", e);
                    updateLite();
                }

//                fileAccess.release();
                log.info("Update of 51degrees data file {} completed...", dataFileLocation);
            }
        });
    }

    //    @SneakyThrows(InterruptedException.class)
    private void updateLite() {
        if (true) {
            //todo enable
            log.info("Update Lite method is disabled!");
            return;
        }

        File liteFile = new File(liteFileLocation);

        isFallback = true;
        if (!liteFile.exists() || isOlderThanOneWeek(liteFile)) {
            log.info("51degrees lite file needs to be updated");
            CloseableHttpClient client = HttpClientBuilder.create().build();
            try {
                CloseableHttpResponse response = client.execute(new HttpGet(degrees51DataLiteUrl));
                HttpEntity entity = response.getEntity();
                if (entity != null) {
                    InputStream inputStream = entity.getContent();
                    try (FileWriter writer = new FileWriter(liteFile)) {
                        IOUtils.copy(inputStream, writer);
                    }
                }
                isDataNotAvailable = false;
                log.info("51degrees lite file is updated");
            } catch (IOException e) {
                log.error("Exception while updating the 51degrees lite file, deleting", e);
                isDataNotAvailable = true;
                if (liteFile.exists()) {
                    if (!liteFile.delete()) {
                        log.error("Impossible to delete 51degrees Lite file after an exception");
                    }
                }
            }
        } else {
            log.info("51degrees lite file doesn't need to be updated");
        }
    }

    private boolean isOlderThanOneWeek(File liteFile) {
        return new DateTime(liteFile.lastModified()).isBefore(new DateTime().minus(Weeks.ONE));
    }
}
