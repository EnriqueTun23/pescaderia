import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlertController, Events } from 'ionic-angular';
//paginas para navegar
import { HomePage } from '../pages/home/home';
import { ListaPage } from '../pages/lista/lista';
// import { InicioPage } from '../pages/inicio/inicio';
import { ClasificarPage } from '../pages/clasificar/clasificar'
import { AlmacenPage } from '../pages/almacen/almacen';
import { ConfiguracionPage } from '../pages/configuracion/configuracion';
import { InicioFechaPage } from '../pages/inicio-fecha/inicio-fecha';

//storage
import { Storage } from '@ionic/storage';

//
import { ServiceProvider } from '../providers/service/service';


@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  
  rootPage:any=HomePage; 
  inicio = ListaPage;
  clasificar = ClasificarPage;
  almacen = AlmacenPage;
  configuracion = ConfiguracionPage;
  inicioHora =  InicioFechaPage;
  
  username:any;
  permisos = {
    is_admin:false,
    is_recepcion:false,
    is_pesaje:false,
    is_anaqueles:false
  }

  @ViewChild('mycontent') contenido:NavController
  



  constructor(public platform: Platform, 
    statusBar: StatusBar, 
    private splashScreen: SplashScreen, 
    public menuCtrl:MenuController, 
    private storage:Storage, 
    private alertCtrl:AlertController,
    private service: ServiceProvider,
    private events: Events ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      this.Check();
      
      this.events.subscribe('user', (user) =>{
        this.username = user.username
        this.hasPermission(user);
        console.log(this.permisos);
      })

      this.storage.remove("fecha_inicio").then(() => {
        let dato = new Date()
        let Datez = dato.getFullYear() + "-" + ("0" + (dato.getMonth() + 1)).slice(-2) + "-" + ("0" + dato.getDate()).slice(-2)
        console.log('DATEZ' + Datez);
       this.storage.set("fecha_inicio", Datez).then(() => { }, error => console.log(error));
      })
      
    });
  }

  hasPermission(user): any{
    console.log(user);
    if(user.is_active){
      if(user.is_superuser){
        this.permisos.is_admin = true;
        this.permisos.is_recepcion = true;
        this.permisos.is_pesaje = true;
        this.permisos.is_anaqueles = true
        return
      }
      for(let group of user.groups){
        if(group.name=='Administrador' || group.name=='Recepcion'){
          console.log('permiso de recepcion')
          console.log(group.name)
          this.permisos.is_recepcion = true;
        }
        if(group.name=='Administrador' || group.name=='Pesaje'){
          console.log('permiso de pesaje')
          console.log(group.name)
          this.permisos.is_pesaje = true;
        }
        if(group.name=='Administrador' || group.name=='Anaqueles'){
          console.log('permiso de anaqueles')
          console.log(group.name)
          this.permisos.is_anaqueles = true
        }
        if(group.name=='Administrador'){
          console.log('permiso de recepcion')
          console.log(group.name)
          this.permisos.is_admin = true;
        }
      }
    }
  }

  Check(){

    this.storage.get("url").then(dato =>{
        if (dato) {
           this.storage.get("token").then(token =>{
             if (token) {
                
               this.storage.get("fecha").then(fecha =>{
                 var fecha_nuevo = new Date().getTime()
                 var timecompare = fecha_nuevo - fecha;
                 var segundo=(timecompare/1000)
                
              
                 if (segundo <= token.expires_in) {
                   this.service.Username().then((username:any) =>{
                    
                     this.username = username.username;
                     this.hasPermission(username);
                     console.log(this.permisos);
                   })
                   this.contenido.setRoot(this.inicioHora)
                 }else{
                   console.log("Ya expiro el token")
                   this.service.Remove(); 
                   this.storage.remove("fecha").then(() =>{
                     this.contenido.setRoot(this.rootPage)
                   }, error =>{
                     console.log(error)
                   });
                  }
              })
              
               
             }else{
               
               this.contenido.setRoot(this.rootPage)
             }
           })
          
        }else{
          
          this.Settings();
          
        }
        
      },error =>{
        console.log(error)
      }
    ).then(() =>{
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);
    })
    
    
   // this.splashScreen.hide();

  }

  paginas(pag){
    this.contenido.setRoot(pag);
    this.menuCtrl.close();
  }

 Settings(){
    let alert =  this.alertCtrl.create({
      title:'Settings',
      inputs:[
        
        {
          name:'url',
          placeholder:'url'
        },
        {
          name:'client_id',
          placeholder:'client_id'
        }
      ],
      buttons:[
        {
          text:'Cancelar',
          role:'cancel',
          handler: data =>{
            this.platform.exitApp();
            console.log('cancelar')
          }
        },
        {
          text:'Guardar',
          handler: data =>{
            this.storage.set("url", data.url).then(url =>{
                
                this.storage.set("cliente_id", data.client_id).then(id =>{
                
                }, error =>{
                  console.log(error);
                });
            }, error =>{
              console.log(error);
            });
                      }
        }
      ]
    });

    alert.present();

 }

 logout(){
  this.events.subscribe('user');
  this.username = undefined;
  this.permisos = {
    is_admin:false,
    is_recepcion:false,
    is_pesaje:false,
    is_anaqueles:false
  }
  this.service.Remove();
  this.storage.remove("fecha").then(() =>{
    this.contenido.setRoot(this.rootPage);
    this.menuCtrl.close();
  }, error =>{
    console.log(error)
  });

}


 

}

