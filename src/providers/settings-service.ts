import { Database } from './database';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Events } from "ionic-angular";

/*
  Generated class for the SettingsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SettingsService {
  globalSettingsDb: any;
  companySettingsDb: any;
  companySettings: any;
  globalSettings: any;
  constructor(public http: Http,     
    private database: Database,
    private events: Events
) {
    events.subscribe("login:loggedin", this.userLoggedIn.bind(this));
    events.subscribe("login:loggedout", this.userLoggedOut.bind(this));
  }
  init(){
    let self = this;
    return new Promise(function(resolve, reject){
      self.database.getDb().then((db:any)=>{
        self.globalSettingsDb = db.ref('/database/settings/');
        self.globalSettingsDb.on('value', (snapshot)=>{
          if (snapshot.val()){
            self.globalSettings = snapshot.val();
            // console.log("global Settings", self.globalSettings);
            resolve();
          }else{
            self.globalSettings = {};
            self.globalSettingsDb.set(self.globalSettings);
            resolve();
          }
        })
      })
      .catch((error)=>{
        console.log(error);
        reject(error);
      })
    })
    
  }
  userLoggedOut(){
    // console.log("settings service: loggedout");
    if (this.companySettingsDb){
      this.companySettingsDb.off("value");
      this.companySettingsDb = null;
    }
  }
  userLoggedIn(user){
    // console.log("setttings service: loggedin");
    let self = this;
    this.database.getDb().then((db:any)=>{
      self.companySettingsDb = db.ref('/database/companies/'+user.company+"/settings");
      self.companySettingsDb.on("value", (snapshot)=>{
        if (snapshot.val()){
          self.companySettings = snapshot.val();
        }else{
          self.companySettings = {};
          self.companySettingsDb.set(self.companySettings);
        }
      })
    });
  }

  getGlobal(name){
    return this.globalSettings[name];
  }
  setGlobal(name, value){
    this.globalSettings[name] = value;
    this.globalSettingsDb.set(this.globalSettings);
  }
  getCompanySetting(name){
    return this.companySettings[name];
  }
  setCompanySetting(name, value){
    this.companySettings[name] = value;
    this.companySettingsDb.set(this.companySettings);
  }
}
