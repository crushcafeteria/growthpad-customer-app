import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import settings from "../../config";
import 'rxjs/add/operator/timeout';
import {AlertController} from "ionic-angular";

@Injectable()
export class NetworkProvider {

    constructor(public http: HttpClient,
                public alertCtrl: AlertController) {
    }

    isOnline(userID, timeout = 6000) {
        return new Promise(resolve => {
            this.http.get(settings.url + 'ping/' + userID).timeout(timeout).subscribe(res => {
                resolve(res)
            }, err => {
                resolve(err);
            });
        });
    }

    showRecovery(handler) {
        let disconnected = this.alertCtrl.create({
            title: 'No Internet',
            message: 'We could not detect an Internet connection. Please switch on your data or connect to WiFi',
            buttons: [
                {
                    text: 'Reconnect Internet',
                    handler: handler
                }
            ]
        });
        disconnected.present();
    }

}
