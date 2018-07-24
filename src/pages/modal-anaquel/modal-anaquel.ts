import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

//servicio
import { ServiceProvider } from './../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-modal-anaquel',
  templateUrl: 'modal-anaquel.html',
})
export class ModalAnaquelPage {
  Fila:number;
  Columna:number;
  Fecha_hoy;
  Lote:string;
  Categoria:number;
  cate:any
  calidadPpypt:any;
  tallaPpypt:any;
  carga: boolean;
  ListaXLote :any;
  ListaXLoteProducto : any;
  datoCheack:any;
  id_producto:any;
  id_talla:any;
  id_anaquel:any
  id_calida:any
  page:any;
  //--------ejemplo
  //-----
  newMessage=[];
  lista_empaques=[];
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private service: ServiceProvider,
  ) {
    this.Fila = this.navParams.get('fila');
    this.Columna = this.navParams.get('columna');
    this.Fecha_hoy =  this.navParams.get('fecha');
    this.Lote = this.navParams.get('lote');
    this.Categoria = this.navParams.get('categoria');
    this.id_anaquel = this.navParams.get('id_anaquel')

    


    this.service.Search_product(this.Categoria).then(lista_categoria =>{
      this.cate = lista_categoria;
    }, error => console.log(error))

    this.service.Search_tallaPpypt(this.Categoria).then(lista_tallaPpypt =>{
      let x = JSON.stringify(lista_tallaPpypt);
      let y = JSON.parse(x);
      this.tallaPpypt = y.results
    }, error => console.log(error))

    this.service.Search_categoriaPpypt(this.Categoria).then(lista_calidadPpypt =>{
      let a = JSON.stringify(lista_calidadPpypt);
      let b = JSON.parse(a);
      
      if (b.count) {
        this.carga = true
        this.calidadPpypt = b.results
        
      }else{
        this.carga =  false
      }

    }, error => console.log(error))
    
    this.service.filter_EmpaqueXLoote(this.Lote).then(lista_empaquesXlote =>{
      let lXl = JSON.stringify(lista_empaquesXlote)
      let lxl2 = JSON.parse(lXl)
  
      this.ListaXLote = lxl2.results;
      this.page = lxl2.next;
      

     


    }, error => console.log(error))
      
     
      

    }
  onSelectChange(dato){
    this.id_producto = dato.id;
    this.service.filter_EmpaqueXLotemasProducto(this.Lote, this.id_producto).then(lista_empaquesxloteyproducto =>{
      let lxlp = JSON.stringify(lista_empaquesxloteyproducto);
      let lxlp2 = JSON.parse(lxlp)
      this.ListaXLote = lxlp2.results;
      this.page = lxlp2.next;
    },error => console.log(error))
    
  }
  onSelectChange2(dato)
  {
    this.id_talla = dato.id
    if (this.id_producto) {
      
      this.service.filter_EmpaqueXLoteProductoTalla(this.Lote, this.id_producto, this.id_talla).then(lista_EmpaqueXLoteProductoTalla => {
        let lxlpt = JSON.stringify(lista_EmpaqueXLoteProductoTalla);
        let lxlpt2 = JSON.parse(lxlpt);
        this.ListaXLote = lxlpt2.results
        this.page = lxlpt2.next;

      }, error => console.log(error))
    } else {
      this.service.filter_EmpaqueXLoteProductoTalla2(this.Lote, this.id_talla).then(lista_EmpaqueXLoteProductoTalla2 =>{
        let lxlpt2  = JSON.stringify(lista_EmpaqueXLoteProductoTalla2);
        let lxlpt22 = JSON.parse(lxlpt2);
        this.ListaXLote = lxlpt22.results;
        this.page = lxlpt22.next; 
      }, error => console.log(error));
    }

  }
  onSelectChannge3(dato)
  {
    this.id_calida = dato.id 
    if (this.id_producto) {
      if (this.id_talla) {
        this.service.filter_EmpaqueXLoteProductoTallaCalidad(this.Lote, this.id_producto, this.id_talla, this.id_calida).then(lista_empaquexLoteTallaCalida =>{
          let LxLPTC = JSON.stringify(lista_empaquexLoteTallaCalida);
          let LxLPTC2 = JSON.parse(LxLPTC);
          this.ListaXLote = LxLPTC2.results;
          this.page = LxLPTC2.next
        },error => console.log(error))
      }else{
        this.service.filter_EmpaqueXLoteProductoCalidad2(this.Lote, this.id_producto, this.id_calida).then(lista_EmpaquexLoteCAlidad2 =>{
          let lxleLCC = JSON.stringify(lista_EmpaquexLoteCAlidad2);
          let lxleLCC2 = JSON.parse(lxleLCC);
          this.ListaXLote = lxleLCC2.results
          this.page = lxleLCC2.next
        }, error => console.log(error))
      }
    }else{
      this.service.filter_EmpaqueXLoteProductoCalidad(this.Lote, this.id_calida).then(lista_EmpaquexLoteCalidad =>{
        let lxeLC = JSON.stringify(lista_EmpaquexLoteCalidad);
        let lxeLC2 = JSON.parse(lxeLC);
        this.ListaXLote = lxeLC2.results;
        this.page = lxeLC2.next
      },error => console.log(error))
    }
  }

  
  ejem(dato)
  {
    console.log(dato);
  }


  doInfinite(infiniteScroll) {
    if (this.page) {
      this.service.filter_infinitiScroll(this.page).then(lista_empaque => {
        let ConversionEmpaque = JSON.stringify(lista_empaque);
        let ConversionEmpaque2 = JSON.parse(ConversionEmpaque);
        for (let i = 0; i < ConversionEmpaque2.results.length; i++) {
          this.ListaXLote.push(ConversionEmpaque2.results[i])

        }
        this.page = ConversionEmpaque2.next;
        infiniteScroll.complete();
      }, error => console.log(error));
    } else {
      infiniteScroll.complete();
    }
  }

  createRecursive(list){
    if(list.length > 0){
      let item = list.pop();
      if(item.checked){
        this.service.function_anaquelEmpaque(this.id_anaquel, this.Fila, this.Columna, item.id).then(data => {
          this.lista_empaques.push(data);
          this.createRecursive(list);
        })
      }
    }
    else{
      this.viewCtrl.dismiss(this.lista_empaques);
    }
  }
  

  dismiss() {
    let selecteds = [];
    console.log('List');
    console.log(this.ListaXLote)
    this.createRecursive(this.ListaXLote);
    // for(let item of this.ListaXLote){
    //   if(item.checked){
    //     selecteds.push(item);
    //     this.service.function_anaquelEmpaque(this.id_anaquel, this.Fila, this.Columna, item.id).then(dat => {
    //     }, error => console.log(error))
    //   }
    // }
    // this.viewCtrl.dismiss(selecteds);
    
  }
}
