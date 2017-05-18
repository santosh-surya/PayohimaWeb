import { ProductPricePage } from './../pages/products/product-price/product-price';
import { StorageService } from './storage-service';
import { Database } from './database';
import { SettingsService } from './settings-service';
import { Events } from 'ionic-angular';
import { AuthService } from './auth-service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import moment from 'moment';
/*
  Generated class for the ProductService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductService {
  public products: any = [];
  public productsDb: any;
  public skuCount;
  constructor(public http: Http,
    private authService: AuthService,
    private database: Database,
    private settingsService: SettingsService,
    private imageService: StorageService,
    private events: Events) {

    console.log("product service created");
    events.subscribe("login:loggedout", this.userLoggedOut.bind(this));
    this.init();
  }
  init(){
    let self = this;
    return new Promise(function(resolve, reject){
      self.database.getDb().then((db:any)=>{
        self.productsDb = db.ref('/database/companies/'+self.authService.currentUser.company+'/products');
        console.log('/database/companies/'+self.authService.currentUser.company+'/products');
        self.productsDb.on("value", self.productsUpdated, self);
        resolve();
      })
      .catch((error)=>{
        reject(error);
      });
    });
  }
  userLoggedOut(){
    console.log("product service: loggedout");
    if (this.productsDb){
      this.productsDb.off("value");
      this.products = [];
      this.events.publish("products:updated");
    }
  }
  productsUpdated(snapshot){
    // this.products = [];
    var data = snapshot.val();
    if (data){
        this.products = data;
        // for (var key in this.rawProducts){
        //   this.products.push(this.rawProducts[key]);
        // }
    }
    console.log("products list generated");
    this.events.publish("products:updated");
  }
  deleteProduct(product){
    let self = this;
    return new Promise(function(resolve, reject){
      self.productsDb.child('/'+product.uid).set(null)
        .then(()=>{
          resolve(product);
        })
        .catch((error)=>{
          reject(error);
        });
    });
    
  }
  createProduct(){
    return this.productsDb.push();
  }
  updateProducts(products){
    let self = this;
      return new Promise(function(resolve, reject){
        if (products["OLD"]){
          for(var key of Object.keys(products["OLD"])){
            var product:any = products["OLD"][key];
            self.productsDb.child('/'+product.uid+"/name").set(product.name);              
            self.productsDb.child('/'+product.uid+"/description").set(product.description);              
            self.productsDb.child('/'+product.uid+"/tax").set(product.tax);              
            self.productsDb.child('/'+product.uid+"/price_tax_inclusive").set(product.price_tax_inclusive);              
            self.productsDb.child('/'+product.uid+"/prices").set(product.prices);              
          }                    
        }
        if (products["NEW"]){
          for(var product of products["NEW"]){
            self.productsDb.child('/'+product.uid).set(product);              
          } 
          resolve();                   
        }
      });
  }
  updateProduct(product){
    let self = this;
      return new Promise(function(resolve, reject){
        self.productsDb.child('/'+product.uid).set(product)
          .then(()=>{
            resolve(product);
          })
          .catch((error)=>{
            reject(error);
          });
      });
  }
  // Set User photoURL  
  setProductImage(product, image){
    let self = this;
    return new Promise(function(resolve, reject){
      // This can be downloaded directly:
      if (image){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(event) {
          var blob = xhr.response;
          //now upload it correctly
          self.imageService.uploadBlobImage(blob, "/database/"+self.authService.currentUser.company+"/productimages/"+product.uid, image.type)
            .then((img:any)=>{
              product.image = img.downloadURL;
              self.updateProduct(product)
              image.ref.delete().then(()=>{
                resolve();              
              }).catch((error)=>{
                console.log(error);
                reject(error);
              })
            });
        };
        xhr.open('GET', image.downloadURL);
        xhr.send();
      }else{
        resolve("nothing to do");
      }
    })
  }
  downloadProducts(products){
    var data = "";
    this.skuCount = 0;
    for (var key in products){
      if (products[key].prices){
        if (products[key].prices.length>this.skuCount) this.skuCount = products[key].prices.length;      
      }
    }
    var header = '"ID","Name","Description","Tax","Tax_Inclusive"';
    for (var i=0; i<this.skuCount; i++){
      header += ',"Sku_'+i+'","Price_'+i+'","Stock_'+i+'","Opening_Stock_'+i+'","Opening_Date_'+i+'"';
    }
    data += header +"\n";
    for(var key in products){
      var line = '"ID:'+key+'",';
      line += '"'+products[key].name+'","'+products[key].description+'","'+products[key].tax+'","'+products[key].price_tax_inclusive+'"';
      for (var j=0; j<this.skuCount; j++){
        if (products[key].prices){
          if (products[key].prices[j]){
            line += ',"'+products[key].prices[j].sku;
            line += '","'+products[key].prices[j].price;
            line += '","'+products[key].prices[j].stock;
            line += '","'+products[key].prices[j].opening_stock;
            line += '","'+products[key].prices[j].opening_stock_date+'"';
          }
          else
            line += ',,,,';
        }
      }
      data += line +"\n";
    }
    return data;
  }
  uploadProducts(data:any, products:any):any{
    if (data.length>1){
      var header = data[0].split("\t");
      if ((header.length-5) % 5 ==0 ){
        var skus = (header.length - 5) / 5;
        var uploadedProducts = {"OLD": {}, "NEW": []};
        for (var i=1; i<data.length; i++){
          var errors = {};
          var modified = false;
          var product = data[i].split("\t");
          var ID = product[0].substring(3);
          var oldProduct = this.products[ID];
          if (oldProduct == undefined) oldProduct = {prices:[]};
          if (!oldProduct.prices) oldProduct.prices = [];
          oldProduct.uid = ID;
          if (product[1].length<=0) errors['name'] = "Name cannot be blank";
          oldProduct.name_new = product[1];
          oldProduct.description_new = product[2];
          oldProduct.tax_new = product[3];
          if (isNaN(product[3])) errors["tax"] = "Tax must be a number";
          else {
            if (product[3].length==0) product[3] = this.settingsService.getCompanySetting("tax");
            if (product[3]<0 || products[3]>100) errors["tax"] = "Tax must be between 0.00 & 100.00";
          }
          oldProduct.price_tax_inclusive_new = product[4].toLowerCase() == "true" || product[4].toLowerCase() == "0" ;
          modified = modified || (
            oldProduct.name != oldProduct.name_new || 
            oldProduct.description != oldProduct.description_new || 
            oldProduct.tax != oldProduct.tax_new || 
            oldProduct.price_tax_inclusive != oldProduct.price_tax_inclusive_new);
          
          for(var j=0; j<skus; j++){
            //if old exists and new is blank -- delete
            //if old does not exist & new is not blnak - validate
            var priceErrors = {};
            if (!oldProduct.prices[j] && product[5+j*5].length > 0 ){
              //new price added
              oldProduct.prices[j] = {
                "sku":"", 
                "price":"",
                "stock":"",
                "opening_stock":"",
                "opening_stock_date": "",
              }
            }
            if (product[5+j*5+1].length==0) product[5+j*5+1] = "0.00";
            if (product[5+j*5+2].length==0) product[5+j*5+2] = "0";
            if (product[5+j*5+3].length==0) product[5+j*5+3] = "0";
            if (product[5+j*5+4].length==0) product[5+j*5+4] = moment().format("DD/MM/YYYY");
            if (oldProduct.prices[j] && product[5+j*5].length > 0){
              if (product[5+j*5].length<=0) priceErrors["sku"]= "No SKU Found";
              if (isNaN(product[5+j*5+1]))priceErrors ["price"]="Price must be a number";
              if (isNaN(product[5+j*5+2])) priceErrors ["stock"]="Stock must be a number";
              else if (product[5+j*5+2]<0) priceErrors["stock"] = "Stock must be 0 or more";
              if (isNaN(product[5+j*5+3])) priceErrors ["opening_stock"]="Opening Stock must be a number";
              else if (product[5+j*5+3]<0) priceErrors["opening_stock"] = "Opening Stock must be 0 or more";
              if (product[5+j*5+4].length<=0) priceErrors ["opening_stock+date"]="Opening Stock date required";
              else if (!moment(product[5+j*5+4], "DD/MM/YYYY", true).isValid) priceErrors["opening_stock_date"] = "Opening Stock date must valid";
              oldProduct.prices[j].sku_new = product[5+j*5];
              oldProduct.prices[j].price_new =  priceErrors["Price_"+j] ? product[5+j*5+1] : parseFloat(product[5+j*5+1]).toFixed(2);
              oldProduct.prices[j].stock_new =  priceErrors["Stock_"+j] ? product[5+j*5+2] : product[5+j*5+2]
              oldProduct.prices[j].opening_stock_new =  priceErrors["Opeining_Stock_"+j] ? product[5+j*5+3] : product[5+j*5+3];
              oldProduct.prices[j].opening_stock_date_new =  priceErrors["Opening_Stock_Date_"+j] ? product[5+j*5+4] : product[5+j*5+4];              
            }
            if (oldProduct.prices[j]){
              modified = modified || (
                oldProduct.prices[j].sku != oldProduct.prices[j].sku_new ||
                oldProduct.prices[j].price != oldProduct.prices[j].price_new ||
                oldProduct.prices[j].stock != oldProduct.prices[j].stock_new ||
                oldProduct.prices[j].opening_stock != oldProduct.prices[j].opening_stock_new ||
                oldProduct.prices[j].opening_stock_date != oldProduct.prices[j].opening_stock_date_new);
              if (Object.keys(priceErrors).length>0) {
                errors["Price_"+j] = priceErrors;
                oldProduct.prices[j].errors = priceErrors;
              }
            }
          }
          if (oldProduct.prices.length==0) errors["Prices"] = "No Price found.";

          oldProduct.modified = modified;
          if (Object.keys(errors).length>0) oldProduct.errors = errors;
          if (ID.length<=0) {
            uploadedProducts["NEW"].push(oldProduct);
          } else{
            uploadedProducts["OLD"][ID] = oldProduct;        
          }
        }
        console.log(uploadedProducts);
        return {uploadedProducts: uploadedProducts};
      }else{
        return {errors: ["SKU columns mismatch ... Please download again"]};
      }
    }else{
        return {errors: ["No data found ... Please update again"]};
    }
  }
}
