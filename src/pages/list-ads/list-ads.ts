import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {SearchOptionsComponent} from "../../components/search-options/search-options";
import {AdProvider} from "../../providers/ad/ad";
import {ToastProvider} from "../../providers/toast/toast";
import {ViewAdPage} from "../view-ad/view-ad";
import {SupportProvider} from "../../providers/support/support";
import _ from 'lodash';
import config from "../../config";

@IonicPage()
@Component({
    selector: 'page-list-ads',
    templateUrl: 'list-ads.html',
})
export class ListAdsPage {

    category;
    label;
    isLoading = false;
    page = null;
    ads = null;
    hasMoreData = true;
    search = false;
    q = null;
    step = 1;
    radius = config.default_radius;
    places = null;
    params = {
        item: null,
        locationQ: null,
        location: null
    }

    public eventOptions = null;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private popCtrl: PopoverController,
                public adProvider: AdProvider,
                public toast: ToastProvider,
                public supportProvider: SupportProvider,
                public alertCtrl: AlertController) {
        this.category = this.navParams.get('category');
        this.label = this.navParams.get('label');

        if (this.category == 'CATERING') {
            this.eventOptions = this.navParams.get('eventOptions');

            // Load caterers around the area
            this.isLoading = true
            this.adProvider.nearByAds(this.category, 'EVERYTHING', this.radius).then(res => {
                this.ads = res;
                this.isLoading = false;
                this.step = 2;
            });
        }
    }

    showSearchOptions(event) {
        let popover = this.popCtrl.create(SearchOptionsComponent, {
            label: this.label,
            category: this.category
        });
        popover.present({
            ev: event
        });

        popover.onDidDismiss(q => {
            this.search = (q) ? true : false

            if (q) {
                this.q = q;
                this.searchAds(this.category, q);
            }
        });
    }

    loadAds(pageNo = 1) {
        return new Promise(resolve => {
            this.isLoading = true;
            this.adProvider.getAds(this.category, pageNo).then(res => {
                this.page = res;
                this.ads = res['data'];
                this.isLoading = false;
                resolve(true)
            });
        });
    }

    loadMore(infiniteScroll) {
        let nextPage = this.page.current_page + 1;

        if (this.search == true) {
            this.adProvider.searchAds(this.category, this.q, nextPage).then(res => {
                this.page = res;
                for (let i = 0; i < res['data'].length; i++) {
                    this.ads.push(res['data'][i]);
                }

                if (this.page.current_page == this.page.last_page) {
                    this.hasMoreData = false;
                }

                infiniteScroll.complete();
            });
        } else {
            this.adProvider.getAds(this.category, nextPage).then(res => {
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
    }

    searchAds(category, q) {
        this.ads = this.page = null;
        return new Promise(resolve => {
            this.isLoading = true;
            this.adProvider.searchAds(category, q).then(res => {
                this.page = res;
                this.ads = res['data'];
                this.isLoading = false;
                resolve(true)
            });
        });
    }

    reloadPage() {
        this.navCtrl.pop();
        this.navCtrl.push(ListAdsPage, {
            category: this.category,
            label: this.label
        });
        this.toast.show('This page has been reloaded');
    }

    viewAd(ad) {
        this.navCtrl.push(ViewAdPage, {
            ad: ad,
            eventOptions: this.eventOptions
        });
    }

    suggestLocation() {
        if (this.params.item && this.params.locationQ) {
            if (this.params.locationQ && this.params.locationQ.length > 1) {

                this.isLoading = true;
                this.places = null;
                this.step = 1;

                this.supportProvider.suggestLocations(this.params.locationQ).then(res => {
                    if (_.has(res, 'error')) {
                        this.places = null;
                        this.toast.show(res['error']);
                    } else {
                        this.places = res;
                    }
                    this.isLoading = false;
                });
            } else {
                this.places = null;
                this.isLoading = false;
            }
        }
    }

    saveLocation(place) {
        this.params.location = place;
        this.places = null;
        this.isLoading = true;

        // Load ads
        this.adProvider.nearByAds(this.category, this.params.item, this.radius).then(res => {
            this.ads = res;
            this.isLoading = false;
            this.step = 2;
        });
    }

    findMatches() {
        this.isLoading = true;
    }

    changeRadius() {
        let alert = this.alertCtrl.create();
        alert.setTitle('How wide do you want to search?');

        alert.addInput({
            type: 'radio',
            label: '5 kilometres',
            value: '5',
        });
        alert.addInput({
            type: 'radio',
            label: '10 kilometres',
            value: '10',
        });
        alert.addInput({
            type: 'radio',
            label: '20 kilometres',
            value: '20',
        });
        alert.addInput({
            type: 'radio',
            label: '40 kilometres',
            value: '40',
        });
        alert.addInput({
            type: 'radio',
            label: '60 kilometres',
            value: '60',
        });

        alert.addButton('Cancel');
        alert.addButton({
            text: 'Search nearby',
            handler: radius => {
                this.radius = radius;
                this.toast.show('Search radius set to ' + this.radius + ' kilometres');
            }
        });
        alert.present();
    }
}
