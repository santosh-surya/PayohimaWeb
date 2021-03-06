import { SettingsService } from './settings-service';
import { Database } from './database';
import { Events, Platform } from 'ionic-angular';
import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import crypto from 'crypto';
/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
  public fireAuth: any;
  public usersDb: any;
  public companiesDb: any;
  public nav: any; // to allow for login screen

  public currentUser: any;
  public currentUserUid: any;

  zone: NgZone;

  constructor(
    public http: Http, 
    public storage: Storage,
    private events: Events,
    private database: Database,
    private settingsService: SettingsService,
    private platform: Platform) {
      // this.init();      
  }
// Init
  public init(){
    let self = this;
    return new Promise(function(resolve, reject){
      self.database.getDb().then((db:any)=>{
        self.fireAuth = self.database.auth;
        self.usersDb = db.ref('/database/users/');
        self.companiesDb = db.ref('/database/companies/');
        // console.log('auth constructed');
        resolve();
      })
      .catch((error)=>{
        console.log(error);
        reject(error);
      })
    })
  }
// use crypto to generate hash
generatePasswordHash(password){
    var key = crypto.pbkdf2Sync(password, this.settingsService.getGlobal('salt') , 10, 20, 'sha512');
    return key.toString("base64");    
}
//verify password hash
verifyPassword(password, passwordHash){
    var p = this.generatePasswordHash(password);
    return (p.password == passwordHash.password)
}

// Watch User Updates
onUserUpdate(){
  this.usersDb.child(this.currentUserUid).on("value", function(snapshot){
    if (snapshot.val() != null){
      this.currentUser = snapshot.val();
      this.events.publish("account:updated", this.currentUser);
    }else{
      console.log("Sorry, something went wrong. Please contact us to restore you account.");
    }
  }, this);
}
// Unwatch User Updates
offUserUpdate(){
  this.usersDb.child(this.currentUserUid).off("value");
}
//isSuperUser
isSuperUser(){
  if (this.currentUser){
    for (var role of this.currentUser.roles){
      if (role.role == "super admin") return true;
    }
  }
  return false;
}
//isSuperUser
isManager(){
  if (this.currentUser){
    for (var role of this.currentUser.roles){
      if (role.role == "manager") return true;
    }
  }
  return false;
}
// Reset Password
  resetPassword(email: string): any {
    return this.fireAuth.sendPasswordResetEmail(email);
  }
// Logout
  logoutUser(): any {
    if (this.currentUser){
      this.offUserUpdate();
    }
    this.currentUser = null;
    this.events.publish("login:loggedout",);
    return this.fireAuth.signOut();
  }
// Change Password
  changePassword(password){
    this.fireAuth.currentUser.updatePassword(password).then(()=>{
    });;
  }
// Login 
  loginUser(email: string, password: string): any {
    let self = this;
    return new Promise(function(resolve, reject){
      var p = self.generatePasswordHash(password);
      self.usersDb.orderByChild("password").equalTo(email+p).once("value", (snapshot)=>{
        if (snapshot.val() !=null){
            for(var d in snapshot.val()){
              self.currentUser = snapshot.val()[d];
              self.currentUserUid = d;
              self.events.publish("login:loggedin", self.currentUser);
              resolve(self.currentUser);
              self.onUserUpdate(); // start listening for changes to user data
              break;
            }
          }else{
            reject({message: "Sorry, username & password do not match any reecords."});
          }
      });
    });
  }
// Create up
  createUser(user) {
    let self = this;
    return new Promise(function(resolve, reject){
          var data = {
            displayName: user.displayName,
            email: user.email,
            password: user.password,
            mobile: user.mobile,
            providerId: "firebase",
            photoURL: '/assets/images/person-icon.png',
            company: self.currentUser.company,
            roles: user.roles
          }
          self.ensureUser(data).then((u)=>{
            self.ensureUserRoles(u, user.roles).then(()=>{
              resolve(u);
            });
          });
    });
  }

// Sign up
  signupUser(user) {
    let self = this;
    return new Promise(function(resolve, reject){
        var data = {
          displayName: user.displayName,
          email: user.email,
          mobile: user.mobile,
          providerId: 'firebase',
          password: user.email+self.generatePasswordHash(user.password),
          photoURL: '/assets/images/person-icon.png',
          companyname: user.companyname,
          companyaddress: user.companyaddress,
          roles: user.roles
        }
        self.ensureUser(data).then((u)=>{
          self.ensureUserRoles(u,[{location: 'DEFAULT', role: 'super admin'}]).then(()=>{
            resolve(u);
          });
        });
    });
  }
