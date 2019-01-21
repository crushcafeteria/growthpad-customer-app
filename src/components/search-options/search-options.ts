import {Component} from '@angular/core';
import {AlertController, ModalController, NavController, NavParams, ViewController} from "ionic-angular";
import {KeywordPage} from "../../pages/search/keyword/keyword";
import {ListSpPage} from "../../pages/list-sp/list-sp";

@Component({
    selector: 'search-options',
    templateUrl: 'search-options.html'
})

export class SearchOptionsComponent {

    label;
    category;

    constructor(private modalCtrl: ModalController,
                public navParam: NavParams,
                public viewCtrl: ViewController,
                public alertCtrl: AlertController,
                public navCtrl: NavController) {
        this.label = this.navParam.get('label');
        this.category = this.navParam.get('category');
    }

    displaySearchBox() {
        let searchModal = this.modalCtrl.create(KeywordPage);
        searchModal.present();

        searchModal.onDidDismiss(data => {
            this.viewCtrl.dismiss(data.q);
        });
    }

    getRadius() {
        let alert = this.alertCtrl.create();
        alert.setTitle('How wide do you want to search?');

        alert.addInput({
            type: 'radio',
            label: '5 kilometres',
            value: '5',
        });
        alert.addInput({
            type: 'radio',
            label: '10 kilometres',
            value: '10',
        });
        alert.addInput({
            type: 'radio',
            label: '15 kilometres',
            value: '15',
            checked: true
        });
        alert.addInput({
            type: 'radio',
            label: '20 kilometres',
            value: '20',
        });

        alert.addButton('Cancel');
        alert.addButton({
            text: 'Search nearby',
            handler: radius => {
                this.navCtrl.push(ListSpPage, {
                    radius: radius,
                    label: this.label,
                    category: this.category
                });
            }
        });
        alert.present();
    }
}
