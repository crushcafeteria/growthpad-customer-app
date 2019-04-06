import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UpdateOrderPage} from "../update-order/update-order";
import {OrderProvider} from "../../providers/order/order";
import {Storage} from "@ionic/storage";
import {LoaderProvider} from "../../providers/loader/loader";
import _ from 'lodash';
import {ToastProvider} from "../../providers/toast/toast";

@IonicPage()
@Component({
    selector: 'page-view-order',
    templateUrl: 'view-order.html',
})
export class ViewOrderPage {

    public order;
    public profile;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public orderProvider: OrderProvider,
                public alertCtrl: AlertController,
                public loader: LoaderProvider,
                public toast: ToastProvider,
                public storage: Storage) {
        this.order = this.navParams.get('order');

        this.storage.get('profile').then(profile => {
            this.profile = profile;
        });
    }

    ionViewWillEnter() {
        this.orderProvider.findOrder(this.order.id).then(order => {
            this.order = order;
        });
    }

    showUpdateOrderForm() {
        this.navCtrl.push(UpdateOrderPage, {
            order: this.order
        });
    }

    cancelOrder(reason) {
        let loader = this.loader.show('Cancelling...');
        this.orderProvider.cancelOrder(this.order, reason).then(res => {
            if (_.has(res, 'error')) {
                this.toast.show(res['error']);
            } else {
                loader.dismiss();
                this.loadOrder().then(() => {
                    this.toast.show('You have cancelled this order');
                    loader.dismiss();
                });
            }
        });
    }

    showCancelPrompt() {
        const prompt = this.alertCtrl.create({
            title: 'Cancellation Reason',
            message: "Why are you cancelling this order?",
            inputs: [
                {
                    name: 'reason',
                    placeholder: 'Type a reason...'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Confirm',
                    handler: data => {
                        if(!data.reason){
                            this.toast.show('Please enter a cancellation reason!');
                        } else {
                            this.cancelOrder(data.reason);
                        }
                    }
                }
            ]
        });
        prompt.present();
    }

    loadOrder() {
        return new Promise(resolve => {
            this.orderProvider.findOrder(this.order.id).then(res => {
                this.order = res;
                resolve(true);
            });
        });
    }
}
