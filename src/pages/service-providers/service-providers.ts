import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AccountProvider} from "../../providers/account/account";
import {ToastProvider} from "../../providers/toast/toast";
import {ListSpAdsPage} from "../list-sp-ads/list-sp-ads";
import _ from 'lodash';

@IonicPage()
@Component({
    selector: 'page-service-providers',
    templateUrl: 'service-providers.html',
})
export class ServiceProvidersPage {

    label;
    category;
    SPs = null;
    isLoading = true;
    page;
    hasMoreData = true;
    county;
    eventOptions = null;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public accountProvider: AccountProvider,
                public toast: ToastProvider) {
        this.category = this.navParams.get('category');
        this.label = this.navParams.get('label');
        this.county = this.navParams.get('county');
        if (this.category == 'CATERING') {
            this.eventOptions = this.navParams.get('eventOptions');
        }
        this.loadSPs();
    }

    reloadPage() {
        this.navCtrl.pop();
        this.navCtrl.push(ServiceProvidersPage, {
            category: this.category,
            label: this.label,
            county: this.county,
            eventOptions: (this.eventOptions) ? this.eventOptions : null
        });
        this.toast.show('This page has been reloaded');
    }

    loadSPs() {
        return new Promise(resolve => {
            this.isLoading = true;
            this.accountProvider.getSPByCounty(this.category, this.county).then(res => {
                console.log(_.size(res['data']));
                this.page = res;
                if (!_.size(res['data'])) {
                    this.SPs = null;
                    console.log('Nulll!')
                } else {
                    this.SPs = res['data'];
                }
                this.isLoading = false;
                resolve(true)
            });
        });
    }

    loadMore(infiniteScroll) {
        let nextPage = this.page.current_page + 1;

        this.accountProvider.getSPByCounty(this.category, this.county, nextPage).then(res => {
            this.page = res;
            for (let i = 0; i < res['data'].length; i++) {
                this.SPs.push(res['data'][i]);
            }

            if (this.page.current_page == this.page.last_page) {
                this.hasMoreData = false;
            }

            infiniteScroll.complete();
        });
    }

    viewSPAds(sp) {
        this.navCtrl.push(ListSpAdsPage, {
            category: this.category,
            sp: sp,
            eventOptions: this.eventOptions
        });
    }


}
