import { AuthService } from './auth-service';
import { Database } from './database';
import { Events, Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ImageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class StorageService {

  constructor(
    public http: Http, 
    private events: Events,
    private database: Database,
    private authService: AuthService,
    private platform: Platform) {

  }
// Upload Image
  uploadBlobImage(blob, ref, type){
  let self = this;
  return new Promise(function(resolve, reject){
    self.database.getStorage()
      .then( (storage:any)=>{
        storage.child(ref).put(blob, {contentType: type})
          .then((savedPicture) => {
            resolve(savedPicture);
          });
      })
      .catch((error)=>{
        reject(error.message);
      })

  })
  }

// Upload Temp Image
  uploadTempImage(name, file:string, type){
    let self = this;
    return new Promise(function(resolve, reject){
      if (file.indexOf("data:")==0){
        file = file.substring(file.indexOf('base64,')+7);
      }
      self.database.getStorage()
        .then( (storage:any)=>{
          var ref = storage.child('/database/tempimages/'+name);
          ref.putString(file, 'base64', {contentType: type})
            .then((savedPicture) => {
              resolve(savedPicture);
            });
        })
        .catch((error)=>{
          reject(error.message);
        })

    })
  }

  createTempFile(name, data, contentType){
    let self = this;
    return new Promise(function(resolve, reject){
      self.database.getStorage()
        .then( (storage:any)=>{
          var ref = storage.child('/database/tempfiles/'+name);
          ref.putString(data, 'raw', {contentType: contentType})
            .then((savedFile) => {
              resolve(savedFile.ref);
            });
        })
        .catch((error)=>{
          reject(error.message);
        })

    })
    
  }
}
