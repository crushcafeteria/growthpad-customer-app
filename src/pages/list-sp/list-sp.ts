import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AccountProvider} from "../../providers/account/account";
import {ToastProvider} from "../../providers/toast/toast";
import {ListSpAdsPage} from "../list-sp-ads/list-sp-ads";

@IonicPage()
@Component({
    selector: 'page-list-sp',
    templateUrl: 'list-sp.html',
})
export class ListSpPage {

    label;
    category;
    radius;
    SPs = null;
    isLoading = true;
    page;
    hasMoreData = true;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public accountProvider: AccountProvider,
                public toast: ToastProvider) {
        this.category = this.navParams.get('category');
        this.label = this.navParams.get('label');
        this.radius = this.navParams.get('radius');

        this.loadSPs();
    }

    reloadPage() {
        this.navCtrl.pop();
        this.navCtrl.push(ListSpPage, {
            category: this.category,
            label: this.label,
            radius: this.radius
        });
        this.toast.show('This page has been reloaded');
    }

    loadSPs() {
        return new Promise(resolve => {
            this.isLoading = true;
            this.accountProvider.getNearbySPs(this.category, this.radius).then(res => {
                console.log(res);
                this.page = res;
                this.SPs = res['data'];
                this.isLoading = false;
                resolve(true)
            });
        });
    }

    loadMore(infiniteScroll) {
        let nextPage = this.page.current_page + 1;

        this.accountProvider.getNearbySPs(this.category, this.radius, nextPage).then(res => {
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
            sp: sp
        });
    }

}
