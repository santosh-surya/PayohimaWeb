import { ProductService } from './../../../providers/product-service';
import { SettingsService } from './../../../providers/settings-service';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController } from 'ionic-angular';

/*
  Generated class for the UploadProduct page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-upload-product',
  templateUrl: 'upload-product.html'
})
export class UploadProductPage {
  oldCount = 0;
  newCount = 0;
  oldModifiedCount = 0;
  newModifiedCount = 0;
  oldErrorCount = 0;
  newErrorCount = 0;

  public uploadedProducts: any = {"NEW":{}, "OLD":[]};
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public settingsService: SettingsService,
    private productService:ProductService,
    private toastCtrl: ToastController,
    private viewCtrl: ViewController) {
    this.uploadedProducts = this.navParams.get("uploadedProducts");
    this.oldCount = Object.keys(this.uploadedProducts["OLD"]).length;
    this.newCount = this.uploadedProducts["NEW"].length;
    for (var product of this.uploadedProducts["NEW"]){
      if (!product.errors && product.modified) this.newModifiedCount += 1;
      if (product.errors) this.newErrorCount += 1;
    }
    for (var key of Object.keys(this.uploadedProducts["OLD"])){
      if (!this.uploadedProducts["OLD"][key].errors && this.uploadedProducts["OLD"][key].modified) this.oldModifiedCount += 1;
      if (this.uploadedProducts["OLD"][key].errors) this.oldErrorCount += 1;
    }
  }
  oldProductCount(){
    return Object.keys(this.uploadedProducts["OLD"]).length;
  }
  oldProductKeys(){
    return Object.keys(this.uploadedProducts["OLD"]);
  }
  getCurrency(){
    return this.settingsService.getCompanySetting("currency");
  }
  newProductCount(){

  }
  save(){
    //add new products first
    var newProducts = [];
    var oldProducts = {};
    for (var product of this.uploadedProducts["NEW"]){
      if (!product.errors && product.modified){
        var p:any = {};
        p.uid = this.productService.createProduct().key;
        p.name = product.name_new;
        p.description = product.description_new;
        p.tax = product.tax_new;
        p.price_tax_inclusive = product.price_tax_inclusive_new;
        p.prices = [];
        for (var price of product.prices){
          p.prices.push({
              sku: price.sku_new,
              price: price.price_new,
              stock: price.stock_new,
              opening_stock: price.opening_stock_new,
              opening_stock_date: price.opening_stock_date_new
            });
        }
        newProducts.push(p);
      }
    }
    for (var key of this.oldProductKeys()){
      var product = this.uploadedProducts["OLD"][key];
        if (!product.errors && product.modified){
          var p:any = {};
          if (product.image){
            p.image = product.image;
          }
          p.name = product.name_new;
          p.description = product.description_new;
          p.tax = product.tax_new;
          p.price_tax_inclusive = product.price_tax_inclusive_new;
          p.prices = [];
          for (var price of product.prices){
            p.prices.push({
              sku: price.sku_new,
              price: price.price_new,
              stock: price.stock_new,
              opening_stock: price.opening_stock_new,
              opening_stock_date: price.opening_stock_date_new
            });
          }
          p.uid = product.uid;
          oldProducts[p.uid]= p;
        }
    }
    this.productService.updateProducts({NEW: newProducts, OLD:oldProducts})
      .then(()=>{
          let toast = this.toastCtrl.create({
            message: 'Saved successfully',
            duration: 3000,
            position: 'bottom',
            cssClass: "toast-success"
          });
          toast.present();
          this.viewCtrl.dismiss();
      })
      .catch((error)=>{
          let toast = this.toastCtrl.create({
            message: error,
            showCloseButton: true,
            position: 'bottom',
            cssClass: "toast-error"
          });
          toast.present();
      })
  }
}
