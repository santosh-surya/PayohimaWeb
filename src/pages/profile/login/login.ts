import { AuthService } from './../../../providers/auth-service';
import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, NavParams, ModalController, ViewController, ToastController, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { SignupPage } from './../signup/signup';
import { ResetPasswordPage } from './../resetpassword/resetpassword';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public loginForm: any;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private platform: Platform,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController, 
    private modalCtrl: ModalController, 
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private viewCtrl: ViewController,
    private authService: AuthService){
      this.loginForm = formBuilder.group({
        email: ['anita@payohima.com', Validators.compose([Validators.required])],
        password: ['itissafe', Validators.compose([Validators.minLength(6), Validators.required])]
      });
  }
  pageClass(){
    if (this.platform._platforms.indexOf('core')>=0){
      return "web";
    }
  }
  loginUser(){
    let self = this;
    this.submitAttempt = true;
    // console.log(this.loginForm.value);

    if (this.loginForm.valid){
      this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then( authData => {
          
        })
        .catch( error => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            self.loading.dismiss();
            alert.present();
        });
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true
      });
      this.loading.present();
    }
  }
  goToSignup(){
    this.navCtrl.setRoot(SignupPage);
  }
  goToResetPassword(){
    this.navCtrl.setRoot(ResetPasswordPage);
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  showToast(message: string){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: false,
      duration: 2000,
      closeButtonText: 'OK',
      position: "top",
      cssClass: "login-successful"
    });
    toast.present();
  }
}
