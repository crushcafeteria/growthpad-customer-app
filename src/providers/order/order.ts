import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";
import config from "../../config";
import {Authorization} from "../../authorization";

@Injectable()
export class OrderProvider {

    constructor(public http: HttpClient,
                public storage: Storage) {
    }

    createOrder(ad, instructions = null, eventOptions = null, deliveryLocation = null) {
        return new Promise(resolve => {
            this.storage.get('token').then(token => {
                this.http.post(config.url + 'orders', {
                    ad_id: ad.id,
                    instructions: instructions,
                    eventOptions: eventOptions,
                    deliveryLocation: deliveryLocation
                }, {
                    headers: new Authorization().attachToken(token.value)
                }).subscribe(res => {
                    resolve(res);
                })
            });
        });
    }

    getOrders() {
        return new Promise(resolve => {
            this.storage.get('token').then(token => {
                this.http.get(config.url + 'orders', {
                    headers: new Authorization().attachToken(token.value)
                }).subscribe(res => {
                    resolve(res);
                })
            });
        });
    }

    updateOrder(order) {
        return new Promise(resolve => {
            this.storage.get('token').then(token => {
                this.http.post(config.url + 'order/update', {
                    orderID: order.id,
                    status: order.status,
                    instructions: order.instructions
                }, {
                    headers: new Authorization().attachToken(token.value)
                }).subscribe(res => {
                    resolve(res);
                });
            });
        });
    }

    findOrder(orderID) {
        return new Promise(resolve => {
            this.storage.get('token').then(token => {
                this.http.get(config.url + 'order/find?orderID=' + orderID, {
                    headers: new Authorization().attachToken(token.value)
                }).subscribe(res => {
                    resolve(res);
                });
            });
        });
    }

    cancelOrder(order, reason) {
        return new Promise(resolve => {
            this.storage.get('token').then(token => {
                this.http.post(config.url + 'order/cancel', {
                    id: order.id,
                    reason: reason
                }, {
                    headers: new Authorization().attachToken(token.value)
                }).subscribe(res => {
                    resolve(res);
                });
            });
        });
    }

}
