import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ListAdsPage} from './list-ads';

@NgModule({
    declarations: [
        ListAdsPage,
    ],
    imports: [
        IonicPageModule.forChild(ListAdsPage),
    ],
})
export class ListAdsPageModule {
}
