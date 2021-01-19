Building
---------
In order to build this repository you must first make sure you restore all the required packages from nuget.org using the build target 'Restore':

```
msbuild ciBuild.proj /t:Restore
```

After restoring all packages you can build the repository:
```
msbuild ciBuild.proj
```
You can also specify a build version to tag your artifacts:
```
msbuild ciBuild.proj /p:Version=Major.Minor.Path.Build
```

Testing
-------
To run the unit tests and code coverage of the built artifacts you can run:
```
msbuild ciBuild.proj /t:Test
```

Generating Release Artifacts
----------------------------
To generate all the artifacts (after you have built the repository) you can use the following target:
```
msbuild ciBuild.proj /t:Artifacts
```
