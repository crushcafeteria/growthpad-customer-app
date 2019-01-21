import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {ToastProvider} from "../../providers/toast/toast";
import {HomePage} from "../home/home";
import {Storage} from "@ionic/storage";
import {NetworkProvider} from "../../providers/network/network";
import {LoaderProvider} from "../../providers/loader/loader";
import {AccountProvider} from "../../providers/account/account";

@IonicPage()
@Component({
    selector: 'page-feedback',
    templateUrl: 'feedback.html',
})
export class FeedbackPage {

    @ViewChild('myInput') myInput: ElementRef;

    public message: any = {
        names: null,
        telephone: null,
        email: null,
        message: null
    }
    sending: boolean = false;

    constructor(public navCtrl: NavController,
                public toast: ToastProvider,
                public storage: Storage,
                public network: NetworkProvider,
                public loader: LoaderProvider,
                public accountProvider: AccountProvider) {
        this.storage.get('profile').then(profile=>{
            if(profile){
                this.message.names = profile.name;
                this.message.telephone = profile.telephone;
                this.message.email = profile.email;
                this.message.message = profile.message;
            }
        });
    }

    resize() {
        this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
    }

    sendFeedback() {
        if (this.validating()) {
            this.storage.get('online').then(online => {
                if (online) {
                    let loader = this.loader.show('Sending...');
                    this.accountProvider.sendMessage(this.message).then(res => {
                        if (res['status'] == 'OK') {
                            this.navCtrl.setRoot(HomePage);
                            loader.dismiss();
                            this.toast.show('Your message has been sent. Thank you!');
                        }
                    });
                } else {
                    this.network.showRecovery(null);
                }
            });
        }
    }

    validating() {
        console.log(this.message);

        if (!this.message.names) {
            this.toast.show('Please enter your names');
            return false;
        }

        if (!this.message.email) {
            this.toast.show('Please enter your email address');
            return false;
        }

        if (!this.message.telephone) {
            this.toast.show('Please enter your telephone number');
            return false;
        }

        if (!this.message.message) {
            this.toast.show('Please type your message');
            return false;
        }

        return true;
    }

}
