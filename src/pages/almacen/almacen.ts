import { AnaquelEdicionPage } from './../anaquel-edicion/anaquel-edicion';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Almacen2Page } from './../almacen2/almacen2';

//servicio
import { ServiceProvider } from './../../providers/service/service';

//storage
import { Storage } from '@ionic/storage';



@IonicPage()
@Component({
  selector: 'page-almacen',
  templateUrl: 'almacen.html',
})
export class AlmacenPage {
  
  
  list_anaquel:any;
  page: any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private service: ServiceProvider,
    private storage: Storage
  ) {
    this.storage.get("fecha_inicio").then(fecha => {
      this.Anaque(fecha);    
    },error => console.log(error))
  }


  Anaque(fecha)
  {
    this.service.filter_Anaquel(fecha).then(lista_anquelfecha =>{
        let LAF =  JSON.stringify(lista_anquelfecha);
        let LAF2 = JSON.parse(LAF);
        this.list_anaquel = LAF2.results;
        this.page = LAF2.next
    },error => console.log(error))
  }

  doInfinite(infiniteScroll) {
    if (this.page) {
      this.service.filter_infinitiScroll(this.page).then(lista_siguienteCompras => {

        let conversion = JSON.stringify(lista_siguienteCompras)
        let conversion2 = JSON.parse(conversion);

        for (let i = 0; i < conversion2.results.length; i++) {

          this.list_anaquel.push(conversion2.results[i])
        }
        this.page = conversion2.next;
        infiniteScroll.complete();



      }, error => console.log(error))
    } else {

      infiniteScroll.complete();

    }
  }

    add(){
      this.navCtrl.setRoot(Almacen2Page)
    }

    anaquelEdit(anaquel_id){
      this.navCtrl.push(AnaquelEdicionPage, {'id':anaquel_id});
    }

    }