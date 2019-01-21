import {Component, ViewChild} from '@angular/core';
import {Events, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {LandingPage} from "../pages/landing/landing";
import {NetworkProvider} from "../providers/network/network";
import {Storage} from "@ionic/storage";
import {ToastProvider} from "../providers/toast/toast";
import config from "../config";
import {ProfilePage} from "../pages/profile/profile";
import {OrdersPage} from "../pages/orders/orders";
import {CodePush, InstallMode, SyncStatus} from '@ionic-native/code-push';
import {FeedbackPage} from "../pages/feedback/feedback";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = LandingPage;
    pages: Array<{ title: string, component: any, icon: string }>;
    pingTries = 0;
    offlineMsgDisplayed = false;
    user = null;
    config: any;

    constructor(public platform: Platform,
                public statusBar: StatusBar,
                public splashScreen: SplashScreen,
                public network: NetworkProvider,
                public storage: Storage,
                public toast: ToastProvider,
                public events: Events,
                public codePush: CodePush) {
        this.initializeApp();

        // Side menu
        this.pages = [
            {title: 'Home', component: HomePage, icon: 'home'},
            {title: 'Placed Orders', component: OrdersPage, icon: 'cart'},
            {title: 'My Profile', component: ProfilePage, icon: 'contact'},
            {title: 'Feedback', component: FeedbackPage, icon: 'mail'},
            // {title: 'My Ads', component: MyAdsPage, icon: 'list-box'},
        ];

        // Load global config
        this.config = config;

        // Load user profile on login
        this.events.subscribe('logged-in', () => {
            this.loadProfile();
        });

        // Try to load profile on every page reload
        this.loadProfile();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            this.storage.set('online', true);
            this.monitorNetConnection();

            // Check update
            this.checkUpdates();

            // Check session validity
            setInterval(() => {
                this.checkSessionValidity();
            }, 3000)
        });
    }

    monitorNetConnection(timeout = 8000) {
        setInterval(() => {
            this.network.isOnline().then(res => {
                if (res) {
                    this.storage.set('online', true);
                    this.pingTries = 0;

                    if (this.offlineMsgDisplayed) {
                        this.toast.show('You are back online!');
                        this.offlineMsgDisplayed = false;
                    }
                } else {
                    this.storage.set('online', false);
                    this.pingTries = this.pingTries + 1;
                }
            });
        }, timeout);

        // Show network disconnected msg
        setInterval(() => {
            if (this.pingTries > 0) {
                if (!this.offlineMsgDisplayed) {
                    this.toast.show('Internet disconnected. Please ensure your data connection is active.', 6000);
                }
                this.offlineMsgDisplayed = true;
            }
        }, 1000);
    }

    logout() {
        this.storage.clear().then(() => {
            this.nav.setRoot(LandingPage);
            this.toast.show('See you soon!')
        }).then(() => {
            this.storage.set('online', true);
        });
    }

    openPage(page) {
        this.nav.setRoot(page.component);
    }

    openProfile() {
        this.nav.setRoot(ProfilePage);
    }

    loadProfile() {
        this.storage.get('profile').then(profile => {
            if (profile) {
                this.user = profile;
            }
        });
    }

    checkUpdates() {
        this.codePush.sync({
            updateDialog: {
                appendReleaseDescription: true,
                descriptionPrefix: "\n\nMESSAGE:\n"
            },
            installMode: InstallMode.ON_NEXT_RESTART
        }).subscribe((status) => {
                if (status == SyncStatus.CHECKING_FOR_UPDATE) {
                    this.toast.show('Checking for updates...');
                } else if (status == SyncStatus.DOWNLOADING_PACKAGE) {
                    this.toast.show('Downloading update in background...');
                } else if (status == SyncStatus.INSTALLING_UPDATE) {
                    this.toast.show('Installing update and restarting...');
                } else if (status == SyncStatus.UP_TO_DATE) {
                    this.toast.show('You are now running the latest version of Growthpad Customer');
                }
            },
            (err) => {
                console.log('CODE PUSH ERROR: ' + err);
            });
    }


    checkSessionValidity() {
        this.storage.get('token').then(token => {
            if (token) {
                let now = Math.round((new Date()).getTime() / 1000);
                if (now > token.expiry) {
                    this.storage.clear().then(() => {
                        this.nav.setRoot(LandingPage);
                        this.toast.show('Your session has expired!. Please login again');
                    }).then(() => {
                        this.storage.set('online', true);
                    });
                } else {
                    console.log('Session is valid');
                }
            }
        });
    }
}
