import {Component} from '@angular/core';
import {ActionSheetController, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Storage} from "@ionic/storage";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ToastProvider} from "../../providers/toast/toast";
import {HomePage} from "../home/home";
import {LocationPage} from "../location/location";
import {AdProvider} from "../../providers/ad/ad";
import _ from 'lodash';
import {LoaderProvider} from "../../providers/loader/loader";


@IonicPage()
@Component({
    selector: 'page-post-ad',
    templateUrl: 'post-ad.html',
})
export class PostAdPage {

    postAdForm: FormGroup;
    profile;
    step = 1;
    pendingAd;
    pictures = {};
    totalPics = 0;
    location;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public formBuilder: FormBuilder,
                public storage: Storage,
                public actionSheetCtrl: ActionSheetController,
                public camera: Camera,
                public toast: ToastProvider,
                public events: Events,
                public adProvider: AdProvider,
                public loader: LoaderProvider) {

        this.postAdForm = this.formBuilder.group({
            category: [null, Validators.required],
            name: [null, Validators.required],
            description: [null, Validators.required],
            telephone: [null, Validators.required],
            email: [null, Validators.compose([Validators.required, Validators.email])],
            price: [null, Validators.required],
        });

        // Get user profile
        this.storage.get('profile').then(profile => {
            this.profile = profile;
            this.postAdForm.patchValue({
                telephone: profile.telephone,
                email: profile.email,
            });
        });

        // Prefill form
        // this.postAdForm.patchValue({
        //     category: 'AGROVET',
        //     name: '10kg CAN Fertilizer',
        //     description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book',
        //     price: 900
        // });

        // Listen for location
        this.events.subscribe('location', location => {
            if (location) {
                this.location = this.pendingAd.location = location;
                this.step = 3;
            }
        });
    }

    saveAd() {
        this.pendingAd = this.postAdForm.value;
        this.step = 2;
    }

    uploadPicture(slot) {

        const actionSheet = this.actionSheetCtrl.create({
            title: 'Upload ad pictures',
            buttons: [
                {
                    text: 'Snap with camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA, slot);
                    }
                }, {
                    text: 'Choose from library',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, slot);
                    }
                }
            ]
        });
        actionSheet.present();
    }

    takePicture(sourceType, slot) {
        // Create options for the Camera Dialog
        var options: CameraOptions = {
            quality: 60,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            mediaType: this.camera.MediaType.PICTURE,
            destinationType: this.camera.DestinationType.DATA_URL,
            allowEdit: true,
            targetWidth: 800,
            targetHeight: 800
        };

        // Get the data of an image
        this.camera.getPicture(options).then((dataURI) => {
            // console.log(dataURI)
            if (this.pendingAd.pictures) {
                this.pictures = this.pendingAd.pictures;
            }

            this.pictures[slot] = dataURI;
            this.pendingAd.pictures = this.pictures;
            this.totalPics = Object.keys(this.pictures).length;
            console.log(this.pendingAd);

        }, (err) => {
            this.toast.show('Did you select a picture?');
            console.log(err)
        });
    }

    goBack(step) {
        this.step = step;
    }

    goHome() {
        this.navCtrl.setRoot(HomePage);
    }

    setLocation() {
        this.navCtrl.push(LocationPage, {
            isAd: true
        });
    }

    publishAd() {
        let loader = this.loader.show('Publishing. Please be patient...')
        this.adProvider.postAd(this.pendingAd).then(res => {
            if (_.has(res, 'error')) {
                this.toast.show(res['error'])
            } else {
                this.toast.show('Your advert has been posted successfully');
                this.navCtrl.setRoot(HomePage);
            }
            loader.dismiss()
        });


    }
}
