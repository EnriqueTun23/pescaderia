import { ServiceProvider } from './../../providers/service/service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

/**
 * Generated class for the ModalDetailAnquelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-detail-anquel',
  templateUrl: 'modal-detail-anquel.html',
})
export class ModalDetailAnquelPage {

  data:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private service: ServiceProvider,
    public viewCtrl: ViewController,
    public alertCtrl:AlertController) {
    this.data = this.navParams.get('data');
    
  }

  ionViewDidLoad() {
    console.log(this.data);
    console.log('ionViewDidLoad ModalDetailAnquelPage');
  }

  dismiss() {
    this.viewCtrl.dismiss(this.data.empaques);
  }

  remove(item){
    let index = this.data.empaques.indexOf(item);
    if(index > -1){
      let confirm = this.alertCtrl.create({
        title: 'Eliminar empaque',
        message: '¿Esta usted seguro que desea quitar el empaque del anaquel?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Si',
            handler: () => {
              this.service.delete_empaqueanaquel(item.id).then(data => {
                this.data.empaques.splice(index, 1);
                console.log('Remove empaqueanaquel');
              });
            }
          }
        ]
      });
      confirm.present(); 
    }
  }
}
