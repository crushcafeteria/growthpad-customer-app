import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";
import config from "../../config";
import {Authorization} from "../../authorization";

@Injectable()
export class PaymentProvider {

    constructor(public http: HttpClient,
                public storage: Storage) {
    }

    detectPayment() {
        return new Promise(resolve => {
            this.storage.get('token').then(token => {
                this.http.get(config.url + 'payment/detect', {
                    headers: new Authorization().attachToken(token.value)
                }).subscribe(res => {
                    resolve(res);
                })
            });
        });
    }

    verifyWithMPESACode(code) {
        return new Promise(resolve => {
            this.storage.get('token').then(token => {
                this.http.get(config.url + 'payment/detect/' + code, {
                    headers: new Authorization().attachToken(token.value)
                }).subscribe(res => {
                    resolve(res);
                })
            });
        });
    }

    applyPayment(payment) {
        return new Promise(resolve => {
            this.storage.get('token').then(token => {
                this.http.post(config.url + 'payment/apply/' + payment.id, null, {
                    headers: new Authorization().attachToken(token.value)
                }).subscribe(res => {
                    resolve(res);
                })
            });
        });
    }

}

