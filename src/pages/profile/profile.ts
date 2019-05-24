import {Component} from '@angular/core';
import {ActionSheetController, AlertController, IonicPage, NavController, Platform} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {ToastProvider} from "../../providers/toast/toast";
import {NetworkProvider} from "../../providers/network/network";
import {Camera, CameraOptions} from "@ionic-native/camera";
import _ from 'lodash';
import {FilePath} from "@ionic-native/file-path";
import {File} from "@ionic-native/file";
import {AccountProvider} from "../../providers/account/account";
import config from "../../config";
import {LocationPage} from "../location/location";
import {EditProfilePage} from "../edit-profile/edit-profile";
import {SocialSharing} from "@ionic-native/social-sharing";

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {

    user = null;

    public picture: any;
    public picPreview: any;
    public picPath: any;
    public canUpload: boolean = false;
    public savingText: any = 'Save Picture';
    public savingDisabled: boolean = false;
    public savingIcon: any = 'checkmark-circle';
    public localPicUrl: any;
    config = null;
    pictureData = null;

    constructor(public navCtrl: NavController,
                public storage: Storage,
                public actionSheetCtrl: ActionSheetController,
                public camera: Camera,
                public platform: Platform,
                public filePath: FilePath,
                public file: File,
                public toast: ToastProvider,
                public social: SocialSharing,
                public network: NetworkProvider,
                public accountProvider: AccountProvider) {
        this.initialize();
        this.config = config;
    }

    initialize() {
        this.storage.get('online').then(online => {
            if (online) {
                this.storage.get('profile').then(profile => {
                    this.user = profile;
                    this.picPreview = this.user.picture;
                    console.log(this.user);
                });
            } else {
                this.network.showRecovery(() => {
                    this.navCtrl.setRoot(ProfilePage);
                });
            }
        });
    }

    showPictureOptions() {
        const actionSheet = this.actionSheetCtrl.create({
            title: 'Change your personal picture',
            buttons: [
                {
                    text: 'Snap with camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                }, {
                    text: 'Choose from library',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                }
            ]
        });
        actionSheet.present();
    }

    public takePicture(sourceType) {
        // Create options for the Camera Dialog
        var options: CameraOptions = {
            quality: 60,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            mediaType: this.camera.MediaType.PICTURE,
            destinationType: this.camera.DestinationType.DATA_URL,
            allowEdit: true,
            targetWidth: 600,
            targetHeight: 600
        };

        // Get the data of an image
        this.camera.getPicture(options).then((picture) => {
            this.picPreview = this.pictureData = 'data:image/jpeg;base64,' + picture;
            this.canUpload = true;
        }, (err) => {
            console.log(err)
            this.toast.show('Did you select a picture?');
        });
    }

    uploadImage() {
        this.savingText = 'Uploading';
        this.savingDisabled = true;
        this.savingIcon = 'time'
        this.accountProvider.uploadProfilePicture(this.pictureData).then(res => {
            if (_.has(res, 'error')) {
                this.toast.show(res['error']);
            } else {
                this.savingText = 'Save Picture';
                this.savingDisabled = false;
                this.savingIcon = 'checkmark-circle'

                this.user = res['profile'];
                this.storage.set('profile', res['profile'])
                this.picPreview = res['profile']['picture'];
                this.picture = this.localPicUrl = this.picPath = null;
                this.canUpload = false;

                this.toast.show('Your profile picture has been updated!', 6000);
            }
        });
    }

    showEditProfile() {
        this.navCtrl.push(EditProfilePage);
    }

    changeLocation() {
        this.navCtrl.push(LocationPage, {
            next: ProfilePage,
            title: 'Change location'
        });
    }

    share() {
        this.social.shareWithOptions({
            message: 'Hello there! I just came across the IREN Growthpad app and it is very useful. You can get it here:- ',
            subject: 'Tell others about Growthpad',
            url: 'https://play.google.com/store/apps/details?id=com.irenkenya.growthpad.customer.app&hl=en',
            chooserTitle: 'Download the IREN Growthpad app',
        });
    }
}
