import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//servicio
import { ServiceProvider } from './../../providers/service/service';


import { Clasificar2Page } from './../clasificar2/clasificar2';

//storage
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-clasificar',
  templateUrl: 'clasificar.html',
})
export class ClasificarPage {
  Productos:any;
  fecha_ahora;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private service:ServiceProvider,
    private storage: Storage) {

    this.storage.get("fecha_inicio").then(fecha =>{
      // let fecha2 = new Date(fecha)
      // this.fecha_ahora = fecha2.getFullYear() + "-" + this.mes(fecha2.getMonth()) + "-" + fecha2.getDate()
      this.datos(fecha);
    })
  

  }

  datos(fecha){
    this.service.Search_productoPeso(fecha).then(lista_productosComprados => {

      this.Productos = lista_productosComprados

      console.log(this.Productos)


    }, error => console.log(error))
  }
 
  Lista(Lote, Producto_id, Datos){
    
    this.navCtrl.push(Clasificar2Page, {lote:Lote, producto_id:Producto_id, lista:Datos});
  }


}
