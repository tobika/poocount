Publish App

Sign APKs
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore tobika-release-key.keystore poocount-ARCH-release-VERSION.apk tobika

Zipalign
zipalign -v 4 poocount-ARCH-release-VERSION.apk poocount-ARCH-release-VERSION-ready.apk