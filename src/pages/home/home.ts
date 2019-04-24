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

  create() {
    console.log("createClicked...");
    this.mapwizeView = Mapwize.createMapwizeView(
      {
        floor: 0,
        language: "en",
        universeId: "",
        restrictContentToVenueId: "",
        restrictContentToOrganizationId: "",
        showCloseButton: false
        // centerOnVenueId: "56b20714c3fa800b00d8f0b5",
        // centerOnPlaceId: "5bc49413bf0ed600114db212"
      }, () => {
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
        centerOnVenueId: "56b20877c3fa800b00d8f0b7",
        showCloseButton: true
      }, () => {
        console.log("createMapwizeView success...");
      }, (err) => {
        console.log("createMapwizeView failed, err: " + JSON.stringify(err));

      });
    this.setCallback();
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
        "5b28f9ac15007a001396cf81", true, 
        (res) => {console.log("Select place successfully returned: " + JSON.stringify(res))},
        (err) => {console.log("Select place failed err: " + JSON.stringify(err))}
      );
  }

  selectPlaceList() {
    console.log("selectPlaceList...");
    this.mapwizeView.selectPlaceList(
        "57849c0f81bdd00b0039689d", 
        (res) => {console.log("Select places successfully returned: " + JSON.stringify(res))},
        (err) => {console.log("Select places failed err: " + JSON.stringify(err))}
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
        {
          DidLoad: (arg) => {
            console.log("The cordova result(DidLoad)...");
            // this.selectPlace();
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
        }
      );
  }

  createOfflineManagerClicked() {
    console.log("downloadDataForVenueClicked...");
    this.offlineManager = Mapwize.createOfflineManager("https://outdoor.mapwize.io/styles/mapwize/style.json?key=49bbfb7a60b958d76bbf57fc674c93de");
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
        console.log("args: " + JSON.stringify(args));
      },
      (err) => {
        console.log("err: " + JSON.stringify(err));
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
