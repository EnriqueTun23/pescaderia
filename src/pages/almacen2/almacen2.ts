import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
//servicio
import { ServiceProvider } from './../../providers/service/service';
import { ModalAnaquelPage } from '../modal-anaquel/modal-anaquel';

//storage
import { Storage } from '@ionic/storage';

//validar formu
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDetailAnquelPage } from './../modal-detail-anquel/modal-detail-anquel';

@IonicPage()
@Component({
  selector: 'page-almacen2',
  templateUrl: 'almacen2.html',
})
export class Almacen2Page {
    matriz = [];
    Fila
    formulario: FormGroup;
  //dimension = new Array(5 * 11)
    Columna 
  // dimension3 = new Array(6 * 5)
     show: boolean;
     show2:boolean;
  // show2: boolean;
  // show3: boolean;
     bodega:any; 
     congelador:any;
     id_congelador:number;
     id_bodega:number;
     id_anaquel:any;
     Fecha_hoy;
     lote:any;
     LoTe2:any;
     activar:boolean = false;
 

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private service: ServiceProvider,
    public modalCtrl:ModalController,
    private storage: Storage,
    public fv: FormBuilder) {
    this.show2 = false;
    this.service.Valor_bodega().then(id_bodega =>{
      this.service.Search_wineryid(id_bodega).then(lista_bodega =>{
        let x:any = JSON.stringify(lista_bodega);
        let y = JSON.parse(x)
        this.bodega = y.anaquel;
        
        this.congelador = y.congelador;
        this.id_bodega = y.id;
        
      },error => console.log(error))
    },error => console.log(error))
    

    this.storage.get("fecha_inicio").then(fecha=>{
      this.Fecha_hoy = fecha
      this.filterfecha(fecha)
    })

    this.formulario = this.fv.group({
      anaquel:['',[Validators.required]],
      lote: ['',[Validators.required]],
      congelador: ['', [Validators.required]]
    })

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
  filterfecha(buscar_fecha)
  {
    this.service.filter_fechaEmpaque(buscar_fecha).then(lista_fecha => {
      let a: any = JSON.stringify(lista_fecha)
      let b = JSON.parse(a)
      this.lote = b.results

    }, error => console.log(error))
  }
  
  



  ejemplo(item){

    if(item.empaques.length > 0){
      let modalDetail = this.modalCtrl.create(ModalDetailAnquelPage, { 'data': item });
      modalDetail.onDidDismiss(data=>{
        this.matriz[item.fila][item.columna].empaques = data;
        if (data.length <= 0) {
          this.matriz[item.fila][item.columna].color = 'secondary';
          this.matriz[item.fila][item.columna].icon = 'square-outline';
          this.matriz[item.fila][item.columna].disabled = false;
        }
      })
      modalDetail.present();
    }
    else{
      let f:number = Number(item.fila+1)
      let c:number =  Number(item.columna+1)
      let modal = this.modalCtrl.create(ModalAnaquelPage, { 'fila': f, 'columna': c, 'fecha': this.Fecha_hoy, 
        'lote': this.formulario.value.lote.lote, 
        'categoria': this.formulario.value.lote.categoria,
        'id_anaquel':this.id_anaquel
      });
        
        modal.onDidDismiss(data=>{
          if (data.length > 0) {
            this.matriz[item.fila][item.columna].color = 'danger';
            this.matriz[item.fila][item.columna].icon = 'checkmark';
            this.matriz[item.fila][item.columna].disabled = true;
            this.matriz[item.fila][item.columna].empaques = data;
          }
        })
        modal.present()
    }
    
  }

  Guardar(){



    
        this.service.Search_user().then(lista_user =>{
          let u = JSON.stringify(lista_user);
          let user_id = JSON.parse(u);

        
          
      

          this.service.function_anaquel(user_id.id, this.formulario.value.congelador, this.formulario.value.anaquel.id, this.formulario.value.lote.lote ).then(id_anquel =>{

          for(let i = 0; i < this.formulario.value.anaquel.filas; i++){
            this.matriz.push([])
            for(let j = 0; j < this.formulario.value.anaquel.columnas; j++){
              this.matriz[i].push([]);
              let item = {
                fila:i,
                columna:j,
                empaques:[],
                anaquel:this.formulario.value.anaquel.id,
                icon:'square-outline',
                color:'secondary',
                disabled: false
              }
              this.matriz[i][j]= item
            }
          }

        

          

            this.show = true;
            this.activar = true;
            this.show2 = true;
            let by = JSON.stringify(id_anquel);
            let bya = JSON.parse(by);
            this.id_anaquel = bya.id
          },error => console.log(error))   

        },error => console.log(error))



  }


}
