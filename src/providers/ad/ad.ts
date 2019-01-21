import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import config from "../../config";
import {Storage} from "@ionic/storage";
import {Authorization} from "../../authorization";

@Injectable()
export class AdProvider {

    constructor(public http: HttpClient,
                public storage: Storage) {
    }

    getAds(category, pageNo = 1) {
        return new Promise((resolve) => {
            this.storage.get('token').then(token => {
                this.http.get(config.url + 'ads?category=' + category + '&page=' + pageNo, {
                    headers: new Authorization().attachToken(token.value)
                })
                    .subscribe(res => {
                        resolve(res);
                    })
            });
        });
    }

    searchAds(category, q, pageNo = 1) {
        return new Promise((resolve) => {
            this.storage.get('token').then(token => {
                this.http.post(config.url + 'ads/search', {
                    category: category,
                    q: q,
                    page: pageNo
                }, {
                    headers: new Authorization().attachToken(token.value)
                })
                    .subscribe(res => {
                        resolve(res);
                    })
            });
        });
    }

    getSPAds(spID) {
        return new Promise((resolve) => {
            this.storage.get('token').then(token => {
                this.http.get(config.url + 'sp/ads?spID=' + spID, {
                    headers: new Authorization().attachToken(token.value)
                })
                    .subscribe(res => {
                        resolve(res);
                    })
            });
        });
    }

    postAd(payload) {
        return new Promise((resolve) => {
            this.storage.get('token').then(token => {
                this.http.post(config.url + 'ads', {
                    payload: JSON.stringify(payload)
                }, {
                    headers: new Authorization().attachToken(token.value)
                })
                    .subscribe(res => {
                        resolve(res);
                    })
            });
        });
    }

    nearByAds(category, item, radius) {
        return new Promise((resolve) => {
            this.storage.get('token').then(token => {
                this.http.post(config.url + 'ads/nearby', {
                    category: category,
                    q: item,
                    radius: radius
                }, {
                    headers: new Authorization().attachToken(token.value)
                })
                    .subscribe(res => {
                        console.log(res)
                        resolve(res);
                    })
            });
        });
    }

}
