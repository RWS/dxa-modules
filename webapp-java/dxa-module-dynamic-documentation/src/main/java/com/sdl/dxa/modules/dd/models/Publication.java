package com.sdl.dxa.modules.dd.models;

import org.joda.time.DateTime;

import java.util.ArrayList;
import java.util.List;

public class Publication {
        private String id;
        private String title;
        private List<String> productFamily = new ArrayList<>();
        private List<String> productReleaseVersion = new ArrayList<>();
        private String versionRef;
        private String language;
        private DateTime createdOn;
        private String version;
        private String logicalId;

        public String getId() {
                return id;
        }

        public void setId(String id) {
                this.id = id;
        }

        public String getTitle() {
                return title;
        }

        public void setTitle(String title) {
                this.title = title;
        }

        public List<String> getProductFamily() {
                return productFamily;
        }

        public void setProductFamily(List<String> productFamily) {
                this.productFamily = productFamily;
        }

        public List<String> getProductReleaseVersion() {
                return productReleaseVersion;
        }

        public void setProductReleaseVersion(List<String> productReleaseVersion) {
                this.productReleaseVersion = productReleaseVersion;
        }

        public String getVersionRef() {
                return versionRef;
        }

        public void setVersionRef(String versionRef) {
                this.versionRef = versionRef;
        }

        public String getLanguage() {
                return language;
        }

        public void setLanguage(String language) {
                this.language = language;
        }

        public DateTime getCreatedOn() {
                return createdOn;
        }

        public void setCreatedOn(DateTime createdOn) {
                this.createdOn = createdOn;
        }

        public String getVersion() {
                return version;
        }

        public void setVersion(String version) {
                this.version = version;
        }

        public String getLogicalId() {
                return logicalId;
        }

        public void setLogicalId(String logicalId) {
                this.logicalId = logicalId;
        }
}
