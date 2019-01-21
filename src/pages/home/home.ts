import {Component} from '@angular/core';
import {MenuController, NavController, PopoverController} from 'ionic-angular';
import {SearchOptionsComponent} from "../../components/search-options/search-options";
import {AdProvider} from "../../providers/ad/ad";
import {ViewAdPage} from "../view-ad/view-ad";
import {OrdersPage} from "../orders/orders";
import {ListAdsPage} from "../list-ads/list-ads";
import {PostAdPage} from "../post-ad/post-ad";
import {Storage} from "@ionic/storage";
import {LandingPage} from "../landing/landing";
import {LocationPage} from "../location/location";
import {ToastProvider} from "../../providers/toast/toast";
import {CateringOptionsPage} from "../catering-options/catering-options";

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
                public storage: Storage,
                public menuCtrl: MenuController,
                public toast: ToastProvider) {
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

    getListings(category, label) {
        if(category == 'CATERING'){
            this.navCtrl.push(CateringOptionsPage);
        } else {
            this.navCtrl.push(ListAdsPage, {
                category: category,
                label: label
            });
        }
    }

    showSearchOptions(event) {
        this.popCtrl.create(SearchOptionsComponent).present({
            ev: event
        });
    }

    goToOrders() {
        this.navCtrl.push(OrdersPage);
    }

    postAd() {
        this.navCtrl.push(PostAdPage);
    }

}
