SDL Digital Experience Accelerator CM-side content & Installation Scripts
===

This folder contains all the required building blocks for a DXA installation including:

* Installation scripts/Tools
* DXA CM Content for each module
  
Using the following msbuild command will package up this content into a /dist folder for importing into a content manager:
```
msbuild ciBuild.proj /t:Artifacts
```

Any future changes or additions to base CM content for DXA should be exported and placed in this folder.
