import { ModalDetailAnquelPage } from './../modal-detail-anquel/modal-detail-anquel';
import { ModalAnaquelPage } from './../modal-anaquel/modal-anaquel';
import { ServiceProvider } from './../../providers/service/service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-anaquel-edicion',
  templateUrl: 'anaquel-edicion.html',
})
export class AnaquelEdicionPage {

  anaquel_id:any;
  anaquel:any;
  fecha:any;
  matriz = [];
  categoria:any;
  //--------------------
  AnaquelSelect:any
  Value_anaquel:any;
  name_anaquel:any;
  LoteSelect:any;
  Value_lote:any;
  name_lote:any;
  CongeladorSelect:any;
  Value_congelador:any;
  name_congelador:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private service: ServiceProvider,
    public modalCtrl: ModalController,
    public storage: Storage
  ) {
    this.storage.get("fecha_inicio").then(fecha=>{
      this.fecha = fecha
    })
    this.anaquel_id =  navParams.get("id");
  }

  addEmpaque(item){
    if(item.empaques.length > 0){
      console.log('item')
      console.log(item);
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
      let modal = this.modalCtrl.create(ModalAnaquelPage, { 'fila': f, 'columna': c, 'fecha': this.fecha, 
        'lote': this.anaquel.lote, 
        'categoria': this.categoria,
        'id_anaquel':this.anaquel_id
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

  ionViewDidLoad() {
    if(this.anaquel_id){
      this.service.get_anaquel_by_id(this.anaquel_id).then(anaquel => {
        let aJ:any = JSON.stringify(anaquel);
        this.anaquel = JSON.parse(aJ);
        this.Value_anaquel = this.anaquel.configuracion.id
        this.name_anaquel= this.anaquel.configuracion.filas + " X " + this.anaquel.configuracion.columnas;
        this.AnaquelSelect = this.Value_anaquel;

        this.Value_lote = this.anaquel.lote;
        this.name_lote = this.anaquel.lote;
        this.LoteSelect = this.Value_lote;

        this.Value_congelador = this.anaquel.congelador.id;
        this.name_congelador = this.anaquel.congelador.numero;
        this.CongeladorSelect = this.Value_congelador;


        this.service.get_compraXlote_by_id(this.anaquel.lote).then(lotes=>{
          let lJ:any = JSON.stringify(lotes);
          let lote = JSON.parse(lJ);
          this.categoria = lote[0].categoria.id;
        })

        for(let i = 0; i < this.anaquel.configuracion.filas; i++){
          this.matriz.push([])
          for(let j = 0; j < this.anaquel.configuracion.columnas; j++){
            this.matriz[i].push([]);
            let empaques = [];
            let is_disabled:boolean=false;
            for(let empaque of this.anaquel.anaquelempaque){
              if(empaque.fila==(i+1) && empaque.columna==(j+1)){
                empaques.push(empaque);
                is_disabled=true;
              }
            }

            let item = {
              fila:i,
              columna:j,
              empaques:empaques,
              anaquel:this.anaquel.id,
              icon:is_disabled?'checkmark':'square-outline',
              color:is_disabled?'danger':'secondary',
              disabled: is_disabled
            }
            this.matriz[i][j]= item
          }
        }
        
      }, error => console.log(error))
    }
    else{
      console.log('Id no enviado');
    }
  }

}
