import { AuthService } from './../../../providers/auth-service';
import { LoginPage } from './../login/login';
import { NavController, LoadingController, AlertController, NavParams, ViewController, Platform, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public signupForm;
  submitAttempt: boolean = false;
  loading: any;

  constructor(public navCtrl: NavController, 
    private platform: Platform, 
    private navParams: NavParams,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private viewCtrl: ViewController) {

    this.signupForm = formBuilder.group({
      displayName: ['Anita Singh', Validators.compose([Validators.minLength(5), Validators.required])],
      mobile: ['9004684023', Validators.compose([SignupPage.validMobile])],
      email: ['anita@payohima.com', Validators.compose([SignupPage.validEmail])],
      password: ['itissafe', Validators.compose([Validators.minLength(8), Validators.required])],
      confirmpassword: ['itissafe', SignupPage.validPassword],
      companyname: ['Payohima', Validators.compose([Validators.minLength(5), Validators.required])],
      companyaddress: ['314, Ramgopal Industrial Estate\nDR RP Road\nMulund West\nMumbai 400080'],
    })
  }
  /**
   * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
   *  component while the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  signupUser(){
    let self = this;
    this.submitAttempt = true;
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
      self.authService.isCompanyRegistered(this.signupForm.value.companyname)
        .then(()=>{
          self.authService.signupUser(this.signupForm.value)
          .then((user) => {
            // self.loading.dismiss();
            self.navCtrl.setRoot(LoginPage);
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
        })
        .catch((error)=>{
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
        })
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
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
  cancel(){
    this.navCtrl.setRoot(LoginPage);
  }
}
