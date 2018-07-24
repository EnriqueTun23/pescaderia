import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ServiceProvider } from './../../providers/service/service';
import { Inicio2Page } from '../inicio2/inicio2';
/**
 * Generated class for the Lista2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista2',
  templateUrl: 'lista2.html',
})
export class Lista2Page {
  compras:any;
  distribuidor:any;
  lista:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private service:ServiceProvider) {
    let x = JSON.stringify(this.navParams.get("lista"));
    let y = JSON.parse(x)
    this.lista = y; 
    // this.service.Search_distribuidor(y.distribuidor).then(lista_distribuidor =>{
    //   let a = JSON.stringify(lista_distribuidor)
    //   let b = JSON.parse(a)
    //   this.distribuidor = b.nombre+" "+b.apellido
    // }, error => console.log(error))
    this.service.Search_productosComprados(y.id).then(Lista_compras =>{
      console.log(Lista_compras)
      this.compras = Lista_compras;
    }, error => console.log(error) )

    
  }
  add(){
    this.navCtrl.setRoot(Inicio2Page, {lista:this.lista});
  }

}
