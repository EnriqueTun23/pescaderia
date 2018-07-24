
import { Injectable } from '@angular/core';

//storage

import { Storage } from '@ionic/storage';

//http
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ServiceProvider {
  url:String;
  url_auth: string = "/oauth/token/";
  url_user: string = "/auth/user/me";
  url_remove: string = "/oauth/revoke_token/";
  url_producto: string ="/productos/producto";
  url_categoria: string = "/productos/categoria";
  url_bodega: string = "/catalogos/bodega";
  url_proveedor: string = "/catalogos/proveedor";
  url_distribuidor: string = "/catalogos/distribuidor";
  url_compra: string = "/procesos/compra/"
  url_compraLote: string = "/procesos/compra/lote/" 
  url_otracompra: string = "/procesos/productocomprado/"
  url_productocompradopeso:string = "/procesos/productocompradopeso"
  url_calidadPpypy:string = "/calidad/ppypt";
  url_tallaPpypt: string = "/talla/ppypt"
  url_calidadPpypt: string = "/calidad/ppypt/"
  url_empaque:string = "/procesos/empaque/"
  url_anaquel:string = "/procesos/anaquel/";
  url_anaquelEmpaque: string = "/procesos/anaquelempaque/"
  constructor( private storage:Storage, private http:Http) {
    this.storage.get("url").then(url => {
      this.url = url;
    })
  }

  Validador(user:any, password:any){
    return new Promise((resolve, reject)=>{
    this.storage.get("url").then(url =>{
      this.storage.get("cliente_id").then(Cliente_id =>{
       // console.log(typeof(Cliente_id))
       // console.log(Cliente_id)
       // let x: string = "fNVcBQQamlF9mZX2BfDeoeTYdzAWLVl5vcL5aVci"
        // let x: string = Cliente_id
       // console.log(typeof(x));
       // console.log(x)
        
        this.http.post(url+this.url_auth,{
          client_id: Cliente_id,
          grant_type: "password",
          username: user,
          password: password
        }).map(data => data.json()).subscribe(dato => {
          
              this.storage.set("token", dato).then(token =>{
                var timeahora = new Date().getTime()
                
                this.storage.set("fecha", timeahora).then((dat) => {
                  
                })
                resolve(token)
              })          
        }, error =>{
          reject(error)
        });
        
      }, error =>{
        console.log(error)
      });
    },error =>{
      console.log(error)
    });
    });


  }
  Username(){
    return new Promise ((resolve, reject) =>{
      this.storage.get("token").then(token =>{
        let token_type = token.token_type;
        let access_token = token.access_token;
        let value = token_type + " " + access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url =>{
          this.http.get(url+this.url_user, {headers}).map(data => data.json()).subscribe(dat =>{
            resolve(dat)
          }, error =>{
            reject(error);
          });
        },error =>{
          console.log(error)
        });
      }, error =>{
        console.log(error);
      });
    })
  }

 Remove(){
  this.storage.get("url").then(url =>{
    this.storage.get("cliente_id").then(cliente_id =>{
      this.storage.get("token").then(token =>{
        this.http.post(url+this.url_remove,{
          token: token.access_token,
          client_id: cliente_id
        }).map(data => data.json()).subscribe(dato =>{
          console.log(dato)
        },error =>{
          console.log(error)
        })
      }, error =>{
        console.log(error)
      })
    }, error =>{
      console.log(error)
    })
  }, error =>{
    console.log(error)
  })
    
 } 
