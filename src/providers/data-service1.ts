// import { Database } from './database';
import { Platform, Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
// import firebase from 'firebase';
// import { Storage } from '@ionic/storage';
// import { Facebook } from 'ionic-native';

/*
  Generated class for the DataService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataService {
  //database references  
  public db: any; //the database ref
  public deviceTokensDb: any; //to update the device token
  public companyDb: any; //to fetch company data
  //once we have company database ref post login, we will create reference for various dbs
  public productsDb: any; // all products ... synced
  public locationsDb: any; // all locations of the company
  public settingsDb: any; // company settings ... synced
  public transactionsDb: any; // company transactions ... synced
  public cashregisterDb: any; // cash registers ... synced
  
  //local data
  public settings: any = {};
  public products: any = [];
  public locations: any = [];
  public transactions: any = [];
  public cashregisters: any = [];
  public tickets: any = [];// open & closed

  constructor(private platform: Platform, public http: Http, public events: Events, public storage: Storage) {
    //retrieve data from assets database
    // this.http.get('assets/data/homescreen.json')
    //   .map((res) => res.json())
    //   .subscribe((data) => {
    //     // console.log(data); 
    //     for (let i=0; i<data.length; i++){
    //       data[i].image = "assets/images/placeholder-400x300.png"
    //     }
    //     this.homescreen = data;
    //   }, 
    //   (rej) => {
    //       console.error("Could not load local data",rej)
    //   });
  }

}
