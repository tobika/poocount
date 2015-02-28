#!/bin/bash          
VERSION="0.2.2"

echo Preparing playstore apks for version $VERSION

#BUILD_MULTIPLE_APKS=true ionic build --release android

echo Copying APKs

mkdir playstore/$VERSION/

cp platforms/android/build/outputs/apk/android-x86-release-unsigned.apk playstore/$VERSION/poocount-x86-release-$VERSION.apk
cp platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk playstore/$VERSION/poocount-armv7-release-$VERSION.apk

cd playstore/$VERSION/

echo Signing APKS

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../tobika-release-key.keystore poocount-x86-release-$VERSION.apk tobika
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../tobika-release-key.keystore poocount-armv7-release-$VERSION.apk tobika

echo Zipaligning APKs

zipalign -v 4 poocount-x86-release-$VERSION.apk poocount-x86-release-$VERSION-ready.apk
zipalign -v 4 poocount-x86-release-$VERSION.apk poocount-armv7-release-$VERSION-ready.apk

echo Finished