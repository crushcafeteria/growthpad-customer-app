import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ViewAdPage} from './view-ad';

@NgModule({
    declarations: [
        ViewAdPage,
    ],
    imports: [
        IonicPageModule.forChild(ViewAdPage),
    ],
})
export class ViewAdPageModule {
}
