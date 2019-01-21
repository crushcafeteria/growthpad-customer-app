import {Component} from '@angular/core';
import {ModalController, NavController, PopoverController} from 'ionic-angular';
import {SearchOptionsComponent} from "../../components/search-options/search-options";
import {AdProvider} from "../../providers/ad/ad";
import {ViewAdPage} from "../view-ad/view-ad";
import {OrdersPage} from "../orders/orders";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    page = null;
    ads = null;
    isLoading = false;
    hasMoreData = true;

    loop = null;

    constructor(public navCtrl: NavController,
                private popCtrl: PopoverController,
                public adProvider: AdProvider,
                public modalCtrl: ModalController) {
        this.loadAds();
    }

    loadMore(infiniteScroll) {
        let nextPage = this.page.current_page + 1;

        this.adProvider.getAds(nextPage).then(res => {
            this.page = res;
            for (let i = 0; i < res['data'].length; i++) {
                this.ads.push(res['data'][i]);
            }

            if (this.page.current_page == this.page.last_page) {
                this.hasMoreData = false;
            }

            infiniteScroll.complete();
        });
    }

    showFilters() {
        // let filtersModal = this.modalCtrl.create(CommunityFiltersPage);
        // filtersModal.present();
        //
        // filtersModal.onDidDismiss(data => {
        //     if (data['signal'] == 'APPLY') {
        //         // Apply filters here
        //         this.users = null;
        //         this.exploreProvider.filterCommunity({
        //             location: data.location,
        //             gender: data.gender,
        //             ethnicity: data.ethnicity,
        //         }).then(res => {
        //             this.page = res;
        //             this.users = this.page.data;
        //             this.hasMoreData = false;
        //             this.isSearchResult = true;
        //         });
        //         console.log(data);
        //     } else if (data['signal'] == 'RETRIGGER') {
        //         this.showFilters();
        //     }
        // });
    }

    viewAd(ad) {
        this.navCtrl.push(ViewAdPage, {
            ad: ad
        });
    }

    reloadPage(refresher) {
        this.loadAds().then(() => {
            refresher.complete();
        });
    }

    loadAds(pageNo = 1) {
        return new Promise(resolve => {
            this.isLoading = true;
            this.adProvider.getAds(pageNo).then(res => {
                this.page = res;
                this.ads = res['data'];
                this.isLoading = false;
                resolve(true)
            });
        });
    }

    showSearchOptions(event) {
        this.popCtrl.create(SearchOptionsComponent).present({
            ev: event
        });
    }

    goToOrders() {
        this.navCtrl.push(OrdersPage);
    }

}
