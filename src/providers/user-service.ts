import { Events } from 'ionic-angular';
import { Database } from './database';
import { AuthService } from './auth-service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ImageService } from './image-service';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {
  usersDb: any;
  public users: any;
  constructor(
    http: Http,
    private imageService: ImageService,
    private authService: AuthService,
    private database: Database,
    private events: Events

  ) {
    console.log("user service created");
    events.subscribe("login:loggedin", this.userLoggedIn.bind(this));
    events.subscribe("login:loggedout", this.userLoggedOut.bind(this));
  }
  userLoggedOut(){
    console.log("user service: loggedout");
    if (this.usersDb){
      this.usersDb.off("value");
      this.users = [];
      this.events.publish("users:updated");
    }
  }
  userLoggedIn(){
    console.log("user service: loggedin");
    let self = this;
    this.database.getDb().then((db:any)=>{
      self.usersDb = db.ref('/database/users');
      self.usersDb.orderByChild("company").equalTo(self.authService.currentUser.company).on("value", self.usersUpdated, this);
    });
  }
  usersUpdated(snapshot){
    this.users = [];
    var u = snapshot.val();
    if (u){
      for (var key in u){
        u[key].uid = key;
        this.users.push(u[key]);
      }
    }
    console.log("users list generated");
    this.events.publish("users:updated");
  }
  updateUser(user){
    let self = this;
    return new Promise(function(resolve, reject){
      self.database.getDb().then((db)=>{
        db.ref('/database/users/'+user.uid).set(user);
        resolve();
      }).catch((error)=>{
        reject(error);
      })

    });
  }
}