// Ensure Company
  ensureCompany(companyname, address, name, email){
    let self = this;
    return new Promise(function(resolve, reject){
      var c:any = {};
      c.settings = {
        "company_name": companyname,
        "company_name_lower": companyname.toLowerCase(),
        "company_address": address,
        "stylesheet": ";",
        "template": "{}",
        "identification_no": "VAT XXXXXXX TIN YYYYYYY",
        "contact_name": name,
        "contact_email": email,
        "currency": "GBP",
        "tax": 20,
        "price_tax_inclusive": true
      };
      var locations = [
        { name: "DEFAULT", products: [], transactions: [], settings: {}}
      ];
      var key = self.companiesDb.push().key;
      c.uid = key;
      self.companiesDb.child('/'+key).set(c)
        .then(()=>{
          self.ensureCompanyLocations(c, locations)
            .then(()=>{
              resolve(c);
            }) 
        })
        .catch((error)=>{
          reject(error);
        })
    });
  }
  ensureCompanyLocations(company:any, locations:any){
    let self = this;
    return new Promise(function(resolve, reject){
      let locationsDb = self.companiesDb.child('/'+company.uid+'/locations');
      for (var i=0; i<locations.length; i++){
        var location = locationsDb.push();
        locations[i].uid = location.key;
        location.set(locations[i]);     
      }
      resolve();
    });
  }
// Is Company Registered
  isCompanyRegistered(companyname){
    let self = this;
    return new Promise(function(resolve, reject){
      self.companiesDb.orderByKey().once("value", function(snapshot){
        var companies = snapshot.val();
        for (var company in companies){
          if (companies[company].settings.company_name_lower == companyname.toLowerCase()){
            reject({message:"Company Name already registered"});
          }
        }
        resolve();
      });
    });
  }
// Is User Registered
  isUserRegistered(email, company){
    let self = this;
    return new Promise(function(resolve, reject){
      self.usersDb.orderByChild("company_email").equalTo(company+"_"+email).once("value", function(snapshot){
        if (snapshot.val()){
          reject({message:"Email already registered ..."});
        }else{
          resolve();
        }
      });
    });
  }
// Delete User
  deleteUser(key){
    let self = this;
    return new Promise(function(resolve, reject){
      self.database.getDb().then((db:any)=>{
        var userRef = db.ref('/database/users/'+key);
        userRef.remove()
        .then(function() {
          console.log("Remove user succeeded.");
          resolve();
        })
        .catch(function(error) {
          console.log("Remove user failed: " + error.message);
          reject(error);
        });
      });
    });
  }
// Ensure User
  ensureUser(user: any){
    let self = this;
    var data:any = {
        "displayName": user.displayName,
        "email": user.email,
        "password": user.password,
        "mobile": user.mobile,
        "providerId": user.providerId,
        "photoURL": user.photoURL,
    }
    //create company first
    if (user.companyname != undefined){
      return new Promise(function(resolve, reject){
          self.ensureCompany(user.companyname, user.companyaddress, user.displayName, user.email)
            .then((company:any)=>{
              data.company = company.uid;
              data.company_email = company.uid+"_"+data.email;
              var key = self.usersDb.push().key;
              data.uid = key;
              self.usersDb.child('/'+key).set(data)
                .then(()=>{
                  resolve(data);
                })
                .catch((error)=>{
                  reject(error);
                })
            })
            .catch((error)=>{
              reject(error);
            });
        });
    }else{
      data.company = user.company;
      return new Promise(function(resolve, reject){
        var key = self.usersDb.push().key;
        data.uid = key;
        data.company_email = user.company+"_"+user.email;
        self.usersDb.child('/'+key).set(data)
          .then(()=>{
            resolve(data);
          })
          .catch((error)=>{
            reject(error);
          })
      });
    }
  }
  ensureUserRoles(user, roles){
    let self = this;
    return new Promise(function(resolve, reject){
      self.usersDb.child(user.uid+"/roles").set(roles);
      resolve();
    })
  }
  //load gelato database file
}
