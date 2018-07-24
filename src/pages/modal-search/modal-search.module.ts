import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalSearchPage } from './modal-search';

@NgModule({
  declarations: [
    ModalSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalSearchPage),
  ],
})
export class ModalSearchPageModule {}
