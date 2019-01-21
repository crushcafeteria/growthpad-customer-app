import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AdProvider} from "../../providers/ad/ad";
import {ViewAdPage} from "../view-ad/view-ad";
import {Storage} from "@ionic/storage";
import {PostAdPage} from "../post-ad/post-ad";

@IonicPage()
@Component({
    selector: 'page-my-ads',
    templateUrl: 'my-ads.html',
})
export class MyAdsPage {

    SP;
    ads;
    isLoading = true;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public adProvider: AdProvider,
                public storage: Storage) {
        this.SP = this.navParams.get('sp');

        // Load SP ads
        this.storage.get('profile').then(profile => {
            this.SP = profile;
        }).then(() => {
            this.adProvider.getSPAds(this.SP.id).then(res => {
                this.ads = res;
                this.isLoading = false;
            });
        });
    }

    viewAd(ad) {
        this.navCtrl.push(ViewAdPage, {
            ad: ad
        });
    }

    goToPostAd() {
        this.navCtrl.push(PostAdPage);
    }
}
