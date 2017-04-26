import { Platform, Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {BluetoothSerial } from 'ionic-native';

/*
  Generated class for the Bluetooth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
  Use events to bind ui updates
        this.events.subscribe("bt:ready", this.updateUI.bind(this) );
        this.events.subscribe("bt:listdevices", this.updateUI.bind(this) );
        this.events.subscribe("bt:connect", this.updateUI.bind(this) );
        this.events.subscribe("bt:connect:error", this.updateUI.bind(this) );
        this.events.subscribe("bt:disconnect", this.updateUI.bind(this) );
        this.events.subscribe("bt:disconnect:error", this.updateUI.bind(this) );

*/
@Injectable()
export class Bluetooth {
  public devices: any = [];
  public device: any;
  public data: string;
  public connected: boolean = null;
  public ready: boolean = null;

  constructor(public http: Http, public platform: Platform, public events: Events) {
    console.log('Bluetooth Initialised');
    let self = this;
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('Bluetooth Initialised');
      this.listDevices().then(()=>{
        self.ready = true;
        self.events.publish("bt:ready", self.devices);
      }).catch((error)=>{
        console.log(error);
        self.ready = true;
        self.events.publish("bt:ready");
      })    
    });
  }
  ensureConnection(){
    let self = this;
    return new Promise(function(resolve, reject){
      BluetoothSerial.isConnected().then(()=>{
        resolve();
      })
      .catch((error)=>{
        //not connected
        self.connected = null;
        self.events.publish("bt:disconnect");
        if (!this.device){
          reject("Device not selected.");
        }else{
          self.connect(self.device).then(()=>{
            self.events.publish("bt:connect");
            resolve(true);
          }).catch((error)=>{
            self.events.publish("bt:connect:error", error);
            reject(error);
          });
        }
        reject(error);
      })
    })
  }
  disconnect(){
    let self = this;
    return new Promise(function(resolve, reject){
      BluetoothSerial.disconnect().subscribe((value)=>{
          console.log("disconnected: ", value);
          self.connected = null;
          self.events.publish("bt:disconnect");
          resolve();
      }, (error)=>{
        console.log(error);
        self.connected = null;
        self.events.publish("bt:disconnect:error", error);
        reject(error);
      });
    })
  }
  connect(device){
    this.device = device;
    console.log('connecting to: ',this.device);
    let self = this;
    let bt:any;
    return new Promise(function(resolve, reject){
      if (self.platform._platforms.indexOf('android')>=0){
        bt = BluetoothSerial.connectInsecure(self.device);
      }else if (self.platform._platforms.indexOf('ios')>=0){
        bt = BluetoothSerial.connect(self.device);
      }
      if (typeof bt == 'undefined'){
          self.events.publish("bt:connect:error", 'Bluetooth Connection failed');
          reject('Bluetooth Connection failed');
      }else{
        bt.subscribe(
          (success)=>{
            console.log("connected");
            console.log(success);
            self.connected = true;
            resolve(true);
            self.events.publish("bt:connect");
          }, 
          (error)=>{
            console.log("subscribe failed");
            console.log(error);
            self.events.publish("bt:connect:error", error);
            reject(error);
          })
      }
    })
  }
  write(data){
    let self=this;
    return new Promise(function(resolve, reject){
      self.ensureConnection()
        .then(()=>{
          BluetoothSerial.write(data).then((success)=>{
            console.log("write successfull");
            console.log(success);
            resolve();
          })
          .catch((error)=>{
              console.log("write failed: ", error);
              reject(error);
          })
        })
        .catch((error)=>{
          console.log("ensure Connection failed", error)
          reject(error);
        })
    });
  }
  listDevices(){
    let self = this;
    return new Promise(function(resolve, reject){
      BluetoothSerial.isEnabled().then(()=>{
        BluetoothSerial.list().then((d)=>{
          self.devices = [];
          for(let i=0; i<d.length; i++){
            if (self.platform._platforms.indexOf('android')>=0){
              self.devices.push({
                name: d[i].name,
                address: d[i].address
              });
            }else if (self.platform._platforms.indexOf('ios')>=0){
              self.devices.push({
                name: d[i].name,
                address: d[i].uuid
              })
            }
          }
          console.log(self.devices);
          self.events.publish("bt:listdevices", self.devices);
          resolve(self.devices);
        }).catch((error)=>{
          console.log('listdevices failed: ', error);
          reject(error);
        })
      }).catch((error)=>{
        console.log("bluetooth not enabled");
        reject("bluetooth not enabled");
      });
    });
  }
}
