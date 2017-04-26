import { UserService } from './../../providers/user-service';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from './../../providers/auth-service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, ViewController, LoadingController, ModalController, Events, ToastController } from 'ionic-angular';
import {LocationService} from './../../providers/location-service';
/*
  Generated class for the UserEditPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-edit',
  templateUrl: 'user-edit.html'
})
export class UserEditPage {
  user: any; 
  userForm: any;
  rolesForm: any;
  roles: any = [];
  submitAttempt: boolean = false;
  roleMaster: any = ["super admin", "manager", "user"];
  loading: any;
  isNew:any = true;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public formBuilder: FormBuilder,
    private locationService: LocationService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private cd: ChangeDetectorRef,
    private events: Events,
    public platform: Platform,
    public userService: UserService) {
    this.user = this.navParams.get("user");
    // events.subscribe("userrole:added");
    if (!this.user){
      //create empty form    
      this.userForm = formBuilder.group({
        company: this.authService.currentUser.company,
        displayName: ['test1', Validators.compose([Validators.minLength(5), Validators.required])],
        mobile: ['999999999', Validators.compose([UserEditPage.validMobile])],
        email: ['test1@test.com', Validators.compose([UserEditPage.validEmail])],
        password: ['password', UserEditPage.validPassword],
        confirmpassword: ['password', UserEditPage.validConfirmPassword],
      });
      // this.rolesForm = formBuilder.group({
      //   location: ['', Validators.compose([Validators.required])],
      //   role: ['', Validators.compose([Validators.required])]
      // });
      this.userForm.addControl("locationnew", new FormControl(""));
      this.userForm.addControl("rolenew", new FormControl(""));
      this.user = {roles: []};
    }else{
      this.isNew = false;
      this.userForm = formBuilder.group({
        company: this.authService.currentUser.company,
        displayName: [this.user.displayName, Validators.compose([Validators.minLength(5), Validators.required])],
        mobile: [this.user.mobile, Validators.compose([UserEditPage.validMobile])],
        email: [this.user.email, Validators.compose([UserEditPage.validEmail])],
        password: ['', UserEditPage.validPassword],
        confirmpassword: ['', UserEditPage.validConfirmPassword],
      })
      for (let i=0; i<this.user.roles.length; i++){
        this.userForm.addControl("location"+i, new FormControl(this.user.roles[i].location));
        this.userForm.addControl("role"+i, new FormControl(this.user.roles[i].role));        
      }
      this.userForm.addControl("locationnew", new FormControl(""));
      this.userForm.addControl("rolenew", new FormControl(""));
      this.roles = this.user.roles;
    }
  }
  // roleUpdated(){
  //   this.roles = this.user.roles;
  // }
  addRole(){
    var form = this.userForm.value;
    if (form.locationnew != "" || form.rolenew != ""){
      //check if role already assigned
      for (var i=0; i<this.user.roles.length; i++){
        if (this.user.roles[i].role == form.rolenew && this.user.roles[i].location == form.locationnew){
          let toast = this.toastCtrl.create({
            message: 'User has this role!!',
            duration: 3000,
            position: 'bottom',
            cssClass: "error"
          });
          toast.present();              
          return;
        }
      }
      this.user.roles.push({location: form.locationnew, role: form.rolenew});
      this.userForm.controls.locationnew.setValue(""); this.userForm.controls.rolenew.setValue("");
      this.cd.detectChanges();
    }
  }
  removeRole(role, index){
    console.log('remove', role);
    this.user.roles.splice(index, 1);
  }
  ionViewDidLoad() {
  }
  getTitle(){
    if (this.user){
      return this.user.displayName;
    }else{
      return "Create User";
    }
  }
  saveUser(){
    if (!this.userForm.valid){
      console.log(this.userForm.value);
    } else {
      this.user.displayName = this.userForm.value.displayName;
      this.user.email = this.userForm.value.email;
      this.user.mobile = this.userForm.value.mobile;
      if (this.userForm.controls.password.dirty)
        this.user.password = this.userForm.value.email+this.authService.generatePasswordHash(this.userForm.value.password);
      
      this.userService.updateUser(this.user)
        .then(()=>{
          let toast = this.toastCtrl.create({
            message: 'User updated.',
            duration: 3000,
            position: 'bottom',
            cssClass: "toast-success"
          });
          toast.present();              
          this.viewCtrl.dismiss();     
        })
        .catch((error)=>{
          let toast = this.toastCtrl.create({
            message: 'User updated.',
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: "OK",
            cssClass: "toast-error"
          });
          toast.present();              
        });
    }    
  }
  deleteUser(){
    let self = this;
    if (this.user){
      this.authService.deleteUser(this.user.uid)
        .then(()=>{
          self.viewCtrl.dismiss();
        })
        .catch((error)=>{
            let toast = this.toastCtrl.create({
              message: 'User cannot be deleted.',
              position: 'bottom',
              showCloseButton: true,
              closeButtonText: "OK",
              cssClass: "toast-error"
            });
            toast.present();              
        });
    }
  }
  createUser(){
    let self = this;
    this.submitAttempt = true;
    if (!this.userForm.valid){
      console.log(this.userForm.value);
    } else {

      this.authService.isUserRegistered(this.userForm.controls.email.value, this.authService.currentUser.company)
        .then(()=>{
          if (this.user.roles.length==0){
              let alert = this.alertCtrl.create({
                message: "At least one role is mandatory",
                buttons: [
                  {
                    text: "Ok",
                    role: 'cancel'
                  }
                ]
              });
              alert.present();        
          }else{
            var form = this.userForm.value;
            form.password = form.email+this.authService.generatePasswordHash(form.password);
            form.roles = this.user.roles;
            
            self.authService.createUser(form)
              .then((user) => {
                self.viewCtrl.dismiss();
              })
              .catch((error) => {
                self.loading.dismiss();
                let alert = this.alertCtrl.create({
                  message: error.message,
                  buttons: [
                    {
                      text: "Ok",
                      role: 'cancel'
                    }
                  ]
                });
                alert.present();
              });
            this.loading = this.loadingCtrl.create({
              dismissOnPageChange: true,
            });
            this.loading.present();
          }
        })
        .catch((error)=>{
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          
        })

    }
  }

  static validEmail(fc: FormControl){    
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(fc.value)){
      return null;
    }else{
      return {vaildEmail: false};  
    }
  }
  static validMobile(fc: FormControl){
    let re = /\d{8,}/;
    var data = fc.value;
    data = data.split(' ').join('');
    if (re.test(data) && data.length >=9){
      return null;
    }else{
      return {vaildEmail: false};  
    }
  }
  static validPassword(fc: FormControl){
    if (fc.value.trim().length>0 && fc.value.trim().length<8){
      return {validPassword: false};
    }else{
      return null;
    }
  }
  static validConfirmPassword(fc: FormControl){
    var data = fc.value;
    if (typeof fc.parent != 'undefined'){
      if (data.trim() == fc.parent.get('password').value.trim() || fc.parent.get('password').value.trim().length==0){
        return null;
      }
      return {validConfirmPassword: false}
    }else{
      return null;
    }
  }
  cancel(){
    this.viewCtrl.dismiss();
  }
}