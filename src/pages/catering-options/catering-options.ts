import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SupportProvider} from "../../providers/support/support";
import {ToastProvider} from "../../providers/toast/toast";
import {ServiceProvidersPage} from "../service-providers/service-providers";

@IonicPage()
@Component({
    selector: 'page-catering-options',
    templateUrl: 'catering-options.html',
})
export class CateringOptionsPage {

    xtype: null
    xattendees: null
    xvenue: null

    public locationQ = '';
    public places
    public isLoading = false;
    public formReady = false;
    public btnHidden = true;
    public counties;
    public county = null;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public supportProvider: SupportProvider,
                public toast: ToastProvider) {
        this.county = this.navParams.get('county');
    }

    saveForm() {
        if (this.validate()) {
            this.navCtrl.push(ServiceProvidersPage, {
                eventOptions: this.makeEventOptions(),
                category: 'CATERING',
                label: 'Catering',
                county: this.county
            }).then(() => { // Page removes iself from nav stack
                const startIndex = this.navCtrl.getActive().index - 1;
                this.navCtrl.remove(startIndex, 1);
            });
        }

    }

    private makeEventOptions() {
        return {
            type: this.xtype,
            attendees: this.xattendees,
            venue: this.xvenue
        }
    }

    validate() {
        if (!this.xtype) {
            this.toast.show('Please choose an event type');
            return false;
        }

        if (!this.xattendees) {
            this.toast.show('Please enter expected attendees');
            return false;
        }

        if (!this.xvenue) {
            this.toast.show('Please choose a venue type');
            return false;
        }

        return true;
    }

}
