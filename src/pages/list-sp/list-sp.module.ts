import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ListSpPage} from './list-sp';

@NgModule({
    declarations: [
        ListSpPage,
    ],
    imports: [
        IonicPageModule.forChild(ListSpPage),
    ],
})
export class ListSpPageModule {
}
