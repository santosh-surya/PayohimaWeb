import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { SettingsService } from './../../../providers/settings-service';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import moment from 'moment';
/*
  Generated class for the ProductPrice page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-product-price',
  templateUrl: 'product-price.html'
})
export class ProductPricePage {
  private price: any;
  private index;
  private product:any;
  priceForm: any;
  submitAttempt: boolean = false;
  loading: any;
  isNew:any = true;
  public today:any;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  public settingsService: SettingsService,
  private viewCtrl: ViewController,
  private toastCtrl: ToastController,
  public formBuilder: FormBuilder) {
    this.price = navParams.get("price");
    this.index = navParams.get("index");
    this.product = navParams.get("product");
    if (!this.price){
       this.priceForm = formBuilder.group({
        sku: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        price: ['0.00', Validators.compose([Validators.required, ProductPricePage.validPrice])],
        stock: ['0', Validators.compose([ProductPricePage.validStock])],
        opening_stock: ['0', Validators.compose([ProductPricePage.validStock])],
        opening_stock_date: [moment().format("YYYY-MM-DD"), Validators.compose([ProductPricePage.validDate])]
      });   
      this.price = {};
    }else{
      var dt = this.price.opening_stock_date.split("/");
      if (dt.length==0)
        dt = dt[2]+"-"+dt[1]+"-"+dt[0];
      else
        dt = moment().format("YYYY-MM-DD");
       this.isNew = false;
       this.priceForm = formBuilder.group({
        sku: [this.price.sku, Validators.compose([Validators.minLength(1), Validators.required])],
        price: [this.price.price, Validators.compose([Validators.required, ProductPricePage.validPrice])],
        stock: [this.price.stock, Validators.compose([ProductPricePage.validStock])],
        opening_stock: [this.price.opening_stock, Validators.compose([ProductPricePage.validStock])],
        opening_stock_date: [dt, Validators.compose([ProductPricePage.validDate])]
      });   
    }
  }
  delete(){
    this.viewCtrl.dismiss({action: 'delete', index:this.index});
  }
  save(){
    var form = this.priceForm.value;
    if (this.priceForm.valid){
      for (var i=0; i<this.product.prices.length; i++){
        if ((this.product.prices[i].sku == form.sku && this.isNew) 
            || (this.product.prices[i].sku == form.sku && !this.isNew && i!=this.index)){
          let toast = this.toastCtrl.create({
            message: 'Product has this price!!',
            duration: 3000,
            position: 'bottom',
            cssClass: "error"
          });
          toast.present();              
          return;
        }
      }
      var dt = form.opening_stock_date.split("-");
      form.opening_stock_date = dt[2]+"/"+dt[1]+"/"+dt[0]
      this.viewCtrl.dismiss({action: this.isNew?"add":"edit", price: form, index:this.index});    
    }else{
      var msg = "";
      if (!this.priceForm.controls.sku.valid) msg += "SKU cannot be empty! ";
      if (!this.priceForm.controls.price.valid) msg += "Price must be 0.00 or more! ";
      if (!this.priceForm.controls.stock.valid) msg += "Stock must be a number!";
      let toast = this.toastCtrl.create({
        message: msg,
        // duration: 3000,
        position: 'bottom',
        cssClass: "toast-error",
        showCloseButton: true
      });
      toast.present();              
    }
  }
  cancel(){
    this.viewCtrl.dismiss({});
  }
  getTitle(){
    if (this.isNew){
      return "Edit Price";
    }else{
      return "Add Price";
    }
  }
  static validPrice(fc:FormControl){
    if (isNaN(fc.value)){
      return {validPrice: false};  
    }else{
      if (fc.value<0){
        return {validPrice: false};  
      }else{
        return null;
      }
    }
  }
  static validStock(fc:FormControl){
    if (isNaN(fc.value)){
      return {validStock: false};  
    }else{
      return null;
    }
  }
  static validDate(fc:FormControl){
    return null;
  }
}
