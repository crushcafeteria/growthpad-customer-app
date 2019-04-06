import {Component} from '@angular/core';
import {Events, IonicPage, MenuController, NavController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {Storage} from "@ionic/storage";
import {NetworkProvider} from "../../providers/network/network";
import {LoaderProvider} from "../../providers/loader/loader";
import {AccountProvider} from "../../providers/account/account";
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ToastProvider} from "../../providers/toast/toast";
import _ from 'lodash';
import {SignupPage} from "../signup/signup";
import config from "../../config";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {LocationPage} from "../location/location";

@IonicPage()
@Component({
    selector: 'page-landing',
    templateUrl: 'landing.html',
})
export class LandingPage {

    public loginForm;
    public backgroundImage = 'assets/img/background/background-5.jpg';
    public showPass = true;
    public passType = 'password';
    public usingID = false;

    constructor(public loader: LoaderProvider,
                public navCtrl: NavController,
                public storage: Storage,
                public network: NetworkProvider,
                public accountProvider: AccountProvider,
                public formBuilder: FormBuilder,
                public toast: ToastProvider,
                public iab: InAppBrowser,
                public menuCtrl: MenuController,
                public events: Events) {

        this.loginForm = this.formBuilder.group({
            id: new FormControl(''),
            email: new FormControl(''),
            password: new FormControl('', [Validators.required])
        });

        // Disable sidemenu
        this.menuCtrl.enable(false, 'sidemenu');
    }

    ionViewWillEnter() {
        this.storage.get('token').then(token => {
            if (token) {
                let tsNow = Math.round((new Date()).getTime() / 1000);
                if (tsNow < token.expiry) {
                    this.storage.get('profile').then(profile => {
                        this.toast.show('Welcome back, ' + profile.name + '!');

                        if (!profile.location) {
                            this.navCtrl.setRoot(LocationPage);
                        } else {
                            this.navCtrl.setRoot(HomePage);
                        }
                    });
                }
            }
        });
    }

    login() {
        this.storage.get('online').then(online => {
            if (online) {

                let loader = this.loader.show('Logging in...');
                let credentials = this.loginForm.value;
                this.accountProvider.login(credentials).then(res => {
                    if (_.has(res, 'error')) {
                        this.toast.show(res['error']);
                        loader.dismiss();
                    } else {
                        this.storage.set('profile', res['user']).then(() => {
                            this.storage.set('token', res['token']);
                        }).then(() => {
                            if (!res['user']['location']) {
                                this.navCtrl.setRoot(LocationPage);
                            } else {

                                this.navCtrl.setRoot(HomePage);
                            }
                            loader.dismiss();
                            this.toast.show('Welcome, ' + res['user']['name']);
                        }).then(() => {
                            // Load profile app-wide
                            this.events.publish('logged-in');
                        });
                    }
                });
            } else {
                this.network.showRecovery(null);
            }
        });

    }

    goToSignup() {
        this.navCtrl.push(SignupPage);
    }

    resetPassword() {
        let iab = this.iab.create(config.password_reset_link, '_self', {
            zoom: 'no'
        });
    }

    showPassword(state) {
        this.showPass = state;
        this.passType = (state) ? 'password' : 'text';
    }

    toggleID(state) {
        this.usingID = state;
    }

}
