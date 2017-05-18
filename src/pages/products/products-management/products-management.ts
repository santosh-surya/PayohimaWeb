import { UploadProductPage } from './../upload-product/upload-product';
import { StorageService } from './../../../providers/storage-service';
import { ViewChild } from '@angular/core';
import { SettingsService } from './../../../providers/settings-service';
import { ProductEditPage } from './../product-edit/product-edit';
import { AuthService } from './../../../providers/auth-service';
import { ProductService } from './../../../providers/product-service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Events, ViewController, LoadingController, AlertController, ToastController } from 'ionic-angular';

/*
  Generated class for the Items page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-products-management',
  templateUrl: 'products-management.html'
})
export class ProductsManagementPage {
  products: any = [];
  tab:string = "list";
  @ViewChild('searchbar') searchBar: any;
  @ViewChild('uploaddata') uploadData: any;
  downloadURL:any;
  loading:any;
  batchUpdateReady: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,  
    private productService: ProductService,
    private authService: AuthService,
    public settingsService: SettingsService,
    public storageService: StorageService,
    private events: Events,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public changeDetectorRef: ChangeDetectorRef,
    private viewCtrl: ViewController) {
      this.events.subscribe("products:updated", this.productsUpdated.bind(this));

    }

  ionViewDidEnter() {
    this.products = this.productService.products;
    
  }
  
  productsUpdated(){
    try {
      this.products = this.productService.products;
      this.changeDetectorRef.detectChanges();
    } catch (error) {
      
    }
  }
  filterProducts(ev){
    // set val to the value of the searchbar
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val != undefined) {
      this.products = {};
      for (var key in this.productService.products){
        if (this.productService.products[key].name.toLowerCase().indexOf(val.toLowerCase()) > -1){
          this.products[key] = this.productService.products[key];
        }
      }
      this.changeDetectorRef.detectChanges();
    }
  }
  productSelected(key, product){
    console.log(product);
    this.navCtrl.push(ProductEditPage, {key: key, product: product}); 
    this.cancelUpdate();
  }
  createProduct(){
    this.cancelUpdate();
    this.navCtrl.push(ProductEditPage, {product: null});
  }
  getCurrency(){
    return this.settingsService.getCompanySetting("currency");
  }
  tabChanged($event){
    this.tab = $event.value;
    this.changeDetectorRef.detectChanges();    
  }
  batchDownload(){
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
    let self = this;
    this.storageService.createTempFile(
      "Product_Export_"+this.authService.currentUserUid, 
      this.productService.downloadProducts(this.products), 
      "text/csv")
      .then((file:any)=>{
        file.getDownloadURL()
          .then((url)=>{
            self.downloadURL = url;
            self.changeDetectorRef.detectChanges();
            self.loading.dismiss();
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
            self.loading.dismiss();
          })
      })
      .catch((error)=>{
        console.log(error);
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
        self.loading.dismiss();
      })
    
  }
  //create a download file & ask user to edit & upload it
  updateBatch(){
    this.batchUpdateReady = true;
    this.batchDownload();
  }
  //tab separated file data
  batchUpload(){
    var data = this.uploadData.value.split("\n");
    console.log(data.length);
    if (data.length>1){
      //get header line
      var result:any = this.productService.uploadProducts(data, this.products);
      if (result.error){
        let toast = this.toastCtrl.create({
          message: result.error,
          showCloseButton: true,
          position: 'bottom',
          cssClass: "toast-error"
        });
        toast.present();
      }else{
        this.navCtrl.push(UploadProductPage, {uploadedProducts: result.uploadedProducts});
      }
    }else{
      let toast = this.toastCtrl.create({
        message: "No data records found ... please try again",
        duration: 3000,
        position: 'bottom',
        cssClass: "toast-error"
      });
      toast.present();      
    }
  }
  productCount(){
    return Object.keys(this.products).length;
  }
  productKeys(){
    return Object.keys(this.products);
  }
  cancelUpdate(){
    this.batchUpdateReady = false;
    this.downloadURL = null;
    this.changeDetectorRef.detectChanges();
  }
}
