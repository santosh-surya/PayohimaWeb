import { Events } from 'ionic-angular';
import { Database } from './database';
import { AuthService } from './auth-service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ImageService } from './image-service';

/*
  Generated class for the AccountService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AccountService {

  constructor(public http: Http, 
    private imageService: ImageService,
    private authService: AuthService,
    private database: Database,
    private events: Events
     ) {
    console.log('Hello AccountService Provider');
  }
// Set User photoURL  
  setUserPhoto(image){
    let self = this;
    return new Promise(function(resolve, reject){
      // This can be downloaded directly:
      if (image){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(event) {
          var blob = xhr.response;
          //now upload it correctly
          self.imageService.uploadBlobImage(blob, "/database/"+self.authService.currentUser.company+"/profileimages/"+self.authService.currentUser.uid, image.type)
            .then((img:any)=>{
              self.authService.usersDb.child("/"+self.authService.currentUser.uid+"/photoURL").set(img.downloadURL);
              self.authService.currentUser.photoURL = img.downloadURL;
              image.ref.delete().then(()=>{
                resolve();              
              }).catch((error)=>{
                console.log(error);
                reject(error);
              })
            });
        };
        xhr.open('GET', image.downloadURL);
        xhr.send();
      }else{
        resolve("nothing to do");
      }
    })
  }
  setUserInfo(name, mobile){
    let self = this;
    return new Promise(function(resolve, reject){
      self.database.getDb().then((db)=>{
        db.ref('/database/users/'+self.authService.currentUser.uid+"/displayName").set(name);
        db.ref('/database/users/'+self.authService.currentUser.uid+"/mobile").set(mobile);
        self.authService.currentUser.displayName = name;
        self.authService.currentUser.mobile = mobile;
        resolve();
      }).catch((error)=>{
        reject(error);
      })

    })
  }
}
