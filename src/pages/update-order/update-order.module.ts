import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {UpdateOrderPage} from './update-order';

@NgModule({
    declarations: [
        UpdateOrderPage,
    ],
    imports: [
        IonicPageModule.forChild(UpdateOrderPage),
    ],
})
export class UpdateOrderPageModule {
}
