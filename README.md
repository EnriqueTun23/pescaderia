# SISTEMA PARA AUTOMATIZACIÓN Y CONTROL DE PESAJE

Para un correcto funcionamiento del proyecto se requiere de Cordova y Ionic es necesario tener las siguientes consideraciones en cuanto al entorno de trabajo y dependencias.

## Requerimientos
* Java de Oracle version 1.7
* Android Sdk (Se descarga de la pagina oficial de Android).
* Node.js versión 10.1.0
* Cordova versión 8.0.0
* Ionic versión 3.20.0

## Inicializar el proyecto

Clonamos el proyecto desde el repositorio
```
$ git clone https://<username>@bitbucket.org/init8/appsacp.git
```

Instalamos los paquetes nativos o plugins de cordova.
```
$ ionic cordova prepare
```

Instalamos los paquetes para node.js
```
$ npm install
```

## Build and Run

Para compilar el proyecto se ejecuta el siguiente comando.
```
$ ionic cordova build android
```

Para correr el proyecto en del dispositivo se ejecuta el siguiente comando.
```
$ ionic cordova run android
```

## Extra
Para que este proyecto funcione se requiere de la aplicación UARTLoopBack que se encuentra en este repositorio [UARTLoopBack](https://bitbucket.org/init8/uartloopback/src/master/)
 > La aplicación esta hecha para correr con "Micro USB to RS232 Serial Adapter Cable for Android"