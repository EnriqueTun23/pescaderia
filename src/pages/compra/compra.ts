import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

//servicio
import { ServiceProvider } from './../../providers/service/service';
import { ModalSearchPage } from '../modal-search/modal-search';
import { InicioPage } from '../inicio/inicio';




@IonicPage()
@Component({
  selector: 'page-compra',
  templateUrl: 'compra.html',
})
export class CompraPage {
  categoria:any;
  Distribuidor: any;
  Proveedor: any;
  Valor_distribuidor:any;
  Valor_proveedor:any;
  Valor_tara:any;
  compras:any;
  nuevo:any;
  nuevo2:any;
  folio:any;
  lote:any;
  id:any
  activar:boolean
  carga: boolean;
  selec:boolean;
  tara:any;
  nombre_provedor:any;
  nombre_distribuidor:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private service: ServiceProvider,
    public modalCtrl: ModalController,) {
    this.categoria = navParams.get("categoria");
    this.id =  navParams.get("id")
    
    
    
    

  }
  ionViewDidLoad() {
   if (this.id) {
     this.folio = this.id;
     this.Distribuidor = this.navParams.get("distribuidor");
     let x = JSON.stringify(this.navParams.get("distribuidor"));
     let y = JSON.parse(x)
     this.nuevo = y.nombre + " " + y.apellido;
     this.Proveedor = this.navParams.get("proveedor");
     let a = JSON.stringify(this.navParams.get("proveedor"))
     let b = JSON.parse(a);
     this.nuevo2 = b.nombre
     this.service.Search_compraLote(this.id).then(value_lote =>{
      this.lote = value_lote
     },error => console.log(error))  
     this.service.Search_productosComprados(this.id).then(lista_compreas =>{
        
        this.compras = lista_compreas
      if (this.nuevo) {
        this.activar = false
        this.carga =  false;
        this.selec = true;
      }else{
        
        this.activar = true;
        this.selec  = false;
        
        // this.service.function_distribuidor().then(distribuidor => {

        //   this.Distribuidor = distribuidor
        // }, error => console.log(error));

        // this.service.function_proveedor().then(proveedor => {
        //   this.Proveedor = proveedor
        // },error => console.log(error))
      }
      }, error => console.log(error))
   }else{
     
      this.activar = true
      this.carga = true;
      this.selec = false
    //  this.service.function_distribuidor().then(distribuidor => {
    //   console.log(distribuidor)
    //    this.Distribuidor = distribuidor
    //  }, error => console.log(error));

    //  this.service.function_proveedor().then(proveedor =>{
    //   console.log(proveedor)
    //   this.Proveedor = proveedor
    //  }, error => console.log(error))

     this.service.Valor_bodega().then(bodega_id =>{
       
      if(bodega_id){
        this.service.Search_wineryid(bodega_id).then(lista_bodega =>{          
          let b =  JSON.stringify(lista_bodega);
          let o = JSON.parse(b);
          this.tara =  o.tara
        }, error => console.log(error))
      }else{
        alert("Ponga una bodega para continuar aqui")
      }
     }, error => console.log(error))
   }

  }
  Provedor_modal(){
    let modal1 =  this.modalCtrl.create(ModalSearchPage, {'title':"PROVEEDOR"});
    modal1.onDidDismiss(list_proveedor =>{
      
      this.nombre_provedor = list_proveedor.nombre;
      this.Valor_proveedor = list_proveedor.id;
    })
    modal1.present()
  }
  Distribuidor_modal()
  {
    let modal2 =  this.modalCtrl.create(ModalSearchPage, {'title':"DISTRIBUIDOR"} );
    modal2.onDidDismiss(lista_distri =>{
      this.nombre_distribuidor = lista_distri.nombre;
      this.Valor_distribuidor = lista_distri.id;
      
    })
    modal2.present()
  }

  add(){
    if (this.id) {
      this.navCtrl.push(InicioPage, { categoria: this.categoria, distribuidor: this.Distribuidor, proveedor:this.Proveedor,  id:this.id})
    }else{
      this.service.Search_distribuidor(this.Valor_distribuidor).then(lista => {
        this.service.Search_proveedor(this.Valor_proveedor).then(lista2 =>{
          this.navCtrl.setRoot(InicioPage, { categoria: this.categoria, distribuidor: lista, proveedor:lista2, id: this.id, tara:this.Valor_tara})
        }, error => console.log(error))
        
      }, error => console.log(error))

    }
        
    
  }

 
}
