import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ServiceProvider } from './../../providers/service/service';


@IonicPage()
@Component({
  selector: 'page-modal-search',
  templateUrl: 'modal-search.html',
})
export class ModalSearchPage {

  title:any;
  Dis_Pro:any;
  items:any;
  
  valorCheack:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private service: ServiceProvider) {

    this.title = this.navParams.get('title')
    if (this.title == "PROVEEDOR") {
        this.lista_proveedor();
      }else
      {
        this.lista_distribuidor();
      }

  }

  lista_proveedor()
  {
    this.service.function_proveedor().then(proveedor => {
       
      this.Dis_Pro = proveedor
      this.initializeItems();

     }, error => console.log(error))
  }
  lista_distribuidor()
  {
    this.service.function_distribuidor().then(distribuidor => {
        
      this.Dis_Pro = distribuidor
      this.initializeItems();
      }, error => console.log(error));
  }

  initializeItems()
  {
    this.items = this.Dis_Pro
    console.log(this.items)
  }

  getItems(ev: any)
  {
    
    this.initializeItems();

    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.items = this.items.filter((item) =>{
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
       
      })
    }
  }
  
  onSelectChange(valor)
  {
    this.viewCtrl.dismiss(valor)
  }

  

}
