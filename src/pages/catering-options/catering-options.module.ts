import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CateringOptionsPage } from './catering-options';

@NgModule({
  declarations: [
    CateringOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(CateringOptionsPage),
  ],
})
export class CateringOptionsPageModule {}
