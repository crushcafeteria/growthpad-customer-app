import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SupportProvider} from "../../providers/support/support";
import _ from 'lodash';
import {ToastProvider} from "../../providers/toast/toast";
import {ListAdsPage} from "../list-ads/list-ads";

@IonicPage()
@Component({
    selector: 'page-catering-options',
    templateUrl: 'catering-options.html',
})
export class CateringOptionsPage {

    public Xevent: any =  {
        type: 'WEDDING',
        attendees: 10,
        venue: 'OUTDOOR',
        location: null
    }

    public locationQ;
    public places
    public isLoading = false;
    public formReady = false;
    public btnDisabled = true;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public supportProvider: SupportProvider,
                public toast: ToastProvider) {
    }

    suggestLocation() {
        this.Xevent.location = null;
        this.validate();

        if(this.locationQ.length > 2){
            this.isLoading = true;
            this.supportProvider.suggestLocations(this.locationQ).then(res => {
                if (_.has(res, 'error')) {
                    this.places = null;
                    this.toast.show(res['error']);
                } else {
                    this.places = res;
                }
                this.isLoading = false;
            });
        }
    }

    saveLocation(place) {
        this.Xevent.location = place;
        this.locationQ = place.display_name;
        this.places = null;
        this.validate();
    }

    saveForm() {
        this.navCtrl.push(ListAdsPage, {
            eventOptions: this.Xevent,
            category: 'CATERING',
            label: 'Caterers',
        });
    }

    validate() {
        if (!this.Xevent.type || !this.Xevent.attendees || !this.Xevent.venue || !this.Xevent.location || !this.locationQ) {
            this.btnDisabled = true;
            this.formReady = false;
        } else {
            this.btnDisabled = false;
            this.formReady = true;
        }

        console.log(this.Xevent, this.locationQ);
    }

}
