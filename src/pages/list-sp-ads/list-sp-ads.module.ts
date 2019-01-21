import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ListSpAdsPage} from './list-sp-ads';

@NgModule({
    declarations: [
        ListSpAdsPage,
    ],
    imports: [
        IonicPageModule.forChild(ListSpAdsPage),
    ],
})
export class ListSpAdsPageModule {
}
