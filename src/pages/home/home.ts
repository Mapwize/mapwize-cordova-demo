import { Component, NgZone } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

declare var Mapwize : any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	url: string;
  token: string;
	syncPeriodInSec: number;

  mapwizeView: any;
  offlineManager: any;
  apiManager: any;
  onLoadActionCallback: any;
  tapOnPlaceInfoCallback: any;
  progress: any;

  callbacks: any = {
    DidLoad: (arg) => {
      console.log("The cordova result(DidLoad)...");
      if (this.onLoadActionCallback) {
        this.onLoadActionCallback();
      }
    },
    DidTapOnFollowWithoutLocation: (arg) => {
      console.log("The cordova result(DidTapOnFollowWithoutLocation): " + JSON.stringify(arg));
    },
    DidTapOnMenu: (arg) => {
      console.log("The cordova result(DidTapOnMenu)...");
      this.mapwizeView.close(
        (res) => {console.log("MapwizeView close successfully returned: " + JSON.stringify(res))},
        (err) => {console.log("MapwizeView close failed err: " + JSON.stringify(err))}
      );
    },
    shouldShowInformationButtonFor: (arg) => {
      console.log("The cordova result(shouldShowInformationButtonFor): " + JSON.stringify(arg));
    },
    TapOnPlaceInformationButton: (place) => {
      console.log("The cordova result: " + JSON.stringify(place));
      console.log("The cordova result: " + place._id);
      if (this.tapOnPlaceInfoCallback) {
        this.tapOnPlaceInfoCallback(place);
      }
      
     },
    TapOnPlaceListInformationButton: (placeList) => {
      console.log("The cordova result(TapOnPlaceListInformationButton): " + JSON.stringify(placeList));
      this.close();
      this.presentAlert('Information', 'PlaceList clicked', 'Information from placeList ' + placeList.name);
    },
    TapOnCloseButton: () => {
      console.log("The cordova, TapOnCloseButton received... ");
    }
  };

  constructor(public navCtrl: NavController,
              private alertController: AlertController,
              private zone: NgZone) {

  }

  showMapClicked() {
    console.log("showMapClicked...");
    this.onLoadActionCallback = this.showMap;
    this.create();
  }

  showCNDGClicked() {
    console.log("showMapClicked...");
    this.onLoadActionCallback = this.showMap;
    this.tapOnPlaceInfoCallback = this.handlePlaceInfoTapped;
    this.createToCNDG();
  }

  selectPlaceClicked() {
    console.log("selectPlaceClicked...");
    this.onLoadActionCallback = this.selectPlace;
    this.tapOnPlaceInfoCallback = this.handlePlaceInfoTapped;
    this.create();
  }

  setPlaceStyleClicked() {
    console.log("setPlaceStyleClicked...");
    this.tapOnPlaceInfoCallback = this.handleSetPlaceStyle;
    this.create();
  }

  selectPlaceListClicked() {
    console.log("selectPlaceListClicked...");
    this.onLoadActionCallback = this.selectPlaceList;
    this.createToCNDG();
  }

  setDirectionClicked() {
    console.log("setDirectionClicked...");
    this.getPlacePromise("5dd5c80332a5f30018856bee").then(value1 => {  // novadvis 
      console.log("setDirection1, value1...");
      this.getPlacePromise("5d096370efe1d2001280e5d5").then(value2 => { // 
        console.log("setDirection1, value2...");

        this.onLoadActionCallback = () => {this.setDirection(value1, value2);};
        this.create();
        
      })
    })
  }


  create() {
    console.log("createClicked...");
    this.mapwizeView = Mapwize.createMapwizeView(
      {
        floor: 0,
        language: "en",
        universeId: "",
        restrictContentToVenueId: "",
        restrictContentToOrganizationId: "",
        showInformationButtonForPlaces: true,
        showInformationButtonForPlaceLists: false
      },
      {
        mainColor: "#FF0000",
        menuButtonIsHidden: false,
        followUserButtonIsHidden: false,
        floorControllerIsHidden: false,
        compassIsHidden: false
      },
      () => {
        console.log("createMapwizeView success...");
      }, (err) => {
        console.log("createMapwizeView failed, err: " + JSON.stringify(err));

      });
      this.setCallback();
  }

  createToCNDG() {
    console.log("createToCNDG...");
    this.mapwizeView = Mapwize.createMapwizeView(
      {
        floor: 0,
        language: "en",
        universeId: "",
        restrictContentToVenueId: "",
        restrictContentToOrganizationId: "",
        centerOnVenueId: "56b20714c3fa800b00d8f0b5",
        showCloseButton: true
      },
      {
        mainColor: "#FF0000",
        menuButtonIsHidden: true,
        followUserButtonIsHidden: true,
        floorControllerIsHidden: true,
        compassIsHidden: true
      }, 
      () => {
        console.log("createMapwizeView CNDG success...");
        this.setCallback();
      }, (err) => {
        console.log("createMapwizeView CNDG failed, err: " + JSON.stringify(err));

      });
      
  }


  close() {
    console.log("close...");
    this.mapwizeView.close(
            (res) => {console.log("MapwizeView close successfully returned: " + JSON.stringify(res))},
            (err) => {console.log("MapwizeView close failed err: " + JSON.stringify(err))}
          );
  }

  showMap() {
    console.log("showMap...");
  }

  handleSetPlaceStyle(place) {
    console.log("place id: " + place._id)
    this.mapwizeView.setPlaceStyle(
            place._id,
            {
                "markerUrl": "https://res.cloudinary.com/contexeo/image/upload/v1548842542/Lego/meeting-red.png",
                "markerDisplay": true,
                "fillColor": "#d90a1b",
                "fillOpacity": 0.5,
                "strokeColor": "#d90a1b",
                "strokeOpacity": 1,
                "strokeWidth": 2
            },
            (res) => {console.log("MapwizeView setPlaceStyle successfully returned: " + JSON.stringify(res))},
            (err) => {console.log("MapwizeView setPlaceStyle failed err: " + JSON.stringify(err))}
          );
     
  }

  handlePlaceInfoTapped(place) {
    this.close();
    this.presentAlert('Information', 'Place clicked', 'Information from place ' + place.name);
  }

  selectPlace() {
    console.log("selectPlace...");
    this.mapwizeView.selectPlace(
        "5d096370efe1d2001280e5d5", true, 
        (res) => {console.log("Select place successfully returned: " + JSON.stringify(res))},
        (err) => {console.log("Select place failed err: " + JSON.stringify(err))}
      );
  }

  selectPlaceList() {
    console.log("selectPlaceList...");
    this.mapwizeView.selectPlaceList(
        "57036d40b247f50b00a07472", 
        (res) => {console.log("Select places successfully returned: " + JSON.stringify(res))},
        (err) => {console.log("Select places failed err: " + JSON.stringify(err))}
      );
  } 

  get2PlacesClicked() {
    this.getPlacePromise("5dd5c80332a5f30018856bee").then(value1 => {  // novadvis 
      console.log("setDirection1, value1...");
      this.getPlacePromise("5d096370efe1d2001280e5d5").then(value2 => { // 
        console.log("setDirection1, value2...");
        console.log("HURRAY$$");
        
      })
    })

  }

  setDirection(value1, value2) {
    console.log("home setDirection...");
    console.log("setDirection1, value2...");
    this.mapwizeView.setDirection(
      {
        "routes": [{
          "bounds": [50.632651641133485, 3.0201004808257483, 50.63297756660368, 3.020755585530424],
          "floor": 4,
          "distance": 0,
          "connectorTypeTo": "ELEVATOR",
          "isStart": true,
          "path": [
            [50.632960411967716, 3.020755585530424],
            [50.63295561547449, 3.0207443400286142],
            [50.63297756660368, 3.0207226965398526],
            [50.63295984377179, 3.0206796605489226],
            [50.63294504111733, 3.0206447036552295],
            [50.63296361497028, 3.0206257018413156],
            [50.63290091952413, 3.020474924221041],
            [50.63285888256419, 3.020373828636383],
            [50.632842686137444, 3.0203348775030445],
            [50.632809987102306, 3.020256238893603],
            [50.63280270162939, 3.0202387179038586],
            [50.63277788265278, 3.0201790302158367],
            [50.6327452207163, 3.0201004808257483],
            [50.63272667145529, 3.0201195207857836],
            [50.6326858717999, 3.0201613997483796],
            [50.632651641133485, 3.0201965359470715],
            [50.632669352217064, 3.020239147008397]
          ],
          "isEnd": false,
          "objectClass": "Route",
          "toFloor": 0,
          "timeToEnd": 113.1823342550475
        }, {
          "bounds": [50.63262582880685, 3.020135357417074, 50.6326697044389, 3.0202411010395744],
          "floor": 0,
          "distance": 0,
          "path": [
            [50.6326697044389, 3.0202411010395744],
            [50.63265121445137, 3.0201956004020762],
            [50.63265090669342, 3.0201959171693633],
            [50.63262582880685, 3.020135357417074]
          ],
          "isStart": false,
          "fromFloor": 4,
          "isEnd": true,
          "objectClass": "Route",
          "connectorTypeFrom": "ELEVATOR",
          "timeToEnd": 6.8869975368985195
        }],
        "bounds": [50.63262582880685, 3.0201004808257483, 50.63297756660368, 3.020755585530424],
        "distance": 82.13703453156175,
        "traveltime": 113.1823342550475,
        "from": {
          "placeId": "5dd5c80332a5f30018856bee",
          "venueId": "56b20714c3fa800b00d8f0b5",
          "objectClass": "DirectionPointWrapper",
          "floor": 4
        },
        "subdirections": [{
          "routes": [{
            "bounds": [50.632651641133485, 3.0201004808257483, 50.63297756660368, 3.020755585530424],
            "floor": 4,
            "distance": 0,
            "connectorTypeTo": "ELEVATOR",
            "isStart": true,
            "path": [
              [50.632960411967716, 3.020755585530424],
              [50.63295561547449, 3.0207443400286142],
              [50.63297756660368, 3.0207226965398526],
              [50.63295984377179, 3.0206796605489226],
              [50.63294504111733, 3.0206447036552295],
              [50.63296361497028, 3.0206257018413156],
              [50.63290091952413, 3.020474924221041],
              [50.63285888256419, 3.020373828636383],
              [50.632842686137444, 3.0203348775030445],
              [50.632809987102306, 3.020256238893603],
              [50.63280270162939, 3.0202387179038586],
              [50.63277788265278, 3.0201790302158367],
              [50.6327452207163, 3.0201004808257483],
              [50.63272667145529, 3.0201195207857836],
              [50.6326858717999, 3.0201613997483796],
              [50.632651641133485, 3.0201965359470715],
              [50.632669352217064, 3.020239147008397]
            ],
            "isEnd": false,
            "objectClass": "Route",
            "toFloor": 0,
            "timeToEnd": 113.1823342550475
          }, {
            "bounds": [50.63262582880685, 3.020135357417074, 50.6326697044389, 3.0202411010395744],
            "floor": 0,
            "distance": 0,
            "path": [
              [50.6326697044389, 3.0202411010395744],
              [50.63265121445137, 3.0201956004020762],
              [50.63265090669342, 3.0201959171693633],
              [50.63262582880685, 3.020135357417074]
            ],
            "isStart": false,
            "fromFloor": 4,
            "isEnd": true,
            "objectClass": "Route",
            "connectorTypeFrom": "ELEVATOR",
            "timeToEnd": 6.8869975368985195
          }],
          "bounds": [50.63262582880685, 3.0201004808257483, 50.63297756660368, 3.020755585530424],
          "distance": 82.13703453156175,
          "traveltime": 113.1823342550475,
          "from": {
            "placeId": "5dd5c80332a5f30018856bee",
            "venueId": "56b20714c3fa800b00d8f0b5",
            "objectClass": "DirectionPointWrapper",
            "floor": 4
          },
          "subdirections": [],
          "objectClass": "Direction",
          "to": {
            "placeId": "5d096370efe1d2001280e5d5",
            "venueId": "56b20714c3fa800b00d8f0b5",
            "objectClass": "DirectionPointWrapper",
            "floor": 0
          },
          "waypoints": []
        }],
        "objectClass": "Direction",
        "to": {
          "placeId": "5d096370efe1d2001280e5d5",
          "venueId": "56b20714c3fa800b00d8f0b5",
          "objectClass": "DirectionPointWrapper",
          "floor": 0
        },
        "waypoints": []
      },
      value1,
      value2,
      false,
      (res) => {console.log("setDirection successfully returned: " + JSON.stringify(res))},
      (err) => {console.log("setDirection failed err: " + JSON.stringify(err))}
      );
  } 

  unselect() {
    console.log("unselect...");
    this.mapwizeView.unselectContent(
        true,
        (res) => {console.log("unselectContent successfully returned: " + JSON.stringify(res))},
        (err) => {console.log("unselectContent failed err: " + JSON.stringify(err))}
      );
  } 

  setCallback() {
    console.log("setCallback...");
    this.mapwizeView.setCallback(
      this.callbacks
      );
  }

  createOfflineManagerClicked() {
    console.log("downloadDataForVenueClicked...");
    this.offlineManager = Mapwize.createOfflineManager("https://outdoor.mapwize.io/styles/mapwize/style.json?key=3dda5b4dcb336838288b858b38840c7a");
  }

  downloadDataForVenueClicked() {
    console.log("downloadDataForVenueClicked...");
    this.progress = 0.0;
    this.offlineManager.downloadDataForVenue(
      "56b20714c3fa800b00d8f0b5",
      "57ec94f8098881c02bdc5eb8",
      (args) => {
        console.log("args: " + JSON.stringify(args));
        this.zone.run(() => { 
            setTimeout(() => { 
                this.progress = "";
            }, 0) 
         });
        
        this.presentAlert("Download Data For Venue", "Success", "");
      },
      (err) => {
        console.log("err: " + JSON.stringify(err));
      },
      (count) => {
        console.log("progress: " + JSON.stringify(count));
        this.zone.run(() => { 
            setTimeout(() => { 
                this.progress = " (" + count + "%)";
            }, 0) 
         });
      });
  }

  isOfflineForVenueClicked() {
    console.log("isOfflineForVenueClicked...");
    this.offlineManager.isOfflineForVenue(
      "56b20714c3fa800b00d8f0b5",
      "57ec94f8098881c02bdc5eb8",
      (args) => {
        console.log("args: " + JSON.stringify(args));
        this.presentAlert("Is Offline for Venue", "Success", "result: " + JSON.stringify(args));
      },
      (err) => {
        console.log("err: " + JSON.stringify(err));
        this.presentAlert("Is Offline for Venue", "Failed", "result: " + JSON.stringify(err));
      });
  }

  getOfflineVenuesClicked() {
    console.log("getOfflineVenuesClicked...");
    this.offlineManager.getOfflineVenues(
      (args) => {
        console.log("args: " + JSON.stringify(args));
        this.presentAlert("Get Offline Venues", "Success", "result: " + JSON.stringify(args));
      },
      (err) => {
        console.log("err: " + JSON.stringify(err));
        this.presentAlert("Get Offline Venues", "Failed", "result: " + JSON.stringify(err));
      });
  }

  getOfflineUniversesForVenueClicked() {
    console.log("getOfflineUniversesForVenueClicked...");
    this.offlineManager.getOfflineUniversesForVenue(
      "56b20714c3fa800b00d8f0b5",
      (args) => {
        console.log("args: " + JSON.stringify(args));
        this.presentAlert("Get Offline Universes For Venue", "Success", "result: " + JSON.stringify(args));
      },
      (err) => {
        console.log("err: " + JSON.stringify(err));
        this.presentAlert("Get Offline Universes For Venue", "Failed", "result: " + JSON.stringify(err));
      });
  }

  createApiManagerClicked() {
    console.log("createApiManagerClicked...");
    this.apiManager = Mapwize.createApiManager();
  }

  getPlacesWithAliasClicked() {
    console.log("getPlacesWithAliasClicked...");
    this.apiManager.getPlaceWithAlias(
      "mapwize",
      "56b20714c3fa800b00d8f0b5",
      (args) => {
    console.log("getPlacesWithAliasClicked...");
        console.log("getPlacesWithAliasClicked, args: " + JSON.stringify(args));
      },
      (err) => {
        console.log("getPlacesWithAliasClicked, err: " + JSON.stringify(err));
      });
  }

  getPlacePromise(id) {
    let placePromise = new Promise<any>((resolve, reject) => {
      this.apiManager.getPlaceWithId(
      id,
      (args) => {
        console.log("getPlacePromise, args: ");
        resolve(args);
        console.log("getPlacePromise, end");

      },
      (err) => {
        console.log("getPlacePromise, err: " + JSON.stringify(err));
        reject(err);
      });
    })

    return placePromise;
  }

  getDirectionClicked() {
    console.log("getDirectionClicked...");
    let placePromise1 = this.getPlacePromise("5dd5c80332a5f30018856bee");
    let placePromise2 = this.getPlacePromise("5d096370efe1d2001280e5d5");

    Promise.all([placePromise1, placePromise2]).then( async (values) => {
      console.log("getDirectionClicked...values: " + JSON.stringify(values));
      this.apiManager.getDirectionWithFrom(
          values[0],
          values[1],
          false,
          (args) => {
            console.log("***********************************************************************");
            console.log("getDirectionWithFrom, arg: " + JSON.stringify(args));
          },
          (err) => {
            console.log("***********************************************************************");
            console.log("getDirectionWithFrom, err: " + JSON.stringify(err));
          });
    },
    err => {
      console.log("getDirectionClicked, error: " + JSON.stringify(err));
    });
  }

  getDirectionsClicked() {
    let placePromise1 = this.getPlacePromise("574843792337c60b006032f9");
    let placePromise2 = this.getPlacePromise("57036d40b247f50b00a07472");
    let placePromise3 = this.getPlacePromise("5d08d8a4efe1d20012809ee5"); //mapwize

    Promise.all([placePromise1, placePromise2, placePromise3]).then((values) => {
      console.log("Place...values: " + JSON.stringify(values));
      let dp1 = values[0];
      let dp2 = values[1];
      let dp3 = values[2];

      this.apiManager.getDirectionWithFrom(
        dp1,
        dp2,
        false,
        (args) => {
          console.log("***********************************************************************");
          console.log("getDirectionsWithFrom, arg: " + JSON.stringify(args));
        },
        (err) => {
          console.log("***********************************************************************");
          console.log("getDirectionsWithFrom, err: " + JSON.stringify(err));
        });

      this.apiManager.getDirectionWithDirectionPointsFrom(
        dp1,
        [dp2],
        false,
        (args) => {
          console.log("***********************************************************************");
          console.log("getDirectionWithDirectionPointsFrom, arg: " + JSON.stringify(args));
        },
        (err) => {
          console.log("***********************************************************************");
          console.log("getDirectionWithDirectionPointsFrom, err: " + JSON.stringify(err));
        });

      this.apiManager.getDirectionWithWayPointsFrom(
        dp1,
        dp2,
        [dp3],
        false,
        (args) => {
          console.log("***********************************************************************");
          console.log("getDirectionWithWayPointsFrom, arg: " + JSON.stringify(args));
        },
        (err) => {
          console.log("***********************************************************************");
          console.log("getDirectionWithWayPointsFrom, err: " + JSON.stringify(err));
        });

      this.apiManager.getDirectionWithDirectionAndWayPointsFrom(
        dp1,
        [dp2],
        [dp3],
        false,
        (args) => {
          console.log("***********************************************************************");
          console.log("getDirectionWithDirectionAndWayPointsFrom, arg: " + JSON.stringify(args));
        },
        (err) => {
          console.log("***********************************************************************");
          console.log("getDirectionWithDirectionAndWayPointsFrom, err: " + JSON.stringify(err));
        });
    });
   
  }

  getVenuesClicked() {
    this.apiManager.getVenueWithId(
        "56b20714c3fa800b00d8f0b5",
        (args) => {
          console.log("***********************************************************************");
          console.log("getVenueWithId, arg: " + JSON.stringify(args));
        },
        (err) => {
          console.log("***********************************************************************");
          console.log("getVenueWithId, err: " + JSON.stringify(err));
        });

    this.apiManager.getVenueWithName(
        "Euratechnologies",
        (args) => {
          console.log("***********************************************************************");
          console.log("getVenueWithName, arg: " + JSON.stringify(args));
        },
        (err) => {
          console.log("***********************************************************************");
          console.log("getVenueWithName, err: " + JSON.stringify(err));
        });

    this.apiManager.getVenuesWithFilter(
        {floor: 5},
        (args) => {
          console.log("***********************************************************************");
          console.log("getVenuesWithFilter, arg: " + JSON.stringify(args));
        },
        (err) => {
          console.log("***********************************************************************");
          console.log("getVenuesWithFilter, err: " + JSON.stringify(err));
        });
  }

  getPlaceClicked() {
      this.apiManager.getPlaceWithId(
        "574843792337c60b006032f9",
        (args) => {
          console.log("***********************************************************************");
          console.log("getPlaceWithId, arg: " + JSON.stringify(args));
        },
        (err) => {
          console.log("***********************************************************************");
          console.log("getPlaceWithId, err: " + JSON.stringify(err));
        });

      this.apiManager.getPlaceWithName(
        "Niryo-1",
        "56b20714c3fa800b00d8f0b5",
        (args) => {
          console.log("***********************************************************************");
          console.log("getPlaceWithName, arg: " + JSON.stringify(args));
        },
        (err) => {
          console.log("***********************************************************************");
          console.log("getPlaceWithName, err: " + JSON.stringify(err));
        });

      this.apiManager.getPlaceWithAlias(
        "novadvis",
        "56b20714c3fa800b00d8f0b5",
        (args) => {
          console.log("***********************************************************************");
          console.log("getPlaceWithAlias, arg: " + JSON.stringify(args));
        },
        (err) => {
          console.log("***********************************************************************");
          console.log("getPlaceWithAlias, err: " + JSON.stringify(err));
        });

      this.apiManager.getPlacesWithFilter(
        {venueId: "56b20714c3fa800b00d8f0b5"},
        (args) => {
          console.log("***********************************************************************");
          console.log("getPlacesWithFilter, arg: " + JSON.stringify(args));
        },
        (err) => {
          console.log("***********************************************************************");
          console.log("getPlacesWithFilter, err: " + JSON.stringify(err));
        });
  }

  getPlaceListClicked() {
      this.apiManager.getPlaceListWithId(
          "584c46b2d0407c0c00813e6f", //availablemeetingrooms
          (args) => {
            console.log("***********************************************************************");
            console.log("getPlaceListWithId, arg: " + JSON.stringify(args));
          },
          (err) => {
            console.log("***********************************************************************");
            console.log("getPlaceListWithId, err: " + JSON.stringify(err));
          });

      this.apiManager.getPlaceListWithName(
          "availableMeetingRooms",
          "56b20714c3fa800b00d8f0b5",
          (args) => {
            console.log("***********************************************************************");
            console.log("getPlaceListWithName, arg: " + JSON.stringify(args));
          },
          (err) => {
            console.log("***********************************************************************");
            console.log("getPlaceListWithName, err: " + JSON.stringify(err));
          });

      this.apiManager.getPlaceListWithAlias(
          "bathrooms",
          "56b20714c3fa800b00d8f0b5",
          (args) => {
            console.log("***********************************************************************");
            console.log("getPlaceListWithAlias, arg: " + JSON.stringify(args));
          },
          (err) => {
            console.log("***********************************************************************");
            console.log("getPlaceListWithAlias, err: " + JSON.stringify(err));
          });

      this.apiManager.getPlaceListsWithFilter(
          {
           venueId: "56b20714c3fa800b00d8f0b5"},
          (args) => {
            console.log("***********************************************************************");
            console.log("getPlaceListsWithFilter, arg: " + JSON.stringify(args));
          },
          (err) => {
            console.log("***********************************************************************");
            console.log("getPlaceListsWithFilter, err: " + JSON.stringify(err));
          });
  }

  getUniverseClicked() {
      this.apiManager.getUniverseWithId(
            "57ec94f8098881c02bdc5eb8",
            (args) => {
              console.log("***********************************************************************");
              console.log("getUniverseWithId, arg: " + JSON.stringify(args));
            },
            (err) => {
              console.log("***********************************************************************");
              console.log("getUniverseWithId, err: " + JSON.stringify(err));
            });

      this.apiManager.getUniversesWithFilter(
            {venueId: "56b20714c3fa800b00d8f0b5"},
            (args) => {
              console.log("***********************************************************************");
              console.log("getUniversesWithFilter, arg: " + JSON.stringify(args));
            },
            (err) => {
              console.log("***********************************************************************");
              console.log("getUniversesWithFilter, err: " + JSON.stringify(err));
            });

      this.apiManager.getAccessibleUniversesWithVenue(
            "56b20714c3fa800b00d8f0b5",
            (args) => {
              console.log("***********************************************************************");
              console.log("getAccessibleUniversesWithVenue, arg: " + JSON.stringify(args));
            },
            (err) => {
              console.log("***********************************************************************");
              console.log("getAccessibleUniversesWithVenue, err: " + JSON.stringify(err));
            }); 
  }
  
  getShortresult(arr) {
    var res = [];
    arr.forEach(s => {
      res.push({alias: s.alias, name: s.name});
    });

    return res;
  }

  doSearchClicked() {
    console.log("doSearchClicked...");
    this.apiManager.searchWithParams(
        {query: 'MapWize'},
        (args) => {
          console.log("***********************************************************************");
          let res = this.getShortresult(args);
          console.log("searchWithParams, arg: " + JSON.stringify(res));
        },
        (err) => {
          console.log("***********************************************************************");
          console.log("searchWithParams, err: " + JSON.stringify(err));
        }); 
  }

  getDistanceClicked() {
    let placePromise1 = this.getPlacePromise("5dd5c80332a5f30018856bee");
    let placePromise2 = this.getPlacePromise("5d096370efe1d2001280e5d5");

    Promise.all([placePromise1, placePromise2]).then((values) => {
      console.log("Distance...values: " + JSON.stringify(values));
      let from = values[0];
      let toList = [values[1]];
      this.apiManager.getDistancesWithFrom(
        from,
        toList,
        false,
        false,
        (args) => {
          console.log("getDistancesWithFrom, arg: " + JSON.stringify(args));
        },
        (err) => {
          console.log("getDistancesWithFrom, err: " + JSON.stringify(err));
        });
    });

  }

  presentAlert(title: string, subTitle: string, message: string) {
    console.log("presentAlert...");
    const alert = this.alertController.create({
        title: title,
        subTitle: subTitle,
        message: message,
        buttons: ['OK']
      });
    alert.present();
  }
}
