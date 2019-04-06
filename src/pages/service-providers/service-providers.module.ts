import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceProvidersPage } from './service-providers';

@NgModule({
  declarations: [
    ServiceProvidersPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceProvidersPage),
  ],
})
export class ServiceProvidersPageModule {}
