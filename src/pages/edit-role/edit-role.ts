import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from './../../providers/location-service';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the EditRole page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-edit-role',
  templateUrl: 'edit-role.html'
})
export class EditRolePage {
  role: any;
  roleForm: FormGroup;
  roleMaster: any = ["super admin", "manager", "user"];
  constructor(public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    private locationService: LocationService,
    private viewCtrl: ViewController,
    public navParams: NavParams) {
    this.role = this.navParams.get("role");
    if (!this.role){
      //create empty form    
      this.roleForm = formBuilder.group({
        location: ['', Validators.compose([Validators.required])],
        role: ['', Validators.compose([Validators.required])]
      });
    }else{
      this.roleForm = formBuilder.group({
        location: [this.role.location, Validators.compose([Validators.required])],
        role: [this.role.role, Validators.compose([Validators.required])]
      });
    }
    console.log(this.role);
  }
  getTitle(){
    if (this.role){
      return "Edit Role";
    }else{
      return "Add Role";
    }
  }
  isSelected(a, b){
    return (a == b)
  }
  ionViewDidLoad() {
    console.log('EditRolePage');
  }
  save(){
    this.viewCtrl.dismiss(this.roleForm.value);
  }
  cancel(){
    this.viewCtrl.dismiss(null);
  }
}
