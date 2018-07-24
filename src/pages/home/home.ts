import { Component } from '@angular/core';
import { NavController, MenuController, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
//formularios
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';

//App Version
import { AppVersion } from "@ionic-native/app-version";

// pagina lista
import { InicioFechaPage } from '../inicio-fecha/inicio-fecha';

//ToastControler
import { ToastController, Events } from 'ionic-angular'

//servicio
import { ServiceProvider } from './../../providers/service/service';
//storage
import { Storage } from '@ionic/storage';
//cryptoJS
//import * as CryptoJS from "crypto-js";

// import { MyApp } from './../../app/app.component';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  SecionForm:FormGroup;
  version:any;
  username:any;
  contrasena:any;

  constructor(
    public platform:Platform,
    public navCtrl: NavController,
    private appVersion:AppVersion,
    validatorForm : FormBuilder,
    private ToastCtrl : ToastController,
    public menu:MenuController,
    private service:ServiceProvider,
    private alertCtrl: AlertController,
    private storage: Storage,
    public events: Events
    // private myapp:  MyApp
    
         
  ) {
      this.SecionForm = validatorForm.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
      });
  }
  async ionViewDidLoad() {
    this.version = await this.appVersion.getVersionNumber();
  }

  login(){
    
    this.username = this.SecionForm.value.username;
    this.contrasena = this.SecionForm.value.password;
    
    this.service.Validador(this.username, this.contrasena).then(() =>{
    // this.myapp.user(this.username);

    this.service.Username().then((user:any) =>{
      this.events.publish('user', user);
    })

      this.navCtrl.setRoot(InicioFechaPage)



    },error =>{
      console.log(error)
      //console.log(error.status)
      
        if (error.status == 0) {
          let alart2 = this.alertCtrl.create({
            title:'error URL',
            inputs:[
              {
                name:'url',
                placeholder:'url'
              }
            ],
            buttons:[
              {
                text: 'Cancelar',
                role: 'cancel',
                handler: data =>{
                  this.platform.exitApp();
                }
              },
              {
                text:'Guardar',
                handler: data =>{
                  this.storage.remove("url").then(url =>{

                  }).then(() =>{
                    this.storage.set("url",data.url).then(() =>{

                    }, errorstorage =>{
                      console.log(errorstorage);
                    });
                  }, erroreeliminar =>{
                    console.log(erroreeliminar);
                  })
                }
              }
            ]
          });
          alart2.present();
        }else{

          let x = JSON.parse(error._body)
        if (x.error == "invalid_grant") {
          let toast2 = this.ToastCtrl.create({

            message: 'Usuario y contraseña invalida',
            duration: 3500,
            position: 'top'
          });
          toast2.onDidDismiss(() => { });
          toast2.present()
        } else {

          if (x.error == "invalid_client") {
            console.log(x)
            let alert = this.alertCtrl.create({
              title: 'error Client ID',
              inputs: [
                {
                  name: 'client_id',
                  placeholder: 'client_id'
                }
              ],
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  handler: data => {
                    this.platform.exitApp();
                  }

                },
                {
                  text: 'Guardar',
                  handler: data => {
                    this.storage.remove("cliente_id").then(url => {

                    }).then(() => {
                      // console.log(data.client_id);
                      this.storage.set("cliente_id", data.client_id).then(() => {

                      }, errorstorage => {
                        console.log(errorstorage);
                      });
                    }, erroreliminar => {
                      console.log(erroreliminar)
                    })
                  }
                }
              ]
            });
            alert.present();
          }else{
            console.log("otro problema")
          }
        }
      }
        });
    
    
  }

}
