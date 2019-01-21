import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MyAdsPage} from './my-ads';

@NgModule({
    declarations: [
        MyAdsPage,
    ],
    imports: [
        IonicPageModule.forChild(MyAdsPage),
    ],
})
export class MyAdsPageModule {
}
