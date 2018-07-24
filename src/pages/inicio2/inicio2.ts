
import { Component, ViewChild } from '@angular/core';

import { ServiceProvider } from './../../providers/service/service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//validar formu
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lista2Page } from '../lista2/lista2';
import { Clipboard } from '@ionic-native/clipboard';

@IonicPage()
@Component({
  selector: 'page-inicio2',
  templateUrl: 'inicio2.html',
})
export class Inicio2Page {

  @ViewChild("focusInput") inputEl;
  lista:any
  // Distribuidor:any;
  Producto: any;
  Talla:any;
  Value: string = '';
  Suma: number = 0;
  Calidad:any;
  formularioCompra: FormGroup;
  TEXTO: string = "";
  umedida: string;
  aux: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private service:ServiceProvider,
    public fv: FormBuilder,
    private clipboard: Clipboard
    ) {
    let x = JSON.stringify(this.navParams.get("lista"));
    let y = JSON.parse(x);
    this.lista = y;
    

    // this.service.Search_distribuidor(y.distribuidor).then(lista_distribuidor =>{
      
    //   let a = JSON.stringify(lista_distribuidor)
    //   let b= JSON.parse(a)
    //   this.Distribuidor = b.nombre+ " "+b.apellido

    // }, error => console.log(error));

    this.service.Search_product(y.categoria.id).then(lista_producto =>{
      this.Producto = lista_producto
    }, error => console.log(error))

    this.service.Search_talla(y.categoria.id).then(lista_talla =>{
      this.Talla = lista_talla
      
      
    },error => console.log(error))
    
    this.service.Search_calidad(y.categoria.id).then(lista_categoria =>{
      this.Calidad = lista_categoria
      
    }, error => console.log(error))

    this.formularioCompra = this.fv.group({
      producto: ['', [Validators.required]],
      tamano: ['', [Validators.required]],
      pesorequired: ['', [Validators.required]],
      calidad: ['']
    })
      
  }

  ionViewDidLoad() {
    
  }

  //******************OPERACIONES CON EL PESO y LA UNIDAD DE MEDIDA***********************
  convertirpeso(){
    if(this.umedida != "" && this.umedida == "kg")
    {
      this.aux = this.TEXTO.replace("kg","");
    }else if(this.umedida != ""){
      this.aux = this.TEXTO.replace("lb","");
      this.aux = (this.aux/2.20462).toFixed(2);
    }else{
      this.aux = "0";
    }
  }

//************************************METODO DEL BOTON PARA LECTURA DEL CLIPBOARD PARA PESO */
LeerPeso(){
  this.clipboard.paste().then(
    (resolve: string) => {
      if(resolve.length > 0){
        if(resolve.substr(0,1)=="+"){    
            this.TEXTO = resolve.replace("+","").trim();
            this.umedida = this.TEXTO.substr(-2);
            if (this.umedida == "kg"){
              this.TEXTO = Number(this.TEXTO.replace("kg","")) + this.umedida
            }else if(this.umedida.length > 0){
              this.TEXTO = Number(this.TEXTO.replace("lb","")) + this.umedida
            }else{}

            this.clipboard.clear();
        }else{
          this.TEXTO = "";
          alert("No se puede leer el peso de la báscula, envíe nuevamente la impresión desde la báscula");
          this.clipboard.clear();
        }
      }else{
        this.TEXTO = "";
        alert("No se puede leer el peso de la báscula, intente enviarlo de nuevo, si el problema persiste verifique la conexión");
      }
     },
     (reject: string) => {
       alert('Error: ' + reject);
     }
   );  
}


  Guardar(){
    //*******************CODIGO AGREGADO***********************
    this.convertirpeso();
    this.Suma = this.Suma + Number(this.aux)
    //******************FIN */
    this.service.function_segundacompra(this.formularioCompra.value.producto, this.lista.id,
    this.formularioCompra.value.tamano,this.formularioCompra.value.calidad, this.Suma).then(() =>{
      this.navCtrl.setRoot(Lista2Page ,{lista:this.lista})
    }, error =>{
      let err = JSON.parse(error._body)
      alert(err.detail)
      this.Suma = 0;
    })
    
  }

  GuardaryContinuar() {

    //**********************CODIGO AGREGADO */
    this.convertirpeso();
    this.Suma = this.Suma + Number(this.aux);
    //*****************************FIN */

    // this.Value = ''
    // this.inputEl.setFocus()
    
    this.service.function_segundacompra(this.formularioCompra.value.producto, this.lista.id,
      this.formularioCompra.value.tamano, this.formularioCompra.value.calidad, this.Suma).then(() => {
       this.Value = ''
       //***************CODIGO AGREGADO */
       this.TEXTO = ''
       //**********************FIN */ 
       this.Suma = 0;
      }, error =>{
        let err = JSON.parse(error._body)
        alert(err.detail)
        this.Suma = 0;
      })

  }

  Cancelar() {

    this.navCtrl.setRoot(Lista2Page, { lista: this.lista })
  }

}
