import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ViewOrderPage} from './view-order';

@NgModule({
    declarations: [
        ViewOrderPage,
    ],
    imports: [
        IonicPageModule.forChild(ViewOrderPage),
    ],
})
export class ViewOrderPageModule {
}
