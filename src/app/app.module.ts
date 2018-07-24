import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
// import es from '@angular/common/locales/es';
// import { registerLocaleData } from '@angular/common';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

//Paginas
import { InicioPage } from './../pages/inicio/inicio';
import { Inicio2Page } from './../pages/inicio2/inicio2';
import { InicioFechaPage } from './../pages/inicio-fecha/inicio-fecha';
import { ClasificarPage } from './../pages/clasificar/clasificar';
import { Clasificar2Page } from './../pages/clasificar2/clasificar2';
import { Clasificar3Page } from './../pages/clasificar3/clasificar3';
import { AlmacenPage } from './../pages/almacen/almacen';
import { Almacen2Page } from './../pages/almacen2/almacen2';
import { ModalAnaquelPage } from './../pages/modal-anaquel/modal-anaquel';
import { AnaquelEdicionPage } from './../pages/anaquel-edicion/anaquel-edicion';
import { ModalDetailAnquelPage } from './../pages/modal-detail-anquel/modal-detail-anquel';
import { ModalSearchPage } from './../pages/modal-search/modal-search';
import { ListaPage } from './../pages/lista/lista';
import { Lista2Page } from './../pages/lista2/lista2';
import { ConfiguracionPage } from './../pages/configuracion/configuracion';
import { CompraPage } from './../pages/compra/compra';
//Provicer 
import { ServiceProvider } from '../providers/service/service';
import { Clipboard } from '@ionic-native/clipboard';


//App Version
import { AppVersion } from "@ionic-native/app-version";

// import storage
import { IonicStorageModule } from "@ionic/storage";

//uso de HTTP datos remotos 
import { HttpModule } from '@angular/http';
// import { InterceptorProvider } from '../providers/interceptor/interceptor';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    //Paginas
    InicioPage,
    InicioFechaPage,
    ClasificarPage,
    AlmacenPage,
    Almacen2Page,
    ModalAnaquelPage,
    AnaquelEdicionPage,
    ModalDetailAnquelPage,
    ModalSearchPage,
    ListaPage,
    ConfiguracionPage,
    CompraPage,
    Lista2Page,
    Inicio2Page,
    Clasificar2Page,
    Clasificar3Page
    
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    //paginas
    InicioPage,
    InicioFechaPage,
    ClasificarPage,
    AlmacenPage,
    Almacen2Page,
    ModalAnaquelPage,
    AnaquelEdicionPage,
    ModalDetailAnquelPage,
    ModalSearchPage,
    ListaPage,
    ConfiguracionPage,
    CompraPage,
    Lista2Page,
    Inicio2Page,
    Clasificar2Page,
    Clasificar3Page
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Clipboard,
    //App Version
    AppVersion,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    

    ServiceProvider
    // InterceptorProvider
  ]
})
export class AppModule {}
