import { TransactionsPage } from './../transactions/transactions';
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Dashboard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  public pet:any = "kittens";

  constructor(public navCtrl: NavController, public navParams: NavParams, public changeDetectorRef: ChangeDetectorRef) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }
  tabChanged($event){
    console.log($event);
    this.pet = $event.value;
    this.changeDetectorRef.detectChanges();
    
  }
}

