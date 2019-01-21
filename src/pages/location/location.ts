import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {SupportProvider} from "../../providers/support/support";
import _ from 'lodash';
import {ToastProvider} from "../../providers/toast/toast";
import {LoaderProvider} from "../../providers/loader/loader";
import {AccountProvider} from "../../providers/account/account";
import {Storage} from "@ionic/storage";
import {UploadProfilePicturePage} from "../upload-profile-picture/upload-profile-picture";
import {LandingPage} from "../landing/landing";
import {HomePage} from "../home/home";

@IonicPage()
@Component({
    selector: 'page-location',
    templateUrl: 'location.html',
})
export class LocationPage {

    public q: string;
    isLoading = false;
    places = null;
    title = 'Add location';
    isAd = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public supportProvider: SupportProvider,
                public toast: ToastProvider,
                public loader: LoaderProvider,
                public accountProvider: AccountProvider,
                public storage: Storage,
                public events: Events) {
        if (this.navParams.get('title')) {
            this.title = this.navParams.get('title');
        }
        if (this.navParams.get('isAd')) {
            this.isAd = true;
            this.title = 'Add a location to this item';
        }
    }

    suggest(event) {
        if (event.target.value && event.target.value.length > 1) {
            this.isLoading = true;
            this.supportProvider.suggestLocations(event.target.value).then(res => {
                if (_.has(res, 'error')) {
                    this.places = null;
                    this.toast.show(res['error']);
                } else {
                    this.places = res;
                }
                this.isLoading = false;
            });
        } else {
            this.places = null;
            this.isLoading = false;
        }
    }

    saveLocation(place) {
        if (this.isAd) {
            this.events.publish('location', place);
            this.navCtrl.pop();
        } else {
            let loader = this.loader.show('Saving...');
            this.storage.set('location', place);
            this.accountProvider.saveLocation(place).then(res => {
                if (res['status'] == 'OK') {
                    this.storage.set('profile', res['user']);
                    this.toast.show('Your location has been successfully stored');

                    if (res['user']['picture']) {
                        this.navCtrl.setRoot(UploadProfilePicturePage);
                    } else {
                        this.navCtrl.setRoot(HomePage);
                    }
                } else {
                    this.toast.show('An error occured. Please try again later');
                }
                loader.dismiss();
            });
        }
    }

    logout() {
        this.storage.clear().then(() => {
            this.navCtrl.setRoot(LandingPage);
            this.toast.show('See you soon!')
        }).then(() => {
            this.storage.set('online', true);
        });
    }

}
