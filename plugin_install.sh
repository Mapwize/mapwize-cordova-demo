#!/bin/bash
cordova plugin remove mapwize-cordova-plugin
cordova plugin add mapwize-cordova \
 --variable MWZAPIKEY=<<Mapwize API Key>> \
 --variable MWZSERVERURL="https://api.mapwize.io/" \
 --variable MWZSTYLEURL="https://outdoor.mapwize.io/styles/mapwize/style.json?key=<<Mapwize API Key>>" \
 --variable MWZREFRESHINTERVAL=100
