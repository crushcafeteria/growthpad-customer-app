import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AlertController} from "ionic-angular";

@Injectable()
export class AlertProvider {

    constructor(public http: HttpClient,
                public alertCtrl: AlertController) {
    }


    message(message, title = 'Message', button: any = 'OK') {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: [button]
        });

        alert.present();
    }

    prompt(inputConfig, buttonConfig, title) {
        let prompt = this.alertCtrl.create({
            title: title,
            inputs: [
                {
                    name: inputConfig.name,
                    placeholder: inputConfig.placeholder,
                    type: 'number'
                },
            ],
            buttons: buttonConfig
        });

        prompt.present();
    }

}
