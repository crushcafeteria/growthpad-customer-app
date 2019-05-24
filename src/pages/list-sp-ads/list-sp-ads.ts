import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AdProvider} from "../../providers/ad/ad";
import {ViewAdPage} from "../view-ad/view-ad";
import _ from 'lodash';
import {ToastProvider} from "../../providers/toast/toast";

@IonicPage()
@Component({
    selector: 'page-list-sp-ads',
    templateUrl: 'list-sp-ads.html',
})
export class ListSpAdsPage {

    SP = null;
    ads = null;
    isLoading = true;
    page = null;
    hasMoreData = true;
    eventOptions = null;
    category = null;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public adProvider: AdProvider,
                public toast: ToastProvider) {
        this.category = this.navParams.get('category');
        this.SP = this.navParams.get('sp');
        if (this.category == 'CATERING') {
            this.eventOptions = this.navParams.get('eventOptions');
        }

        // Load SP ads
        this.loadSPInventory();
    }

    viewAd(ad) {
        this.navCtrl.push(ViewAdPage, {
            ad: ad,
            eventOptions: this.eventOptions
        });
    }

    private loadSPInventory(page = 1) {
        return new Promise(resolve => {
            this.isLoading = true;
            this.adProvider.getSPAds(this.SP.id, page).then(res => {
                if (_.has(res, 'error')) {
                    this.toast.show(res['error'], 6000);
                } else {
                    this.page = res;
                    this.ads = res['data'];
                }
                this.isLoading = false;
                resolve(true);
            });
        });
    }

    loadMore(infiniteScroll) {
        let nextPage = this.page.current_page + 1;

        this.adProvider.getSPAds(this.SP.id, nextPage).then(res => {
            this.page = res;
            this.ads = this.ads.concat(res['data']);

            if (this.page.current_page == this.page.last_page) {
                this.hasMoreData = false;
            }
            infiniteScroll.complete();
        });
    }

}
