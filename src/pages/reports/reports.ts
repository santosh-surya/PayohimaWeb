import { ProductService } from './../../providers/product-service';
import { AuthService } from './../../providers/auth-service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Reports page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html'
})
export class ReportsPage {
  public uploadedProducts: any = {"NEW":[], "OLD":{}};

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public changeDetectorRef: ChangeDetectorRef, 
    public authService: AuthService,
    public productService: ProductService) {
    }

  ionViewDidLoad() {
    var d = 'ID	Name	Description	Tax	 "Tax_Inclusive"	Sku_0	Price_0	Stock_0	Opening_Stock_0	Opening_Date_0	Sku_1	Price_1	Stock_1	Opening_Stock_1	Opening_Date_1	Sku_2	Price_2	Stock_2	Opening_Stock_2	Opening_Date_2\nID:-KipAtfGUUTD_rD0lrYn	Dark Chocolate	This is it	10	TRUE	100ml	10	0	0	13/05/2017	250ml	125	0	0	12/05/2017	500ml	230	0	0	16/05/2017\nID:-KkFbz9g6MVu4dWRiGEC	Mango Gelato		10	TRUE	100ml	60	0	0	15/05/2017										\n	Yogurt Strawberry Gelato				100ml	60	0	0	15/05/2017										';
    this.uploadedProducts = this.productService.uploadProducts(d.split("\n"), this.productService.products).uploadedProducts;
    console.log(this.uploadedProducts);
    this.changeDetectorRef.detectChanges();
  }
  oldProductKeys(){
    return Object.keys(this.uploadedProducts["OLD"]);
  }

}
