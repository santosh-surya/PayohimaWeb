import { Events } from 'ionic-angular';
import { Database } from './database';
import { AuthService } from './auth-service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { StorageService } from './storage-service';

@Injectable()
export class LocationService {
  locationsDb: any;
  public locations: any;
  constructor(
    http: Http,
    private imageService: StorageService,
    private authService: AuthService,
    private database: Database,
    private events: Events

  ) {
    // console.log("locations service created");
    events.subscribe("login:loggedin", this.userLoggedIn.bind(this));
    events.subscribe("login:loggedout", this.userLoggedOut.bind(this));
    // if (this.authService.currentUser)
      // this.userLoggedIn();
  }
  userLoggedOut(){
    // console.log("locations service: loggedout");
    if (this.locationsDb){
      this.locationsDb.off("value");
      this.locations = [];
      this.events.publish("locations:updated");
    }
  }
  userLoggedIn(){
    // console.log("locations service: loggedin");
    let self = this;
    this.database.getDb().then((db:any)=>{
      self.locationsDb = db.ref('/database/companies/'+self.authService.currentUser.company+"/locations");
      self.locationsDb.on("value", self.locationsUpdated, this);
    });
  }
  locationsUpdated(snapshot){
    this.locations = [];
    var u = snapshot.val();
    if (u){
      for (var key in u){
        this.locations.push(u[key]);
      }
    }
    // console.log("locations list generated");
    this.events.publish("locations:updated");
  }
}
