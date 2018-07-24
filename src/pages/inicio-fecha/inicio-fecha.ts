import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//storage
import { Storage } from '@ionic/storage';

//servicio
import { ServiceProvider } from './../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-inicio-fecha',
  templateUrl: 'inicio-fecha.html',
})
export class InicioFechaPage {
  
  myDate;
  Bodega: any;
  Bodega_nombre: any;
  Valor_bodegaSave: any;
  


  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private storage: Storage,
    private service: ServiceProvider
    ) {

    
    this.storage.get("fecha_inicio").then(fecha_inicio =>{
        console.log(fecha_inicio)
      if (fecha_inicio) {
        
        this.myDate = fecha_inicio;
      }else
      {
        console.log("no existe fecha")
        let fecha = new Date().toISOString();
        // let fecha2 = fecha.getFullYear() + "-" + this.mes(fecha.getMonth()) + "-" + fecha.getDate()
        let fecha_lista = fecha.split("T");
        let fecha_lista2 = fecha_lista[0]
        
        console.log(fecha_lista2)
        
        this.myDate = fecha_lista2
        
      }
    },error => console.log(error))
     
      
      this.service.Valor_bodega().then(bodega_id =>{
        this.service.Search_bodegaId(bodega_id).then(bodega_nombre =>{
          this.Bodega_nombre = bodega_nombre
        }, error => console.log(error))
      }, error => console.log(error))

      
      this.service.Search_winery().then(lista_bodegas => {
        this.Bodega = lista_bodegas; 
      },eror => console.log(eror))
      
    

    }

 dates(dato)
 {
    

   this.storage.remove("fecha_inicio").then(() => {
     let m = Number(dato.month)+1
     let fechaPrueba = new Date(dato.year, m, dato.day)

     let Datez = fechaPrueba.getFullYear() + "-" + ("0" + fechaPrueba.getMonth() + 1).slice(-2) + "-" + ("0" + fechaPrueba.getDate()).slice(-2)
     console.log('DATEZ2'+Datez)
    this.storage.set("fecha_inicio", Datez).then(() => { }, error => console.log(error));
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


  onSelectChange(bodega_id){
    this.storage.remove("bodega_id").then(() =>{
      this.storage.set("bodega_id", bodega_id).then(bodega_idSave =>{
      this.Valor_bodegaSave =  bodega_idSave
      }, error => console.log(error))
    }, error => console.log(error))
  }

  ionViewWillLeave() {
    if (this.Bodega_nombre) {
      this.storage.remove("fecha_inicio").then(() =>{
        this.storage.set("fecha_inicio", this.myDate).then(() => { }, error => console.log(error));
      }, error => console.log(error))
      
    }else{
      if (this.Valor_bodegaSave) {
        this.storage.remove("fecha_inicio").then(() => {
          this.storage.set("fecha_inicio", this.myDate).then(() => {
          }, error => console.log(error))
        }, error => console.log(error))
                
      }else{
        alert('No hay bodega agregada')
        this.navCtrl.setRoot(InicioFechaPage,{'fec':this.myDate})
      }
    }

  }
}
