# mvn clean install
To install everything with no headache. The outcome is:
- **dxa-module-smarttarget-common:version:7.1.0:jar**
- **dxa-module-smarttarget-common:version:8.1.0:jar**
- **dxa-module-smarttarget-2013sp1:version:jar** dependent on **%common%:7.1.0**
- **dxa-module-smarttarget-web8:version:jar** dependent on **%common%:8.1.0**

# Maven Profiles
Maven's pom.xml here contains 3 profiles.

Two of them are enabled by default. These are **cd-8.1.0** and **two-versions-auto**.

If no specific version (profile) is set, then Maven will:
 - build cd-8.1.0 with classifier 8.1.0
 - build cd-7.1.0 with classifier 7.1.0
  
 If you set explicit profile then:
- if it's cd-7.1.0, then you'll get only 7.1.0 with same classifier
- if it's cd-8.1.0, then you'll get only 8.1.0 with same classifier
- if it's two-versions-auto, then you'll get only 7.1.0 with same classifier

Also:
- cd-7.1.0 + cd-8.1.0 will build probably be broken 
- explicit 'two-versions-auto' is actually only 7.1.0
 
# Artifacts
You still can be dependent on **%common:classifier%** artifacts. 

The only purpose of version-specific artifacts is to save transitive dependencies which dissappear with usage of profiles.