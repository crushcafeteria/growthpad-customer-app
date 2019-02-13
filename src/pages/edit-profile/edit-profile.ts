import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {AccountProvider} from "../../providers/account/account";
import _ from 'lodash';
import {ToastProvider} from "../../providers/toast/toast";
import {LoaderProvider} from "../../providers/loader/loader";
import {ProfilePage} from "../profile/profile";
import config from "../../config";
import {InAppBrowser} from "@ionic-native/in-app-browser";

@IonicPage()
@Component({
    selector: 'page-edit-profile',
    templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

    public user;

    constructor(public navCtrl: NavController,
                public storage: Storage,
                public accountProvider: AccountProvider,
                public toast: ToastProvider,
                public loader: LoaderProvider,
                public iab: InAppBrowser) {
    }

    ionViewWillEnter() {
        this.storage.get('profile').then(profile => {
            this.user = profile;
        });
    }

    updateProfile() {
        console.log(this.user)
        let loader = this.loader.show('Updating...');
        this.accountProvider.updateProfile(this.user).then(res => {
            if (_.has(res, 'error')) {
                this.toast.show(res['error']);
            } else {
                this.storage.set('profile', res);
            }
            this.toast.show('Profile updated!');
            this.navCtrl.setRoot(ProfilePage);
            loader.dismiss();
        });
    }

    changePassword() {
        this.iab.create(config.password_reset_link, '_self', {
            zoom: 'no'
        });
    }

}
