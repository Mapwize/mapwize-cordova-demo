#!/bin/bash
ionic cordova plugin remove mapwize-cordova-plugin
ionic cordova plugin add --variable MWZMapwizeApiKey="49bbfb7a60b958d76bbf57fc674c93de" ../mapwize-cordova 
#ionic cordova plugin add --variable DEPLOYMENT-TARGET="10.0" --variable PODS_IOS_MIN_VERSION="10.0" ../mapwize-cordova

