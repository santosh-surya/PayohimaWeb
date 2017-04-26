import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
/*
  Generated class for the Database provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Database {

  public dbInstance: any;
  public fireApp:any;
  public storageRef: any;
  public auth: any;

  constructor(private platform: Platform) {
  }

  getDb(ref:string = null): any{
    let self = this;
    return new Promise(function(resolve, reject){
      if (self.dbInstance){
        resolve(self.dbInstance);
      }else{
        return this.init().then(()=>{
          resolve(self.dbInstance);
        });
      }
    });
  }

  getRefs(ref:string = null): any{
    let self = this;
    return new Promise(function(resolve, reject){
      if (self.dbInstance){
        if (ref){
          resolve(self.dbInstance.database().ref(ref));
        }
        else  
          resolve(self.dbInstance.database().ref("/database"));
      }else{
        return this.init().then((db)=>{
          if (ref){
            if (ref.indexOf("/")==0) {
              ref = "/database"+ref;
            }else{
              ref = "/database" + ref.substr(1);
            }
            resolve(self.dbInstance.database().ref(ref));
          }
          else  
            resolve(self.dbInstance.database().ref("/database"));
        })
      }

    })
  }
  getStorage(): any{
    let self = this;
    return new Promise(function(resolve, reject){
      if (self.storageRef){
          resolve(self.storageRef);
      }else{
        self.init().then(()=>{
            resolve(self.storageRef);
        })
      }
    })
  }
  init(){
    let self = this;
    return new Promise(function(resolve, reject){
      //initialise database
      var config = {
        apiKey: "AIzaSyAnVF75YKMd-XKFd275jKGNKSEuaarsLqQ",
        authDomain: "payohima-10d68.firebaseapp.com",
        databaseURL: "https://payohima-10d68.firebaseio.com",
        storageBucket: "payohima-10d68.appspot.com",
        messagingSenderId: "921700995648"
      };
      self.fireApp = firebase.initializeApp(config);
      self.dbInstance = self.fireApp.database();
      self.storageRef = firebase.storage().ref();
      self.auth = self.fireApp.auth();
      console.log('firebase initialised');
      resolve();
    })
  }


}
