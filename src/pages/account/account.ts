import { ChangeDetectorRef } from '@angular/core';
import { AccountService } from './../../providers/account-service';
import { ImageService } from './../../providers/image-service';
import { AuthService } from './../../providers/auth-service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, Platform, ViewController } from 'ionic-angular';

/*
  Generated class for the Account page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  @ViewChild('imageUpload') imageUpload: any;
  @ViewChild('profileImage') image: any;
  accountForm: any;
  uploading: boolean = false;
  tempImage:any = null;

  constructor(
    public navCtrl: NavController, 
    public platform: Platform,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private accountService: AccountService,
    private imageService: ImageService,
    public viewCtrl: ViewController, 
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private cd: ChangeDetectorRef
    ) {
    this.accountForm = formBuilder.group({
      displayName: [this.authService.currentUser.displayName, Validators.compose([Validators.minLength(5), Validators.required])],
      mobile: [this.authService.currentUser.mobile, Validators.compose([AccountPage.validMobile])]
    })
  }
  getUser(){
    if (this.authService.currentUser){
      return this.authService.currentUser;
    }else{
      return {
        photoURL: "",
        roles: []
      }
    }
  }
  ionViewDidLoad() {
    if (this.authService.currentUser){
      this.accountForm.setValue({
        displayName: this.authService.currentUser.displayName,
        mobile: this.authService.currentUser.mobile,        
      });
    }
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  save(){
    let self = this;
    if (this.accountForm.dirty || this.tempImage){
      if (!this.accountForm.valid){
        let alert = this.alertCtrl.create({
            message: "Please correct the errors and try again",
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();        
      }else{
          this.accountService.setUserPhoto(this.tempImage).then(()=>{
            if (self.accountForm.dirty){
              self.accountService.setUserInfo(self.accountForm.controls.displayName.value, self.accountForm.controls.mobile.value).then(()=>{
                let toast = this.toastCtrl.create({
                  message: 'Saved successfully',
                  duration: 3000,
                  position: 'bottom'
                });
                toast.onDidDismiss(() => {
                  self.dismiss();
                });
                toast.present();
              }).catch((error)=>{
                console.log(error);
              });
            }else{
              let toast = this.toastCtrl.create({
                message: 'Saved successfully',
                duration: 3000,
                position: 'bottom'
              });
              toast.onDidDismiss(() => {
                self.dismiss();
              });
              toast.present();              
            }
          }).catch((error)=>{
            console.log("image update: ", error);
          });
      }
    }else{
      this.dismiss();
    }
  }
  uploadFile(files): any{
    let self = this;
    this.uploading = true;
    this.cd.detectChanges();
    return new Promise(function(resolve, reject){
      var file = files[0];
      var reader  = new FileReader();
      if (file.type.indexOf('image/')!=0){
        let alert = self.alertCtrl.create({
          message: "Not a valid image file",
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present();
        reject("not a valid image file");  
        self.uploading = false;    
        self.cd.detectChanges();
      }else{
        reader.addEventListener("load", function () {
          self.imageService.uploadTempImage(file.name, reader.result, file.type)
            .then((image:any)=>{
                self.image.nativeElement.src = image.downloadURL;
                self.tempImage = image;
                console.log(image.downloadURL);
                self.uploading = false;
                self.cd.detectChanges();
                resolve(image);
              }).catch(function(error) {
                self.showAlert(error);
                self.uploading = false;
                self.cd.detectChanges();
                reject(error);
              });
        }, false);
        if (file) {
          reader.readAsDataURL(file);
        } 
        console.log(this.imageUpload);    
      }
    })
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
    var data = fc.value;
    if (typeof fc.parent != 'undefined'){
      if (data.trim() == fc.parent.get('password').value.trim()){
        return null;
      }else{
        return {validPassword: false}
      }
    }else{
      return null;
    }
  }
  showAlert(error){
    let alert = this.alertCtrl.create({
      message: error,
      buttons: [
        {
          text: "Ok",
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }
}
