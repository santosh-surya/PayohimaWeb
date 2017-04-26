import { ProductEditPage } from './../product-edit/product-edit';
import { AuthService } from './../../providers/auth-service';
import { ProductService } from './../../providers/product-service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Events, ViewController } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams,  
    private productService: ProductService,
    private authService: AuthService,
    private events: Events,
    private changeDetectorRef: ChangeDetectorRef,
    private viewCtrl: ViewController) {
      this.events.subscribe("products:updated", this.productsUpdated.bind(this));

    }

  ionViewDidEnter() {
    this.products = this.productService.products;
  }
  
  productsUpdated(){
    try {
      this.changeDetectorRef.detectChanges();
      
    } catch (error) {
      
    }
  }
  filterProductss(ev){
    // set val to the value of the searchbar
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.products = this.products.filter((product) => {
        return (product.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  productSelected(product){
    console.log(product);
    this.navCtrl.push(ProductEditPage, {product: product});
  }
  createProduct(){
    this.navCtrl.push(ProductEditPage, {product: null});
  }
}
