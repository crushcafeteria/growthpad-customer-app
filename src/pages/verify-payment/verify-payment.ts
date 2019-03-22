import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {PaymentProvider} from "../../providers/payment/payment";
import _ from 'lodash';
import {ToastProvider} from "../../providers/toast/toast";
import {LoaderProvider} from "../../providers/loader/loader";
import {ProfilePage} from "../profile/profile";

@IonicPage()
@Component({
    selector: 'page-verify-payment',
    templateUrl: 'verify-payment.html',
})
export class VerifyPaymentPage {

    public profile: any;
    public activeView: string = 'AUTO';
    public mpesaCode: string = null;
    public interval: any = null;
    public payment: any = null;
    public payments: any = null;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public storage: Storage,
                public paymentProvider: PaymentProvider,
                public toast: ToastProvider,
                public alertCtrl: AlertController,
                public loader: LoaderProvider) {
        this.storage.get('profile').then(profile => {
            console.log(profile)
            this.profile = profile;
        });

        this.startDetecting();
    }

    setVerifyMode(mode) {
        this.activeView = mode;

        if (mode == 'AUTO') {
            this.startDetecting();
        } else {
            clearInterval(this.interval);
        }
    }

    verifyMPESACode() {
        let loader = this.loader.show('Verifying M-PESA...');
        this.paymentProvider.verifyWithMPESACode(this.mpesaCode).then(res => {
            if (_.has(res, 'error')) {
                this.toast.show(res['error'], 6000);
                loader.dismiss();
            } else {
                this.payment = res['payments'];
                loader.dismiss().then(() => {
                    this.confirmAction(this.payment, 'M-PESA Payment Found!');
                });
            }

        });
    }

    // Watch for M-PESA payment in 5 sec intervals
    startDetecting() {
        this.requestPaymentFromServer().then((res) => this.handleServerResponse(res));

        this.interval = setInterval(() => {
            this.requestPaymentFromServer().then((res) => this.handleServerResponse(res));
        }, 5000);
    }

    requestPaymentFromServer() {
        return new Promise(resolve => {
            this.paymentProvider.detectPayment().then(res => {
                resolve(res);
            });
        });
    }

    handleServerResponse(res) {
        console.log(res);
        if (_.has(res, 'error')) {
            this.toast.show('Checking your payment...', 3000);
        } else {
            this.payments = res['payments'];
            clearInterval(this.interval);
        }
    }

    confirmAction(payment, title = 'Confirm this payment?') {

        if (this.activeView == 'CODE') {
            payment = this.payment;
        }

        let confirm = this.alertCtrl.create({
            title: title,
            message: 'Are you sure you want to confirm this payment?',
            buttons: [
                {
                    text: 'Confirm',
                    role: 'cancel',
                    handler: () => {
                        this.applyPayment(payment)
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ],
            enableBackdropDismiss: false
        });
        confirm.present();
    }

    applyPayment(payment) {
        let loader = this.loader.show('Please wait...');

        this.paymentProvider.applyPayment(payment).then(res => {
            console.log(res)
            if (_.has(res, 'error')) {
                this.toast.show(res['error']);
            } else {
                this.storage.set('profile', res['profile']);
                this.toast.show('You have successfully purchased Growthpad credits');
                this.navCtrl.setRoot(ProfilePage);
            }
            loader.dismiss();
        });
    }

}


