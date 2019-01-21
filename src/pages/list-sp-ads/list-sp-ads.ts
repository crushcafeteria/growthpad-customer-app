import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AdProvider} from "../../providers/ad/ad";
import {ViewAdPage} from "../view-ad/view-ad";

@IonicPage()
@Component({
    selector: 'page-list-sp-ads',
    templateUrl: 'list-sp-ads.html',
})
export class ListSpAdsPage {

    SP;
    ads;
    isLoading = true;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public adProvider: AdProvider) {
        this.SP = this.navParams.get('sp');

        // Load SP ads
        this.adProvider.getSPAds(this.SP.id).then(res => {
            this.ads = res;
            this.isLoading = false;
        });
    }

    viewAd(ad) {
        this.navCtrl.push(ViewAdPage, {
            ad: ad
        });
    }

}
