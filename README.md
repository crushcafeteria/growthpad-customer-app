# Project Information
Release Password: ```kvsWchPtvNQ79Qz6mWJewawwnM9G7X```

# Building a release
## Increment app version number
Instructions coming soon

## Building an APK file
Run this command to build a release APK file:- 
```
ionic cordova build android --release
```
The resulting APK file will be located at 
```
platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

## Signing the release
To sign the APK file with your release key, run the following command
with `jarsigner.exe`
#### UNIX style
```
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.jks app-release-unsigned.apk my-alias
```
#### Windows style
```
"C:\Program Files\Java\jdk1.8.0_172\bin\jarsigner.exe" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.jks app-release-unsigned.apk my-alias
```
> Please note that you MUST sign the APK file before you can install it on a physical device. This is important!

## Aligning release the package
After signing the package file, you need to align it with the 
`zipalign` tool with this command:-
#### UNIX style
```
zipalign -v 4 app-release-unsigned.apk customer.growthpad.signed.apk
```
#### Windows style
```
"C:\Users\Nelson\AppData\Local\Android\Sdk\build-tools\27.0.3\zipalign.exe" -v 4 app-release-unsigned.apk customer.growthpad.signed.apk
```
A new file `customer.growthpad.signed.apk` will be placed in the project root. You can publish this 
file to the Google Play Store


# Releasing OTA (Over The Air) updates
All OTA updates will be released on the **Production** channel and will target all binary versions.

To release an customer update, run this command:-
```
appcenter codepush release-cordova -a growthpad/Growthpad-Customer-App -d Production --description "[DEPLOYMENT DESCRIPTION]" -m -t *
```

To release a service provider update, run this command:-
```
appcenter codepush release-cordova -a growthpad/Growthpad-Service-Provider-App -d Production --description "[DEPLOYMENT DESCRIPTION]" -m -t *
```i

# Log of possible bugs

### 1. Execution failed for task \':app:processDebugManifest\'
You might encounter this error when building the app

```
* What went wrong:
Execution failed for task ':app:processDebugManifest'.
> Manifest merger failed : Attribute meta-data#android.support.VERSION@value value=(25.4.0) from [com.android.support:appcompat-v7:25.4.0] AndroidManifest.xml:28:13-35
        is also present at [com.android.support:support-v4:26.1.0] AndroidManifest.xml:28:13-35 value=(26.1.0).
        Suggestion: add 'tools:replace="android:value"' to <meta-data> element at AndroidManifest.xml:26:9-28:38 to override.
```
Solution
1. Add the following line to `/mnt/73EB138A7CF985D0/DevWork/Growthpad/mobile/customer-app/platforms/android/app/build.gradle`

```
configurations.all {
    resolutionStrategy.eachDependency { DependencyResolveDetails details ->
        def requested = details.requested
        if (requested.group == 'com.android.support') {
            if (!requested.name.startsWith("multidex")) {
                details.useVersion '26.0.0'
            }
        }
    }
}
```

### 2. OTA updates sometimes successfully apply then revert on app restart
To resolve this issue, read the following Github issues:-
https://github.com/Microsoft/cordova-plugin-code-push/issues/451