// -------------------------------------------------------funciones-----------------------------------------------------------------
 function_distribuidor(){
    return new Promise((resolve, reject) =>{
      this.storage.get("token").then(token =>{
        let value = token.token_type+" "+ token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url =>{
          this.http.get(url+this.url_distribuidor, {headers}).map(data => data.json()).subscribe(dat =>{
            resolve(dat)
          },error =>{
            reject(error);
          })
        }, errorr => {
          console.log(errorr)
        });
      }, errorr => {
        console.log(errorr)
      });
    })
 }
  function_proveedor(){
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          this.http.get(url + this.url_proveedor, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => {
            reject(error);
          })
        }, errorr => {
          console.log(errorr)
        });
      }, errorr => {
        console.log(errorr)
      });
    })
  }
 function_categoria(){
   return new Promise((resolve, reject) =>{
     this.storage.get("token").then(token =>{
       let value = token.token_type + " " + token.access_token;
       let headers = new Headers({ Authorization: value });
       this.storage.get("url").then(url=>{
          this.http.get(url+this.url_categoria, {headers}).map(data => data.json()).subscribe(dat =>{
            resolve(dat.results)
          }, error => reject(error));
       }, error => console.log(error));
     }, error => console.log(error));
   })
 }
  function_comprar(Distribuidor, Proveedor, Categoria, Producto, Peso, Tamano, Bodega, Recibio, Calidad, Tara){
    return new Promise((resolve, reject) =>{
      this.storage.get("token").then(token =>{
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url =>{
          let serch_url =  url+this.url_compra
          this.http.post(serch_url,{
            bodega:Bodega,
            distribuidor:Distribuidor,
            proveedor:Proveedor,
            recibio:Recibio,
            categoria:Categoria,
            tara:Tara,
            productocomprado:[
              {
                producto:Producto,
                talla:Tamano,
                calidad:Calidad,
                peso:Peso,
              }
            ],
          }, { headers }).map(data => data.json()).subscribe(dat =>{
            resolve(dat.id)
          }, error => reject(error));
        }, error => console.log(error))
      }, error => console.log(error))
    })
  
  
  }
function_segundacompra(Producto, Compra, Talla, Calidad, Peso){
      return new Promise((resolve, reject) =>{
        this.storage.get("token").then(token => {
          let value = token.token_type + " " + token.access_token;
          let headers = new Headers({ Authorization: value });
          this.storage.get("url").then(url => {
            let serch_url = url + this.url_otracompra
            this.http.post(serch_url, {
              producto: Producto,
              compra: Compra,
              talla: Talla,
              peso: Peso,
              calidad:Calidad
            }, { headers }).map(data => data.json()).subscribe(dat => {
              resolve(dat)
            }, error => reject(error));
          }, error => console.log(error))
        }, error => console.log(error))
      })
}

function_almacenar(Cabeza, Usuario, Producto, Calidad, Peso, Talla, Unidad_medida, Lote){
  return new Promise((resolve, reject) => {
    this.storage.get("token").then(token => {
      let value = token.token_type + " " + token.access_token;
      let headers = new Headers({ Authorization: value });
      this.storage.get("url").then(url => {
        let serch_url = url + this.url_empaque
        this.http.post(serch_url, {
          es_cabeza: Cabeza,
          usuario: Usuario,
          producto: Producto,
          calidad: Calidad,
          peso: Peso,
          talla:Talla,
          unidad_medida:Unidad_medida,
          lote:Lote
        }, { headers }).map(data => data.json()).subscribe(dat => {
          resolve(dat)
        }, error => reject(error));
      }, error => console.log(error))
    }, error => console.log(error))
  })
}
function_anaquel(Usuario,  Congelador, Configuracion, Lote){
  return new Promise((resolve, reject) =>{
    this.storage.get("token").then(token => {
      let value = token.token_type + " " + token.access_token;
      let headers = new Headers({ Authorization: value });
      this.storage.get("url").then(url => {
        let serch_url = url + this.url_anaquel
        this.http.post(serch_url, {
          usuario: Usuario,
          congelador: Congelador,
          configuracion: Configuracion,
          lote: Lote
        }, { headers }).map(data => data.json()).subscribe(dat => {
          resolve(dat)
        }, error => reject(error));
      }, error => console.log(error))
    }, error => console.log(error))
  })
}

function_anaquelEmpaque(Anaquel, Fila, Columna, Empaque)
{
  return new Promise((resolve, reject) => {
    this.storage.get("token").then(token => {
      let value = token.token_type + " " + token.access_token;
      let headers = new Headers({ Authorization: value });
      this.storage.get("url").then(url => {
        let serch_url = url + this.url_anaquelEmpaque
        this.http.post(serch_url, {
          anaquel: Anaquel,
          fila: Fila,
          columna: Columna,
          empaque: Empaque
        }, { headers }).map(data => data.json()).subscribe(dat => {
          resolve(dat)
        }, error => reject(error));
      }, error => console.log(error))
    }, error => console.log(error))
  })
}
  



