import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//servicio
import { ServiceProvider } from './../../providers/service/service';

import { Clasificar3Page } from '../clasificar3/clasificar3';

@IonicPage()
@Component({
  selector: 'page-clasificar2',
  templateUrl: 'clasificar2.html',
})
export class Clasificar2Page {
  Lote:any;
  Producto_id:any; 
  Empaque:any;
  Datos:any;
  page:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private service: ServiceProvider) {
    this.Lote = this.navParams.get("lote");
    this.Producto_id = this.navParams.get("producto_id");
    this.Datos = this.navParams.get("lista");

    this.service.Search_EmpaqueLote(this.Lote, this.Producto_id).then(lista_empaques =>{
       console.log(lista_empaques)
       let a = JSON.stringify(lista_empaques);
       let b = JSON.parse(a);
       this.Empaque = b.results
       this.page = b.next
      
    }, error => console.log(error))
    
  }

  doInfinite(infiniteScroll)
  {
    if (this.page) {
      this.service.filter_infinitiScroll(this.page).then(lista_empaque =>{
        let ConversionEmpaque = JSON.stringify(lista_empaque);
        let ConversionEmpaque2 = JSON.parse(ConversionEmpaque);
        for (let i = 0; i < ConversionEmpaque2.results.length; i++) {
          this.Empaque.push(ConversionEmpaque2.results[i])
          
        }
        this.page = ConversionEmpaque2.next;
        infiniteScroll.complete();
      }, error => console.log(error));
    }else{
      infiniteScroll.complete();
    }
  }

  Agregar() {
    this.navCtrl.setRoot(Clasificar3Page, { lista: this.Datos, lote:this.Lote, producto_id:this.Producto_id })
  }

}
