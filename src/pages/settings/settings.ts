import { DashboardPage } from './../dashboard/dashboard';
import { SettingsService } from './../../providers/settings-service';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settingsForm: any;
  currencies: any = [
    "INR", "GBP", "USD"
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private toastCtrl: ToastController,
    public settingsService: SettingsService, 
    formBuilder: FormBuilder,
    private viewCtrl: ViewController) {
      this.settingsForm = formBuilder.group({
        companyName: [this.settingsService.companySettings.company_name, Validators.compose([Validators.minLength(5), Validators.required])],
        address: [this.settingsService.companySettings.company_address, Validators.compose([Validators.minLength(5), Validators.required])],
        contactName: [this.settingsService.companySettings.contact_name, Validators.compose([Validators.minLength(5), Validators.required])],
        contactEmail: [this.settingsService.companySettings.contact_email, Validators.compose([SettingsPage.validEmail])],
        identificationNo: [this.settingsService.companySettings.identification_no],
        currency: [this.settingsService.companySettings.currency],
        tax: [this.settingsService.companySettings.tax, Validators.compose([SettingsPage.validTax])],
        priceTaxInclusive: [this.settingsService.companySettings.price_tax_inclusive],
        stylesheet: [this.settingsService.companySettings.stylesheet],
        template: [this.settingsService.companySettings.template],
      });
  }
//'VAT XXXXXXXXXXX PAN YYYYYYYYYY CIN ZZZZZZZZZ'
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  save(){
    if (!this.settingsForm.valid){
      console.log(this.settingsForm.value);
    } else {
      this.settingsService.setCompanySetting("company_name", this.settingsForm.value.companyName);
      this.settingsService.setCompanySetting("company_address", this.settingsForm.value.address);
      this.settingsService.setCompanySetting("company_name_lower", this.settingsForm.value.companyName.toLowerCase());
      this.settingsService.setCompanySetting("contact_name", this.settingsForm.value.contactName);
      this.settingsService.setCompanySetting("contact_email", this.settingsForm.value.contactEmail);
      this.settingsService.setCompanySetting("identification_no", this.settingsForm.value.identificationNo);
      this.settingsService.setCompanySetting("stylesheet", this.settingsForm.value.stylesheet);
      this.settingsService.setCompanySetting("template", this.settingsForm.value.template);      
      this.settingsService.setCompanySetting("currency", this.settingsForm.value.currency);      
      this.settingsService.setCompanySetting("tax", this.settingsForm.value.tax);      
      this.settingsService.setCompanySetting("price_tax_inclusive", this.settingsForm.value.priceTaxInclusive);    
      let toast = this.toastCtrl.create({
        message: 'Company Settings Updated.',
        duration: 3000,
        position: 'bottom',
        cssClass: "toast-success"
      });
      toast.present();           

      this.navCtrl.setRoot(DashboardPage);
    }    
  }
  cancel(){
    
    this.navCtrl.setRoot(DashboardPage);
  }

  static validEmail(fc: FormControl){    
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(fc.value)){
      return null;
    }else{
      return {vaildEmail: false};  
    }
  }
  static validTax(fc: FormControl){
    if (isNaN(fc.value)){
      return {vaildEmail: false};  
    }else{
      if (fc.value>=100 || fc.value<0) 
        return {vaildEmail: false};  
      return null;
    }
  }

}
