import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, } from 'ionic-angular';

//servicio
import { ServiceProvider } from './../../providers/service/service';
//
import { CompraPage } from '../compra/compra';
import { Lista2Page } from '../lista2/lista2';
//storage
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-lista',
  templateUrl: 'lista.html',
})
export class ListaPage {


  categoria: any
  compras: any;
  page:any;
  carga: boolean;
  fecha_ahora:any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private service: ServiceProvider,
    private storage: Storage, ) {
    this.storage.get("fecha_inicio").then(fecha => {
      this.fecha_ahora = fecha
      
    })


  
  }
  ionViewDidLoad() {
    
    this.service.Search_categoryOne().then(lista_categoria => {
      let a = JSON.stringify(lista_categoria);
      let b = JSON.parse(a);
      this.categoria = b.results
      this.cargar_compras(this.fecha_ahora)
    }, error => console.log(error))
  }
  mes(d) {
    var mes = new Array(12);
    mes[0] = "01";
    mes[1] = "02";
    mes[2] = "03";
    mes[3] = "04";
    mes[4] = "05";
    mes[5] = "06";
    mes[6] = "07";
    mes[7] = "08";
    mes[8] = "09";
    mes[9] = "10";
    mes[10] = "11";
    mes[11] = "12";
    return mes[d];

  }
  cargar_compras(fecha) {
    
    this.service.Search_compra(fecha).then(lista_compra => {
      
      let x = JSON.stringify(lista_compra);
      let y = JSON.parse(x)
      let contador = y.count
      if (contador) {
        this.carga = true;
        this.compras = y.results
        this.page = y.next

      } else {
        this.carga = false
      }

    });
  }
  Agregar(date) {

    this.service.Search_category(date).then(lista => {

      this.navCtrl.push(CompraPage, { categoria: lista });

    }, error => console.log(error))
  }

  Info(dato) {
    this.navCtrl.push(Lista2Page, { lista: dato });
  }
  doInfinite(infiniteScroll){
    if (this.page) {
      this.service.filter_infinitiScroll(this.page).then(lista_siguienteCompras =>{
    
          let conversion = JSON.stringify(lista_siguienteCompras)
          let conversion2 = JSON.parse(conversion);

          for (let i = 0; i < conversion2.results.length; i++) {
            
            this.compras.push(conversion2.results[i])
          }
           
          console.log(this.compras)
          this.page = conversion2.next;
          infiniteScroll.complete();  
 
        
    
      },error => console.log(error))
    }else{
      
        infiniteScroll.complete();
      
    }
  }

}
