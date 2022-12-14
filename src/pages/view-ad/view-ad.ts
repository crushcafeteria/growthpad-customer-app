import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {AddToCartPage} from "../add-to-cart/add-to-cart";
import config from "../../config";

@IonicPage()
@Component({
    selector: 'page-view-ad',
    templateUrl: 'view-ad.html',
})
export class ViewAdPage {

    ad = null;
    profile = null;
    eventOptions = null;
    deliveryLocation = null;
    config;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public storage: Storage,
                public modalCtrl: ModalController) {
        this.ad = navParams.get('ad');
        this.eventOptions = navParams.get('eventOptions');
        this.config = config;

        this.storage.get('profile').then(profile => {
            this.profile = profile;
        });
    }

    addToCart(ad) {
        this.navCtrl.push(AddToCartPage, {
            ad: ad,
            eventOptions: this.eventOptions,
            deliveryLocation: this.deliveryLocation
        });
    }

}
