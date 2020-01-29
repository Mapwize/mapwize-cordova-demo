# Mapwize Cordova Demo

This is a Demo app for the Mapwize Cordova Plugin (https://github.com/Mapwize/mapwize-cordova)

### Installing plugin

```
cordova plugin add mapwize-cordova \
 --variable MWZAPIKEY="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
 --variable MWZSERVERURL="https://api.mapwize.io/" \
 --variable MWZSTYLEURL="https://outdoor.mapwize.io/styles/mapwize/style.json?key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
 --variable MWZREFRESHINTERVAL=100

```

or from github

```
cordova plugin add https://github.com/Mapwize/mapwize-cordova.git \
 --variable MWZAPIKEY="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
 --variable MWZSERVERURL="https://api.mapwize.io/" \
 --variable MWZSTYLEURL="https://outdoor.mapwize.io/styles/mapwize/style.json?key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
 --variable MWZREFRESHINTERVAL=100
```

You can also use the included plugin_install.sh script after you have replaced the above values.


### Adding the style URL to 