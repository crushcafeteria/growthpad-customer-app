import {Component} from '@angular/core';
import {AlertController, MenuController, NavController, PopoverController} from 'ionic-angular';
import {SearchOptionsComponent} from "../../components/search-options/search-options";
import {AdProvider} from "../../providers/ad/ad";
import {ViewAdPage} from "../view-ad/view-ad";
import {OrdersPage} from "../orders/orders";
import {Storage} from "@ionic/storage";
import {LandingPage} from "../landing/landing";
import {LocationPage} from "../location/location";
import {ToastProvider} from "../../providers/toast/toast";
import {CateringOptionsPage} from "../catering-options/catering-options";
import {SupportProvider} from "../../providers/support/support";
import _ from 'lodash';
import {ListAdsPage} from "../list-ads/list-ads";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    page = null;
    ads = null;
    isLoading = false;
    hasMoreData = true;
    counties = null;
    loop = null;

    constructor(public navCtrl: NavController,
                private popCtrl: PopoverController,
                public adProvider: AdProvider,
                public storage: Storage,
                public menuCtrl: MenuController,
                public toast: ToastProvider,
                public alertCtrl: AlertController,
                public supportProvider: SupportProvider) {
        this.storage.get('profile').then(profile => {
            if (!profile) {
                this.navCtrl.setRoot(LandingPage);
            } else if (!profile.location) {
                this.navCtrl.setRoot(LocationPage);
                this.toast.show('Please add your location first!');
            }
        });

        // Enable sidemenu
        this.menuCtrl.enable(true, 'sidemenu');

        // Get counties
        this.supportProvider.getCounties().then(res => {
            this.counties = res;
        });
    }

    getListings(category, label) {
        this.showCounties(category, label);
    }

    showSearchOptions(event) {
        this.popCtrl.create(SearchOptionsComponent).present({
            ev: event
        });
    }

    goToOrders() {
        this.navCtrl.push(OrdersPage);
    }

    showCounties(category, label) {


        let alert = this.alertCtrl.create();
        alert.setTitle('Choose a county');

        _.forEach(this.counties, function (county) {
            alert.addInput({
                type: 'radio',
                label: county.value,
                value: county.key,
            });
        });

        alert.addButton('Cancel');
        alert.addButton({
            text: 'Continue',
            handler: data => {
                if (category == 'CATERING') {
                    this.navCtrl.push(CateringOptionsPage, {
                        county: data
                    });
                } else {
                    this.navCtrl.push(ListAdsPage, {
                        category: category,
                        label: label,
                        county: data
                    });
                }
            }
        });

        alert.present();
    }

}
