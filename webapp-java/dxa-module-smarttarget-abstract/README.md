# mvn clean install
To install everything with no headache. The outcome is:
- **dxa-module-smarttarget-common:version:2013sp1:jar**
- **dxa-module-smarttarget-common:version:web8:jar**
- **dxa-module-smarttarget-2013sp1:version:jar** dependent on **%common%:2013sp1**
- **dxa-module-smarttarget-web8:version:jar** dependent on **%common%:web8**

# Maven Profiles
Maven's pom.xml here contains 3 profiles.

Two of them are enabled by default. These are **web8** and **two-versions-auto**.

If no specific version (profile) is set, then Maven will:
 - build 2013sp1 with classifier 2013sp1
 - build web8 with classifier web8
  
 If you set explicit profile then:
- if it's 2013sp1, then you'll get only 2013sp1 with same classifier
- if it's web8, then you'll get only web8 with same classifier
- if it's two-versions-auto, then you'll get only 2013sp1 with same classifier

Also:
- 2013sp1 + web8 will build probably be broken, and not expected to be enabled at the same time
- explicit 'two-versions-auto' is actually only 2013sp1
 
# Artifacts
You still can be dependent on **%common:classifier%** artifacts. 

The only purpose of version-specific artifacts is to save transitive dependencies which disappear with usage of profiles.