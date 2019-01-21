import {Component} from '@angular/core';
import {
    ActionSheetController,
    AlertController,
    IonicPage,
    ModalController,
    NavController,
    Platform
} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {ToastProvider} from "../../providers/toast/toast";
import {AlertProvider} from "../../providers/alert/alert";
import {NetworkProvider} from "../../providers/network/network";
import {Camera, CameraOptions} from "@ionic-native/camera";
import _ from 'lodash';
import {FilePath} from "@ionic-native/file-path";
import {File} from "@ionic-native/file";
import {AccountProvider} from "../../providers/account/account";
import config from "../../config";
import {LocationPage} from "../location/location";
import {EditProfilePage} from "../edit-profile/edit-profile";

declare var cordova: any;

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {

    user = null;

    public likes: number = 0;
    public picture: any;
    public picPreview: any;
    public picPath: any;
    public canUpload: boolean = false;
    public savingText: any = 'Save Picture';
    public savingDisabled: boolean = false;
    public savingIcon: any = 'checkmark-circle';
    public localPicUrl: any;
    public savingTeaser: any = false;
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
                public alertCtrl: AlertController,
                public alertProvider: AlertProvider,
                public network: NetworkProvider,
                private modalCtrl: ModalController,
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
            title: 'Change your picture',
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

    // Create a new name for the image
    createFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName = n + ".jpg";
        return newFileName;
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

    changePreferences() {
        // this.navCtrl.push(SetupPage, {
        //     next: MePage,
        //     title: 'Manage your preferences',
        //     loadProfile: true
        // });
    }

    updateTeaser() {
        const prompt = this.alertCtrl.create({
            title: 'Update teaser message',
            message: "This message will be displayed publicly on your profile",
            inputs: [
                {
                    name: 'teaser',
                    placeholder: 'Type your message...',
                    type: 'text'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        this.toast.show('Updating your teaser regularly increases your profile popularity');
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        console.log(data);
                        this.savingTeaser = true;
                        // this.authProvider.updateTeaserMessage(data.teaser).then(res => {
                        //     if (_.has(res, 'error')) {
                        //         this.toast.show(res['error']);
                        //     } else {
                        //         this.user = res['profile'];
                        //         this.toast.show('Teaser message updated successfully!');
                        //     }
                        //     this.savingTeaser = false;
                        // })
                    }
                }
            ]
        });
        prompt.present();
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
}
