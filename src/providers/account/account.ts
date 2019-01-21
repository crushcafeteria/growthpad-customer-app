import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";
import config from "../../config";
import {Authorization} from "../../authorization";

@Injectable()
export class AccountProvider {

    constructor(public http: HttpClient,
                public storage: Storage) {
    }

    login(credentials) {
        return new Promise(resolve => {
            this.http.post(config.url + 'login', {
                email: credentials.email,
                password: credentials.password
            })
                .subscribe(data => {
                    resolve(data);
                });
        });
    }

    signup(account) {
        return new Promise(resolve => {
            this.http.post(config.url + 'signup', {
                name: account.name,
                email: account.email,
                telephone: account.telephone,
                gender: account.gender,
                county: account.county,
                password: account.password,
            })
                .subscribe(data => {
                    resolve(data);
                });
        });
    }

    saveLocation(place) {
        return new Promise(resolve => {
            this.storage.get('token').then(token => {
                this.http.post(config.url + 'location/update', {
                    location: JSON.stringify(place)
                }, {
                    headers: new Authorization().attachToken(token.value)
                })
                    .subscribe(data => {
                        resolve(data);
                    });
            })

        });
    }

    uploadProfilePicture(dataURI) {
        return new Promise(resolve => {
                this.storage.get('token').then(token => {
                    this.http.post(config.url + 'picture/upload', {
                        dataURI: dataURI
                    }, {
                        headers: new Authorization().attachToken(token.value)
                    })
                        .subscribe(data => {
                            resolve(data);
                        });
                });
            }
        );
    }

    updateProfile(profile) {
        return new Promise(resolve => {
                this.storage.get('token').then(token => {
                    this.http.post(config.url + 'profile/update', {
                        name: profile.name,
                        email: profile.email,
                        telephone: profile.telephone,
                        gender: profile.gender,
                    }, {
                        headers: new Authorization().attachToken(token.value)
                    })
                        .subscribe(data => {
                            resolve(data);
                        });
                });
            }
        );
    }

    getNearbySPs(category, radius, page = 1) {
        return new Promise(resolve => {
            this.storage.get('token').then(token => {
                this.http.get(config.url + 'sp/fetch?category=' + category + '&radius=' + radius + '&page=' + page, {
                    headers: new Authorization().attachToken(token.value)
                })
                    .subscribe(data => {
                        resolve(data);
                    });
            });
        });
    }

    sendMessage(payload) {
        return new Promise(resolve => {
                this.http.post(config.url + 'feedback', {
                    names: payload.names,
                    telephone: payload.telephone,
                    email: payload.email,
                    message: payload.message
                })
                    .subscribe(data => {
                        resolve(data);
                    });
            }
        );
    }

}
