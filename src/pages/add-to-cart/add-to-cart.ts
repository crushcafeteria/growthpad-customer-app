import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {LoaderProvider} from "../../providers/loader/loader";
import {OrderProvider} from "../../providers/order/order";
import {OrdersPage} from "../orders/orders";
import {ToastProvider} from "../../providers/toast/toast";
import {Storage} from "@ionic/storage";
import config from "../../config";
import {LocationPage} from "../location/location";
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

        console.log(this.eventOptions, this.ad);
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
                this.toast.show('An error occured while processing your order');
            }
            loader.dismiss();
        });
    }

    changeLocation() {
        this.navCtrl.push(LocationPage, {
            next: ProfilePage,
            title: 'Change delivery location'
        });
    }

}
