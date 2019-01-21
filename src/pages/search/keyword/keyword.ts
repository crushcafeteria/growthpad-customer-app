import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-keyword',
    templateUrl: 'keyword.html',
})
export class KeywordPage {

    category;
    q = null;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl: ViewController) {
        this.category = this.navParams.get('category');
    }

    search(event) {
        this.q = event.target.value;
    }

    dismiss() {
        this.viewCtrl.dismiss({
            q: null
        });
    }

    startSearch() {
        this.viewCtrl.dismiss({
            q: this.q
        });
    }
}
