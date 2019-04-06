import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AdProvider} from "../../providers/ad/ad";
import {ViewAdPage} from "../view-ad/view-ad";
import _ from 'lodash';

@IonicPage()
@Component({
    selector: 'page-list-sp-ads',
    templateUrl: 'list-sp-ads.html',
})
export class ListSpAdsPage {

    SP = null;
    ads = null;
    isLoading = true;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public adProvider: AdProvider) {
        this.SP = this.navParams.get('sp');

        // Load SP ads
        this.adProvider.getSPAds(this.SP.id).then(res => {
            if(!_.has(res, 'error')){
                this.ads = res;
            }
            this.isLoading = false;
        });
    }

    viewAd(ad) {
        this.navCtrl.push(ViewAdPage, {
            ad: ad
        });
    }

}
