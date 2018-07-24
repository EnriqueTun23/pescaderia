import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClasificarPage } from './../clasificar/clasificar';
import { Clasificar2Page } from './../clasificar2/clasificar2';
import { ServiceProvider } from './../../providers/service/service';
import { Clipboard } from '@ionic-native/clipboard';

//validar formu
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@IonicPage()
@Component({
  selector: 'page-clasificar3',
  templateUrl: 'clasificar3.html',
})
export class Clasificar3Page {

  @ViewChild("focusInput") inputEl;

  formulario:FormGroup
  Producto_peso:any = '0';
  Producto_maximo:any = '0';
  Talla:any
  Lista:any;
  carga: boolean;
  carga2: boolean;
  Calidad=[]
  Value:string ='';
  cabeza:boolean;
  color = "dark"
  User:any;
  Medida:any;
  Suma : number;
  TEXTO: string = "";
  umedida: string;
  umedida_list: any;
  aux: any;
  
  Lote: any;
  Producto_id: any;
  
  TallaP2 = []
  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  public service:ServiceProvider,
  public fv: FormBuilder,
  private clipboard: Clipboard
  ) {
    this.Lista = this.navParams.get("lista")
    this.Lote = this.navParams.get("lote");
    this.Producto_id = this.navParams.get("producto_id")
    console.log(this.Lista)
    if(this.Lista.producto.sin_cabeza){
      this.carga2 = true;
    }else{
      this.carga2 =  false;
    }

    this.service.Search_tallaPpypt(this.Lista.categoria.id).then(lista_tallaPpypt =>{
      let x:any = lista_tallaPpypt
      if (x.results.length) {
        for (let i = 0; i < x.results.length; i++) {
          this.TallaP2.push(x.results[i])          
        }
      }      
    }, error => console.log(error))

    this.service.Search_categoriaPpypt(this.Lista.categoria.id).then(lista_calidadPpypt =>{
        let  y:any =  lista_calidadPpypt;
        
        if (y.results.length) {          
          this.carga = true
          
          for (let i = 0; i < y.results.length; i++) {
           this.Calidad.push(y.results[i])
          }
                
        }


    }, error => console.log(error))

    this.service.Search_user().then(lista_useer =>{
      this.User =  lista_useer;
    }, error => console.log(error))

    this.formulario = this.fv.group
    ({
      talla:['', [Validators.required]],
      calidad:[''],
      cabeza:[false],
      pesorequired: ['', [Validators.required]],
    })
  }


  //******************OPERACIONES CON EL PESO y LA UNIDAD DE MEDIDA***********************
  convertirpeso(){
    if(this.umedida != "" && this.umedida == "kg"){
      this.aux = this.TEXTO.replace("kg","");
    }else if(this.umedida != ""){
      this.aux = this.TEXTO.replace("lb","");
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


  onSelectChange(id){
    
    this.service.Search_tallaPpyptEspecifica(this.Lista.categoria.id, id).then(lista_talla =>{
      
      
      this.Medida = lista_talla;
      let x:any = lista_talla
      let porcentaje = (Number(x.empaque_primario) * (Number(this.Lista.categoria.excedente)/100)) + Number(x.empaque_primario)
      this.Suma = porcentaje
      this.Producto_maximo = porcentaje + " " + x.unidad_medida
      this.Producto_peso = x.empaque_primario + " " + x.unidad_medida
      this.umedida_list = x.unidad_medida;

    }, error => console.log(error))


  }
  Search(selectedValue: any){
      this.service.Search_size(selectedValue).then(lista =>{
        this.Talla = lista;
      }, error =>{
        console.log(error);
      })
  }
  Cancelar(){
    this.navCtrl.setRoot(Clasificar2Page, { lista: this.Lista, lote: this.Lote, producto_id: this.Producto_id })
  }
  GuardaryContinuar(){

  if(this.umedida.toUpperCase()==this.umedida_list){
      this.convertirpeso();
      var maximo = Number(this.Suma) 
      
      if (this.aux <= maximo) {
        this.service.function_almacenar(this.formulario.value.cabeza, this.User.id,
          this.Lista.producto.id, this.formulario.value.calidad,
          this.aux, this.formulario.value.talla, this.Medida.unidad_medida,
          this.Lista.lote).then(() =>{
            // this.navCtrl.setRoot(Clasificar3Page, { lista: this.Lista })
            this.Value = '';
          //***************CODIGO AGREGADO */
            this.TEXTO = ''
          //**********************FIN */
          }, error =>{
            let err = JSON.parse(error._body)
            if (err.non_field_errors) {
              alert(err.non_field_errors)  
            }else{
              alert(err)
            }
            
          } )
        
      }else{
        alert("Sobrepasó el peso máximo")
        this.color ="danger";

      }
    }else{
      alert("Configure la báscula con la unidad de medida correcta")
    }
        
  }
  Guardar(){
      if(this.umedida.toUpperCase()==this.umedida_list){
        this.convertirpeso();
        var maximo = Number(this.Suma) 
      
        if (this.aux <= maximo) {
          this.service.function_almacenar(this.formulario.value.cabeza, this.User.id,
          this.Lista.producto.id, this.formulario.value.calidad, 
          this.aux, this.formulario.value.talla, this.Medida.unidad_medida,
          this.Lista.lote).then(() =>{
          this.navCtrl.setRoot(ClasificarPage)
          }, error => {
            let err = JSON.parse(error._body)
        
            if (err.non_field_errors) {
              alert(err.non_field_errors)
            }else{
              alert(err)
            }
          })
        } else {
          this.color = "danger"
          console.log(this.aux)
          alert("Sobrepasó el peso máximo")
        }
      }else{
        alert("Configure la báscula con la unidad de medida correcta")
      }
  }
  
}
