import { ProductPricePage } from './../product-price/product-price';
import { SettingsService } from './../../../providers/settings-service';
import { StorageService } from './../../../providers/storage-service';
import { ProductService } from './../../../providers/product-service';
import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { AuthService } from './../../../providers/auth-service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, ViewController, LoadingController, ModalController, Events, ToastController } from 'ionic-angular';

/*
  Generated class for the ProductEdit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-product-edit',
  templateUrl: 'product-edit.html'
})
export class ProductEditPage {
  product:any;
  key: any;
  productForm: any;
  submitAttempt: boolean = false;
  loading: any;
  isNew:any = true;

  @ViewChild('imageUpload') imageUpload: any;
  @ViewChild('productImage') image: any;
  uploading: boolean = false;
  tempImage:any = null;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private imageService: StorageService,
    private settingsService: SettingsService,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private cd: ChangeDetectorRef,
    private events: Events,
    public platform: Platform,
    public productService: ProductService) {
    this.key = this.navParams.get("key");
    this.product = this.navParams.get("product");
    // events.subscribe("userrole:added");
    if (!this.product){
       this.productForm = formBuilder.group({
        name: ['', Validators.compose([Validators.minLength(5), Validators.required])],
        description: [''],
        image: ["/assets/images/placeholder-400x300.png"],
        tax: [this.settingsService.companySettings['tax'], Validators.compose([ProductEditPage.validTax])],
        price_tax_inclusive: [this.settingsService.companySettings['price_tax_inclusive']]
      });   
      this.product = {prices: [], image:"/assets/images/placeholder-400x300.png"};
    }else{
       this.isNew = false;
       this.productForm = formBuilder.group({
        name: [this.product.name, Validators.compose([Validators.minLength(5), Validators.required])],
        description: [this.product.description],
        image: [this.product.image],
        tax: [this.product.tax, Validators.compose([ProductEditPage.validTax])],
        price_tax_inclusive: [this.product.price_tax_inclusive],
      });   
      
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductEditPage');
  }
  getTitle(){
    if (this.product.name){
      return this.product.name;
    }else{
      return "Create New Product";
    }
  }
  editPrice(price, index){
    var priceModal = this.modalCtrl.create(ProductPricePage, {price: price, product: this.product, index:index});
    priceModal.onDidDismiss(data => {
      if (data !=undefined){
        var price:any; var index;
        switch (data.action){
        case "delete":
            index = data.index;
            this.removePrice(index);
            break;
        case "edit":
            price= data.price;
            index = data.index;
            this.product.prices[index] = price;
            break;
          default:
        }
      }
   });
   priceModal.present();
    
  }
  addPrice(){
    var priceModal = this.modalCtrl.create(ProductPricePage, {product: this.product});
    priceModal.onDidDismiss(data => {
      if (data !=undefined){
        var price:any; var index;
        switch (data.action){
          case "add": 
            price= data.price;
            this.product.prices.push(price);
            break;
        case "delete":
            index = data.index;
            this.removePrice(index);
            break;
        case "edit":
            price= data.price;
            index = data.index;
            this.product.prices[index] = price;
            break;
          default:
        }
      }
   });
   priceModal.present();
  }
  removePrice(index){
    this.product.prices.splice(index, 1);
  }
  static validStock(fc: FormControl){
    if (isNaN(fc.value)){
      return {vaildTax: false};  
    }else{
      return null;
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
  save(){
    let self = this;
    this.submitAttempt = true;
    if (!this.productForm.valid){
      console.log(this.productForm.value);
    } else {
      if (this.product.prices.length==0){
        let alert = this.alertCtrl.create({
          message: "At least one price is required",
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present();        
      }else{
        var form = this.productForm.value;
        this.product.name = form.name;
        this.product.description = form.description;
        if (form.tax.length==0) form.tax = this.settingsService.companySettings['tax'];
        this.product.tax = form.tax;
        this.product.price_tax_inclusive = form.price_tax_inclusive;
        if (this.isNew){
          this.product.uid = this.productService.createProduct().key;
        }
        self.productService.updateProduct(this.product)
          .then((product) => {
            //now move image
            if (self.tempImage){
              self.productService.setProductImage(product, self.tempImage)
                .then(()=>{
                  let toast = this.toastCtrl.create({
                    message: 'Saved successfully',
                    duration: 3000,
                    position: 'bottom',
                    cssClass: "toast-success"
                  });
                  toast.present();
                  self.viewCtrl.dismiss();
                })
                .catch((error)=>{
                  self.loading.dismiss();
                  self.showAlert(error);
                });
            }else{
              let toast = this.toastCtrl.create({
                message: 'Saved successfully',
                duration: 3000,
                position: 'bottom',
                cssClass: "toast-success"
              });
              toast.present();
              self.viewCtrl.dismiss();                
            }
          })
          .catch((error) => {
              self.loading.dismiss();
              self.showAlert(error);
          });
        this.loading = this.loadingCtrl.create({
          dismissOnPageChange: true,
        });
        this.loading.present();
      }
    }
  }
  delete(){
    let self = this;
    if (this.product){
      this.productService.deleteProduct(this.product)
        .then(()=>{
          self.viewCtrl.dismiss();
        })
        .catch((error)=>{
            let toast = this.toastCtrl.create({
              message: 'Product cannot be deleted ['+error+'].',
              position: 'bottom',
              showCloseButton: true,
              closeButtonText: "OK",
              cssClass: "toast-error"
            });
            toast.present();              
        });
    }
    
  }
  cancel(){
    this.viewCtrl.dismiss();
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
