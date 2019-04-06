import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {FormBuilder, Validators} from "@angular/forms";
import {LandingPage} from "../landing/landing";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import config from "../../config";
import {SupportProvider} from "../../providers/support/support";
import {LoaderProvider} from "../../providers/loader/loader";
import {ToastProvider} from "../../providers/toast/toast";
import {AccountProvider} from "../../providers/account/account";
import {Storage} from "@ionic/storage";
import _ from 'lodash';
import {NetworkProvider} from "../../providers/network/network";

@IonicPage()
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html',
})
export class SignupPage {

    public signUpForm;
    public counties = null;
    public config;

    constructor(public navCtrl: NavController,
                public formBuilder: FormBuilder,
                public iab: InAppBrowser,
                public supportProvider: SupportProvider,
                public loader: LoaderProvider,
                public toast: ToastProvider,
                public accountProvider: AccountProvider,
                public storage: Storage,
                public network: NetworkProvider) {
        this.signUpForm = this.formBuilder.group({
            name: [null, Validators.required],
            email: [null, Validators.compose([Validators.required, Validators.email])],
            telephone: [null, Validators.required],
            gender: [null, Validators.required],
            password: [null, Validators.required],
            accept: [null, Validators.required],
        });
        this.config = config;
    }

    ionViewWillEnter() {
        this.supportProvider.getCounties().then(res => {
            this.counties = res;
        });
    }

    goToLogin() {
        this.navCtrl.setRoot(LandingPage);
    }

    resetPassword() {
        this.iab.create(config.password_reset_link, '_self', {
            zoom: 'no',
        });
    }

    signUp() {
        if(!this.signUpForm.value.accept) {
            alert('You MUST accept the terms and conditions');
        } else {
            this.storage.get('online').then(online => {
                if (online) {
                    let loader = this.loader.show('Signing up...');
                    this.accountProvider.signup(this.signUpForm.value).then(res => {
                        if (_.has(res, 'error')) {
                            this.toast.show(res['error']);
                        } else {
                            this.toast.show('Account registered! Please login to proceed');
                            this.navCtrl.setRoot(LandingPage);
                        }
                        loader.dismiss();
                    });
                } else {
                    this.network.showRecovery(null);
                }
            });
        }
    }

}
