import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//servicio
import { ServiceProvider } from './../../providers/service/service';

//validar formu
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListaPage } from '../lista/lista';
/**
 * Generated class for the ConfiguracionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {

  Url:string;
  Cliente_id:string;
  Bodega:any;
  Bodega_nombre:any;
  
  formulario: FormGroup;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private service:ServiceProvider,
    public fv: FormBuilder,
     ) {
    this.service.Valor_bodega().then(bodega_id => {
      
      
      this.service.Search_bodegaId(bodega_id).then(lista_bodega =>{
        this.Bodega_nombre = lista_bodega
      }, error => console.log(error));
    }, error => console.log(error))
      
        
        this.formulario =  this.fv.group({
          url:['',[Validators.required]],
          cliente_id:['',[Validators.required]],
          id_bodega:['',[Validators.required]]
        });
        

      this.service.Valor_url().then(url => {  
        this.Url = String(url)
      }, error =>{
        console.log(error)
      });

      this.service.Valor_clienteId().then(cliente_id =>{
         this.Cliente_id = String(cliente_id);
      }, error =>{
        console.log(error);
      });

      this.service.Search_winery().then(lista =>{
         
        this.Bodega = lista
      }, error =>{
        console.log(error)
      });
    }

  Guardar(){
    this.service.Remove_configuration(this.formulario.value.url, 
      this.formulario.value.cliente_id, this.formulario.value.id_bodega).then(() =>{
        this.navCtrl.setRoot(ListaPage)
      })
      
}


}
