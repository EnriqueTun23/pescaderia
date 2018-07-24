import { Component, ViewChild} from '@angular/core';

import { IonicPage, NavController, NavParams} from 'ionic-angular';


//servicio
 import { ServiceProvider } from './../../providers/service/service';

//validar formu
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { CompraPage } from '../compra/compra';

import { Clipboard } from '@ionic-native/clipboard';

@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})

export class InicioPage {
  
  @ViewChild("focusInput") inputEl;

    Producto:any;
    Bodega_id:any;
    User:any
    formularioCompra:FormGroup;
    Value:string = '';
    Suma:number = 0;
    categoria:any
    distribuidor:any
    proveedor:any;
    dato:any;
    carga:boolean;
    id:any;
    tara:any;
    TEXTO: string;
    umedida: string;
    aux: any;
    constructor(

    public navCtrl: NavController, 
    public navParams: NavParams,
    private service: ServiceProvider,
    public fv: FormBuilder,
    private clipboard: Clipboard
  ) {
      
      this.categoria = navParams.get("categoria");
      this.distribuidor = navParams.get("distribuidor");
      this.proveedor = navParams.get("proveedor")
      this.id = navParams.get("id")
      this.tara = navParams.get("tara")
      
      

      if (this.categoria.calidad.length > 0) {
        this.carga =  true
      }else{
        this.carga = false;
      }
      
      
      this.service.Search_product(this.categoria.id).then(lista_producto =>{
       
        this.Producto = lista_producto
      }, error => console.log(error))

      this.service.Search_user().then(lista_user =>{
        this.User = lista_user;
      }, error => console.log(error));

      this.service.Valor_bodega().then(bodega_id =>{
        this.Bodega_id = bodega_id;
      }, error => console.log(error))
      


     this.formularioCompra = this.fv.group
     ({
       producto:['', [Validators.required]],
       tamano:['', [Validators.required]],
       pesorequired: ['', [Validators.required]],
       calidad:['']
     });
     
     
  }
  // Search(selectedValue: any){
  // this.service.Search_product(selectedValue).then(lista_producto =>{
  //     this.Producto =  lista_producto
  //   }, error => console.log(error))

  // }


 //******************OPERACIONES CON EL PESO y LA UNIDAD DE MEDIDA***********************
 convertirpeso(){
  if(this.umedida != "" && this.umedida == "kg")
  {
    this.aux = Number(this.TEXTO.replace("kg",""));
  }else if(this.umedida != ""){
    this.aux = Number(this.TEXTO.replace("lb",""));
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
    
    
    // console.log('Distribuidor :' +this.distribuidor.id)
    // console.log('Categoria :'+this.categoria.id)

    // console.log('Producto :'+this.formularioCompra.value.producto);
    // console.log('Tamaño :'+this.formularioCompra.value.tamano);
    // this.Suma = this.Suma+Number(this.formularioCompra.value.kg)
    //   console.log('Pesos :' + this.Suma);
    // console.log('Bodega :'+this.Bodega_id);
    // console.log('recibio :'+this.User.id );
    // console.log('Calidad :'+ this.formularioCompra.value.calidad)

      //****************CODIGO MODIFICADO */
      this.convertirpeso();
      if (this.id) {
      this.Suma = this.Suma + Number(this.aux)
      //***************FIN CODIGO MODIFICADO */
      this.service.function_segundacompra(this.formularioCompra.value.producto, this.id, this.formularioCompra.value.tamano,
        this.formularioCompra.value.calidad, this.Suma).then(id_list2 =>{
          this.navCtrl.setRoot(CompraPage, { categoria: this.categoria, id: this.id, distribuidor: this.distribuidor, proveedor: this.proveedor})
          // this.navCtrl.setRoot(CompraPage, { categoria: this.categoria, distribuidor: this.distribuidor, id: id_valor })
        },error =>{
          let err = JSON.parse(error._body)
          alert(err.detail)
          this.Suma = 0;
        })
    }else{
      //CODIGO MODIFICADO
      this.Suma = this.Suma + Number(this.aux);
      //FIN CODIGO MODIFICADO
      this.service.function_comprar(this.distribuidor.id,this.proveedor.id, this.categoria.id, this.formularioCompra.value.producto, this.Suma,
      this.formularioCompra.value.tamano, this.Bodega_id, this.User.id, this.formularioCompra.value.calidad, this.tara).then(id_valor =>{
                                      
                                     this.navCtrl.setRoot(CompraPage, {categoria :this.categoria, id:id_valor , distribuidor:this.distribuidor, proveedor:this.proveedor})
                                                                   
                                    }, error =>{
                                      let err = JSON.parse(error._body)
                                      alert(err.detail)
                                      this.Suma = 0;
                                    })
                                  }

  }
  GuardaryContinuar(){
    
    // this.Value = ''
    // this.inputEl.setFocus()

    //******************CODIGO MODIFICADO
    this.convertirpeso();

    if (this.id) {
      this.Suma = this.Suma + Number(this.aux)
    //***************FIN CODIGO MODIFICADO */

      this.service.function_segundacompra(this.formularioCompra.value.producto, this.id, this.formularioCompra.value.tamano,
        this.formularioCompra.value.calidad, this.Suma).then((dat) => {
          console.log(dat)
          this.Value = ''

        //***************CODIGO AGREGADO */
          this.TEXTO = ''
        //**********************FIN */

          this.Suma =  0;
        }, error =>{
          let err = JSON.parse(error._body)
          alert(err.detail)
          this.Suma = 0;
        })
    } else {
      //***********CODIGO MODIFICADO*************** */
      this.Suma = this.Suma + Number(this.aux)
      //FIN CODIGO MODIFICADO
      this.service.function_comprar(this.distribuidor.id, this.proveedor.id, this.categoria.id, this.formularioCompra.value.producto, this.Suma,
        this.formularioCompra.value.tamano, this.Bodega_id, this.User.id, this.formularioCompra.value.calidad, this.tara).then((id_valor) => {
          console.log(id_valor)
          console.log('id_compra: ' + id_valor)
          this.id = id_valor
          this.Value = ''
        //***************CODIGO AGREGADO */
          this.TEXTO = ''
        //**********************FIN */
          this.Suma = 0;

        },error =>{
          let err = JSON.parse(error._body)
          alert(err.detail)
          this.Suma = 0;
        })


    }

  }

  Cancelar(){
    
    this.navCtrl.setRoot(CompraPage, { categoria: this.categoria, id: this.id, distribuidor: this.distribuidor, proveedor: this.proveedor })
    
    
  }
}
