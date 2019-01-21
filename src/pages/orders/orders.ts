import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {OrderProvider} from "../../providers/order/order";
import {ViewOrderPage} from "../view-order/view-order";
import {ToastProvider} from "../../providers/toast/toast";
import {HomePage} from "../home/home";

@IonicPage()
@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
})
export class OrdersPage {

    orders = null;
    isLoading = true;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public orderProvider: OrderProvider,
                public toast: ToastProvider) {
        this.loadOrders();
    }

    viewOrder(order) {
        this.navCtrl.push(ViewOrderPage, {
            order: order
        });
    }

    reloadPage(refresher) {
        this.loadOrders().then(() => {
            this.toast.show('Orders reloaded!');
            refresher.complete();
        });
    }

    loadOrders() {
        return new Promise(resolve => {
            this.orderProvider.getOrders().then(res => {
                this.orders = res;
                this.isLoading = false;
                resolve(true);
            });
        });
    }

    goToHome() {
        this.navCtrl.setRoot(HomePage);
    }

}
