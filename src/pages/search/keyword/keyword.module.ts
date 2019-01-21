import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {KeywordPage} from './keyword';

@NgModule({
    declarations: [
        KeywordPage,
    ],
    imports: [
        IonicPageModule.forChild(KeywordPage),
    ],
})
export class KeywordPageModule {
}
