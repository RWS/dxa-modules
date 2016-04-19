package com.sdl.dxa.modules.degrees51.device;

import com.sdl.webapp.common.exceptions.DxaException;
import fiftyone.mobile.detection.AutoUpdate;
import fiftyone.mobile.detection.AutoUpdateStatus;
import lombok.Getter;
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
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
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

@Service
@Slf4j
public class AutomaticDataUpdater {

    @Value("${dxa.modules.51degrees.file.lite.url}")
    private String degrees51LiteUrl;

    @Value("${dxa.modules.51degrees.file.lite.location}")
    private String degrees51LiteFile;

    @Value("${dxa.modules.51degrees.license}")
    private String licenseKey;

    @Value("${dxa.modules.51degrees.file.location}")
    private String fileLocation;

    @Value("${dxa.modules.51degrees.file.timeout.mins}")
    private long fileUpdateTimeoutMinutes;

    @Getter
    private boolean isReady = false;

    @Scheduled(cron = "0 0/2 * * * ?")
    @PostConstruct
    public void update() {
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
                        return AutoUpdate.update(licenseKey, fileLocation);
                    }
                });

                log.info("Update of 51degrees data file {} started...", fileLocation);
                isReady = false;

                AutoUpdateStatus status;
                try {
                    executorService.execute(futureTask);
                    status = futureTask.get(fileUpdateTimeoutMinutes, TimeUnit.MINUTES);
                    executorService.shutdown();

                    switch (status) {
                        case AUTO_UPDATE_SUCCESS:
                            log.info("51degrees data file has been updated");
                            break;
                        case AUTO_UPDATE_NOT_NEEDED:
                            log.info("51degrees data file is up-to-date, update is not needed");
                            break;
                        default:
                            log.error("There was a problem updating the data file: {}", status);
                            throw new DxaException("There was a problem updating the data file: " + status);
                    }
                } catch (Exception e) {
                    log.error("Exception while updating 51degrees data file.", e);
                    return;
                }

                isReady = true;
                log.info("Update of 51degrees data file {} finished successfully...", fileLocation);
            }
        });
    }

    private void updateLite() {
        File liteFile = new File(degrees51LiteFile);

        if (!liteFile.exists() || isOlderThanOneWeek(liteFile)) {
            log.info("51degrees lite file needs to be updated");
            CloseableHttpClient client = HttpClientBuilder.create().build();
            try {
                CloseableHttpResponse response = client.execute(new HttpGet(degrees51LiteUrl));
                HttpEntity entity = response.getEntity();
                if (entity != null) {
                    InputStream inputStream = entity.getContent();
                    try (FileWriter writer = new FileWriter(liteFile)) {
                        IOUtils.copy(inputStream, writer);
                    }
                }
                log.info("51degrees lite file is updated");
            } catch (IOException e) {
                log.error("Exception while updating the 51degrees lite file, deleting", e);
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