// ------------------------------------------busquedas-------------------------------------------------
 Search_size(number){
   return new Promise((resolve, reject) =>{
    this.storage.get("token").then(token =>{
      let value = token.token_type+" "+token.access_token;
      let headers = new Headers({ Authorization: value});
      this.storage.get("url").then(url =>{
        let serch_url = url+this.url_producto+"/"+number+"/talla";
        this.http.get(serch_url, {headers}).map(data => data.json()).subscribe(dat =>{
          resolve(dat);
        },erroorr=>{
          reject(erroorr);
        });
      }, errorr =>{
        console.log(errorr)
      })
    }, error => {
      console.log(error)
    });
   })  
 }
 
 Search_winery(){
   return new Promise((resolve, reject) =>{
     this.storage.get("token").then(token =>{
       let value =  token.token_type+" "+token.access_token;
       let headers = new Headers({ Authorization: value });
       this.storage.get("url").then(url => {
          let search_winery = url+this.url_bodega;
          this.http.get(search_winery,{headers}).map(data => data.json()).subscribe(dat =>{
            resolve(dat.results)
          },error =>{
            reject(error)
          })
       }, errorr=> {
         console.log(errorr)
       })
     }, errori => {
       console.log(errori)
     })
   })
 }

 Search_product(number){
   return new Promise((resolve, reject) =>{
     this.storage.get("token").then(token =>{
       let value = token.token_type + " " + token.access_token;
       let headers = new Headers({ Authorization: value });
       this.storage.get("url").then(url =>{
         let serch_url = url + this.url_categoria + "/" + number + "/producto";
         this.http.get(serch_url, {headers}).map(data => data.json()).subscribe(dat =>{
           resolve(dat.results)
         }, error => reject(error))
       },errpr => console.log(errpr));
     }, error => console.log(error));
   })
 }
 Search_categoryOne(){
   return new Promise((resolve, reject) =>{
     this.storage.get("token").then(token =>{
       let value = token.token_type + " " + token.access_token;
       let headers = new Headers({ Authorization: value });
       this.storage.get("url").then(url =>{
         let serch = url+this.url_categoria
         this.http.get(serch, {headers}).map(data => data.json()).subscribe(dat =>{
           resolve(dat)
         }, error => reject(error))
       }, erro => console.log(erro))
     }, error => console.log(error))
   })
 }
 Search_category(number){
   return new Promise((resolve, reject) =>{
    this.storage.get("token").then(token =>{
      let value = token.token_type + " " + token.access_token;
      let headers = new Headers({ Authorization: value });
      this.storage.get("url").then(url =>{
        let serch_url2 = url+this.url_categoria+ "/" + number
        this.http.get(serch_url2, {headers}).map(data => data.json()).subscribe(dat =>{
          resolve(dat)
        }, error => reject(error))
      }, error => console.log(error))
    }, error =>{ console.log(error)}) 
   })
 } 
 Search_distribuidor(number){
   return new Promise((resolve, reject) =>{
     this.storage.get("token").then(token =>{
       let value = token.token_type + " " + token.access_token;
       let headers = new Headers({ Authorization: value });
       this.storage.get("url").then(url =>{
         let serch_url3 = url+this.url_distribuidor+"/"+number
          this.http.get(serch_url3, {headers}).map(data => data.json()).subscribe(dat =>{
            resolve(dat)
          }, error => reject(error))
       }, error => console.log(error))
     }, error => console.log(error))
   })
 }
 Search_proveedor(number){
   return new Promise((resolve, reject) => {
     this.storage.get("token").then(token => {
       let value = token.token_type + " " + token.access_token;
       let headers = new Headers({ Authorization: value });
       this.storage.get("url").then(url => {
         let serch_url3 = url + this.url_proveedor + "/" + number
         this.http.get(serch_url3, { headers }).map(data => data.json()).subscribe(dat => {
           resolve(dat)
         }, error => reject(error))
       }, error => console.log(error))
     }, error => console.log(error))
   })
 }
 Search_user(){
   return new Promise((resolve , reject) =>{
     this.storage.get("token").then(token =>{
       let value = token.token_type + " " + token.access_token;
       let headers = new Headers({ Authorization: value });
       this.storage.get("url").then(url =>{
         let search =  url+this.url_user
         this.http.get(search , {headers}).map(data => data.json()).subscribe(dat =>{
           resolve(dat)
         }, error => reject(error))
       }, error => console.log(error))
     }, error => console.log(error))
   })
 }

 Search_compra(data){
   return new Promise((resolve, reject) =>{
     this.storage.get("token").then(token =>{
       let value = token.token_type + " " + token.access_token;
       let headers = new Headers({ Authorization: value });
       this.storage.get("url").then(url =>{
         let searchs = url + this.url_compra +"?fecha="+data
         console.log(searchs)
        this.http.get(searchs, {headers}).map(data => data.json()).subscribe(dat =>{
          resolve(dat)
        }, error => reject(error))
       }, error => console.log(error))
     }, error => console.log(error))
   })
 }
 Search_compraLote(id)
 {
   return new Promise((resolve, reject) => {
     this.storage.get("token").then(token => {
       let value = token.token_type + " " + token.access_token;
       let headers = new Headers({ Authorization: value });
       this.storage.get("url").then(url => {
         let searchs = url + this.url_compra +  id
         console.log(searchs)
         this.http.get(searchs, { headers }).map(data => data.json()).subscribe(dat => {
           resolve(dat.lote)
         }, error => reject(error))
       }, error => console.log(error))
     }, error => console.log(error))
   })
 }
 Search_productosComprados(id){
   return new Promise((resolve ,reject) =>{
     this.storage.get("token").then(token => {
       let value = token.token_type + " " + token.access_token;
       let headers = new Headers({ Authorization: value });
       this.storage.get("url").then(url => {
         let searchs = url + this.url_compra + id +"/productocomprado/"
         this.http.get(searchs, { headers }).map(data => data.json()).subscribe(dat => {
           resolve(dat)
         }, error => reject(error))
       }, error => console.log(error))
     }, error => console.log(error))
   })
 }
 Search_talla(id){
   return new Promise((resolve, reject)=>{
     this.storage.get("token").then(token =>{
       let value = token.token_type + " " + token.access_token;
       let headers = new Headers({ Authorization: value });
       this.storage.get("url").then(url =>{
         let serch =  url + this.url_categoria+"/"+id+"/talla";
         this.http.get(serch , {headers}).map(data => data.json()).subscribe(dat =>{
           resolve(dat.results)
         }, error => reject(error))
       }, erro => console.log(erro))
     },error => console.log(error))
   })
 }
  Search_calidad(id) {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let serch = url + this.url_categoria + "/" + id + "/calidad";
          this.http.get(serch, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat.results)
          }, error => reject(error))
        }, erro => console.log(erro))
      }, error => console.log(error))
    })
  }
  Search_productoPeso(fecha) {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_productocompradopeso + "/?fecha="+fecha
          console.log(search)
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }
  Search_tallaPpypt(id){
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_categoria+"/"+id+this.url_tallaPpypt
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }

  Search_categoriaPpypt(id) {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_categoria + "/" + id + this.url_calidadPpypt
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }
  Search_tallaPpyptEspecifica(categoria_id, id) {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_categoria + "/" + categoria_id + this.url_tallaPpypt+"/"+id
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }
  Search_EmpaqueLote(Lote, Producto_id) {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_empaque + "?lote=" + Lote + "&producto=" + Producto_id;
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }
  Search_bodegaId(id){
    return new Promise((resolve, reject) =>{
      this.storage.get("token").then(token =>{
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url =>{
          let search  = url+this.url_bodega+"/"+id;
          this.http.get(search, {headers}).map(data => data.json()).subscribe(dat =>{
            resolve(dat.nombre)
          }, error => reject(error));
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }
  Search_wineryid(id) {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_bodega + "/" + id;
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => reject(error));
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }


//  ------------------------------------------------ valores ---------------------------------------------

 Valor_url(){
  return new Promise((resolve, reject) =>{
    this.storage.get("url").then(url =>{
      resolve(url)
    },error =>{
      reject(error)
    });
  })
 }
 Valor_clienteId(){
   return new Promise((resolve, reject) => {
     this.storage.get("cliente_id").then(cliente_id =>{
       resolve(cliente_id)
     },error =>{
       reject(error)
     });
    })
 }
 Valor_bodega(){
   return new Promise((resolve , reject) =>{
     this.storage.get("bodega_id").then(bodega_id =>{
       resolve(bodega_id)
     }, error =>{
       reject(error)
     })
   })
 }



// -----------------------------------------------------Remove valors storage-----------------------------------
Remove_configuration(url:any, cliente_id:any, bodega_id:any){
  return new Promise((resolve, reject) =>{

    
  this.storage.remove("url").then(() =>{
      this.storage.remove("cliente_id").then(() =>{
        this.storage.remove("bodega_id").then(() =>{
          this.Save_configuration(url, cliente_id, bodega_id).then(dat =>{
            resolve(dat)
          }, error => reject(error))
       
        },error => console.log(error))
          
      }, error => console.log(error))
    }, error => console.log(error))
  })
  }

  Save_configuration(url: any, cliente_id: any, bodega_id: any){
    return new Promise((resolve, reject) =>{
      this.storage.set("bodega_id", bodega_id).then(() => {
        this.storage.set("url", url).then(() => {
          this.storage.set("cliente_id", cliente_id).then((i) => {
              resolve(i)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error));
    }) 
    
  }
 
  //--------------------------Filter------------------------------------
  filter_fechaEmpaque(fecha) {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_compraLote + "?fecha=" + fecha;
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }

  filter_EmpaqueXLoote(lote)
  {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_empaque + "?sin_asignar=true&lote=" + lote 
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }
  filter_EmpaqueXLotemasProducto(lote, id_producto)
  {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_empaque + "?sin_asignar=true&lote=" + lote +"&producto="+id_producto
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }
  filter_EmpaqueXLoteProductoTalla(lote,id_producto, id_talla){
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_empaque + "?sin_asignar=true&lote=" + lote + "&producto=" + id_producto +"&talla="+id_talla
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }
  filter_EmpaqueXLoteProductoTalla2(lote, id_talla) {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_empaque + "?sin_asignar=true&lote=" + lote + "&talla=" + id_talla
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }

  filter_EmpaqueXLoteProductoCalidad(lote, id_calidad) {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_empaque + "?sin_asignar=true&lote=" + lote + "&calida=" + id_calidad
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }
  filter_EmpaqueXLoteProductoCalidad2(lote, id_producto, id_calidad) {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_empaque + "?lote=" + lote+ "&producto=" + id_producto  + "&calida=" + id_calidad
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }
  filter_EmpaqueXLoteProductoTallaCalidad(lote, id_producto, id_talla, id_calidad) {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_empaque + "?lote=" + lote + "&producto=" + id_producto +"&talla="+id_talla+ "&calida=" + id_calidad
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            resolve(dat)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }

  filter_Anaquel(fecha){
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token => {
        let value = token.token_type + " " + token.access_token;
        let headers = new Headers({ Authorization: value });
        this.storage.get("url").then(url => {
          let search = url + this.url_anaquel + "?fecha=" +  fecha
          this.http.get(search, { headers }).map(data => data.json()).subscribe(dat => {
            
            resolve(dat)
          }, error => reject(error))
        }, error => console.log(error))
      }, error => console.log(error))
    })
  }

  filter_infinitiScroll(url)
  {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token =>{
        let value =  token.token_type + " "+ token.access_token;
        let headers = new Headers({ Authorization: value });
        this.http.get(url, {headers}).map(data => data.json()).subscribe(dat =>{
            resolve(dat)
        }, error => reject(error))
      }, error => console.log(error));
    })
  }

  get_anaquel_by_id(id)
  {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token =>{
        let value =  token.token_type + " "+ token.access_token;
        let headers = new Headers({ Authorization: value });
        this.http.get(this.url + this.url_anaquel + id, {headers}).map(data => data.json()).subscribe(dat =>{
            resolve(dat)
        }, error => reject(error))
      }, error => console.log(error));
    })
  }

  get_compraXlote_by_id(id)
  {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token =>{
        let value =  token.token_type + " "+ token.access_token;
        let headers = new Headers({ Authorization: value });
        this.http.get(this.url + this.url_compraLote  + id + '/', {headers}).map(data => data.json()).subscribe(dat =>{
            resolve(dat)
        }, error => reject(error))
      }, error => console.log(error));
    })
  }

  delete_empaqueanaquel(id)
  {
    return new Promise((resolve, reject) => {
      this.storage.get("token").then(token =>{
        let value =  token.token_type + " "+ token.access_token;
        let headers = new Headers({ Authorization: value });
        this.http.delete(this.url + this.url_anaquelEmpaque + id, {headers}).map(data => data.json()).subscribe(dat =>{
            resolve(dat)
        }, error => reject(error))
      }, error => console.log(error));
    })
  }

}

