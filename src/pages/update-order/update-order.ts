import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {OrderProvider} from "../../providers/order/order";
import _ from 'lodash';
import {ToastProvider} from "../../providers/toast/toast";
import {LoaderProvider} from "../../providers/loader/loader";
import {ViewOrderPage} from "../view-order/view-order";

@IonicPage()
@Component({
    selector: 'page-update-order',
    templateUrl: 'update-order.html',
})
export class UpdateOrderPage {

    order = null;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public orderProvider: OrderProvider,
                public toast: ToastProvider,
                public loader: LoaderProvider) {
        this.order = this.navParams.get('order');
    }

    updateOrder() {
        let loader = this.loader.show('Updating...');
        this.orderProvider.updateOrder(this.order).then(res => {
            if (_.has('error')) {
                this.toast.show(res['error']);
            } else {
                this.navCtrl.push(ViewOrderPage, {
                    order: res
                });
                this.toast.show('Order successfully updated!');
            }
            loader.dismiss();
        });
    }

}
