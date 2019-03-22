import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {LoaderProvider} from "../../providers/loader/loader";
import {OrderProvider} from "../../providers/order/order";
import {OrdersPage} from "../orders/orders";
import {ToastProvider} from "../../providers/toast/toast";
import {Storage} from "@ionic/storage";
import config from "../../config";
import {ProfilePage} from "../profile/profile";

@IonicPage()
@Component({
    selector: 'page-add-to-cart',
    templateUrl: 'add-to-cart.html',
})
export class AddToCartPage {

    ad = null;
    instructions = null;
    user;
    config;
    eventOptions = null;
    deliveryLocation = null;
    canAddExtraInstructions = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl: ViewController,
                public loader: LoaderProvider,
                public orderProvider: OrderProvider,
                public toast: ToastProvider,
                public storage: Storage) {
        this.ad = navParams.get('ad');
        this.eventOptions = navParams.get('eventOptions');
        this.deliveryLocation = navParams.get('deliveryLocation');

        this.storage.get('profile').then(profile => {
            this.user = profile;
        });

        this.config = config
    }

    closeModal() {
        this.viewCtrl.dismiss();
    }

    createOrder() {
        let loader = this.loader.show('Ordering...');

        this.orderProvider.createOrder(this.ad, this.instructions, this.eventOptions, this.deliveryLocation).then(res => {
            if (res['status'] == 'OK') {
                this.toast.show('Your order has been received!', 6000);
                this.navCtrl.setRoot(OrdersPage);
            } else {
                this.toast.show(res['error']);
            }
            loader.dismiss();
        });
    }

    changeLocation() {
        this.navCtrl.push(ProfilePage);
    }

    showExtraInstructions() {
        this.canAddExtraInstructions = true;
    }

}
