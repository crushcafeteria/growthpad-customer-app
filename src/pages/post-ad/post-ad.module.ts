import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PostAdPage} from './post-ad';

@NgModule({
    declarations: [
        PostAdPage,
    ],
    imports: [
        IonicPageModule.forChild(PostAdPage),
    ],
})
export class PostAdPageModule {
}
