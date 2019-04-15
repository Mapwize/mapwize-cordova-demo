import { Component } from '@angular/core';
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
  onLoadActionCallback: any;
  tapOnPlaceInfoCallback: any;

  constructor(public navCtrl: NavController,
              private alertController: AlertController) {

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
        // centerOnPlaceId: "5bc49413bf0ed600114db212"
        showCloseButton: "true"
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
