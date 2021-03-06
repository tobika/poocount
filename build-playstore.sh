#!/bin/bash          
VERSION="0.3.4"

echo Preparing playstore apks for version $VERSION

echo Checklist : Did you?
echo 1. google analytics ID for production
echo 2. change the app id for production

read -p "Press any key to validate checklist... " -n1 -s

BUILD_MULTIPLE_APKS=true ionic cordova build android --release

read -p "Press any key to continue... " -n1 -s

echo Copying APKs

mkdir playstore/$VERSION/
rm -rf playstore/$VERSION/*

cp platforms/android/build/outputs/apk/android-x86-release-unsigned.apk playstore/$VERSION/poocount-x86-release-$VERSION.apk
cp platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk playstore/$VERSION/poocount-armv7-release-$VERSION.apk

cd playstore/$VERSION/
cp ../tobika-release-key.keystore .

echo Zipaligning APKs

zipalign -v 4 poocount-x86-release-$VERSION.apk poocount-x86-release-$VERSION-ready.apk
zipalign -v 4 poocount-armv7-release-$VERSION.apk poocount-armv7-release-$VERSION-ready.apk

echo Signing APKS

apksigner sign --ks tobika-release-key.keystore poocount-x86-release-$VERSION-ready.apk
apksigner verify -v poocount-x86-release-$VERSION-ready.apk

apksigner sign --ks tobika-release-key.keystore poocount-armv7-release-$VERSION-ready.apk
apksigner verify -v poocount-armv7-release-$VERSION-ready.apk

echo Finished