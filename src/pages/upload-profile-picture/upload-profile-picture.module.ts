import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {UploadProfilePicturePage} from './upload-profile-picture';

@NgModule({
    declarations: [
        UploadProfilePicturePage,
    ],
    imports: [
        IonicPageModule.forChild(UploadProfilePicturePage),
    ],
})
export class UploadProfilePicturePageModule {
}
