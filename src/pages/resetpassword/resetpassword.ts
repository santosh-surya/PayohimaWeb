import { LoginPage } from './../login/login';
import { AuthService } from './../../providers/auth-service';
import { NavParams, LoadingController, AlertController, Platform, NavController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

/*
  Generated class for the Resetpassword page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reset-password',
  templateUrl: 'resetpassword.html'
})
export class ResetPasswordPage {
  public resetPasswordForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;

  constructor(
    public formBuilder: FormBuilder, 
    private navParams: NavParams,
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController, 
    private platform: Platform,
    private navCtrl: NavController,
    private authService: AuthService,
    private toastCtrl: ToastController) {

    this.resetPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
    })
  }

  cancel(){
    this.navCtrl.setRoot(LoginPage);
  }
  resetPassword(){
    if (!this.resetPasswordForm.valid){
      console.log(this.resetPasswordForm.value);
    } else {
      this.authService.resetPassword(this.resetPasswordForm.value.email).then((user) => {
        let toast = this.toastCtrl.create({
          message: "An email with Reset instructions is sent to your email address.\nPlease check your email.",
          showCloseButton: true,
          closeButtonText: 'OK',
          position: "middle",
          cssClass: "login-successful"
        });
        toast.onDidDismiss(() => {
          this.navCtrl.setRoot(LoginPage);
        });
        toast.present();

      }, (error) => {
        var errorMessage: string = error.message;
        let errorAlert = this.alertCtrl.create({
          message: errorMessage,
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });

        errorAlert.present();
      });
    }
  }
}
