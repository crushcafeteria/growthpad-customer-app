import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AddToCartPage} from './add-to-cart';

@NgModule({
    declarations: [
        AddToCartPage,
    ],
    imports: [
        IonicPageModule.forChild(AddToCartPage),
    ],
})
export class AddToCartPageModule {
}
