import { AuthService } from './../../providers/auth-service';
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
  public tab:string = "reports";
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public changeDetectorRef: ChangeDetectorRef, 
    public authService: AuthService) {
    
  }

  ionViewDidLoad() {
  }
  tabChanged($event){
    console.log($event);
    this.tab = $event.value;
    this.changeDetectorRef.detectChanges();    
  }

}

