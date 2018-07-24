import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InicioFechaPage } from './inicio-fecha';

@NgModule({
  declarations: [
    InicioFechaPage,
  ],
  imports: [
    IonicPageModule.forChild(InicioFechaPage),
  ],
})
export class InicioFechaPageModule {}
