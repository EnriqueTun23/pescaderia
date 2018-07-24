import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAnaquelPage } from './modal-anaquel';

@NgModule({
  declarations: [
    ModalAnaquelPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAnaquelPage),
  ],
})
export class ModalAnaquelPageModule {}
