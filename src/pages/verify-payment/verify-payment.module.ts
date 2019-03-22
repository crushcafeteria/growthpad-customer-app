import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyPaymentPage } from './verify-payment';

@NgModule({
  declarations: [
    VerifyPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyPaymentPage),
  ],
})
export class VerifyPaymentPageModule {}
