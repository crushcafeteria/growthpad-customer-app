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

    xtype: null
    xattendees: null
    xvenue: null
    xlocation: null

    public locationQ = '';
    public places
    public isLoading = false;
    public formReady = false;
    public btnHidden = true;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public supportProvider: SupportProvider,
                public toast: ToastProvider) {
    }

    suggestLocation() {
        this.xlocation = null;
        if (this.locationQ.length > 2) {
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
        this.xlocation = place;
        this.locationQ = place.display_name;
        this.places = null;
        this.validate()
    }

    saveForm() {
        this.navCtrl.push(ListAdsPage, {
            eventOptions: this.makeEventOptions(),
            category: 'CATERING',
            label: 'Caterers',
        });
    }

    private makeEventOptions() {
        return {
            type: this.xtype,
            attendees: this.xattendees,
            venue: this.xvenue,
            location: this.xlocation,
        }
    }

    validate() {
        console.log(this.makeEventOptions(), this.locationQ)
        let hasError = false;
        let errors = new Array();
        if (!this.xtype) {
            hasError = true
            errors.push('Please choose an event type')
        }

        if (!this.xattendees) {
            hasError = true
            errors.push('Please enter expected attendees')
        }

        if (!this.xvenue) {
            hasError = true
            errors.push('Please choose a venue type')
        }

        if (!this.xlocation) {
            hasError = true
            errors.push('Please add your location')
        }

        if (hasError) {
            this.btnHidden = true;
            this.formReady = false;
            this.toast.show(errors.join('\n* '))
        } else {
            this.btnHidden = false;
            this.formReady = true;
        }
    }

}
