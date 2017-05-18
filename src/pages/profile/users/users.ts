import { Events, ViewController } from 'ionic-angular';
import { AuthService } from './../../../providers/auth-service';
import { UserEditPage } from './../user-edit/user-edit';
import { UserService } from './../../../providers/user-service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Users page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-users',
  templateUrl: 'users.html'
})
export class UsersPage {
  users: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userService: UserService,
    private authService: AuthService,
    private events: Events,
    private changeDetectorRef: ChangeDetectorRef,
    private viewCtrl: ViewController) {
      this.events.subscribe("users:updated", this.usersUpdated.bind(this));

    }

  ionViewDidEnter() {
    this.users = this.userService.users;
    this.users = this.users.filter((user) => {
        if (this.authService.currentUserUid == user.uid) return false;
        else return true;
      })        
  }
  
  usersUpdated(){
    try {
      this.changeDetectorRef.detectChanges();
      
    } catch (error) {
      
    }
  }
  filterUsers(ev){
    this.users = this.userService.users.filter((user) => {
        if (this.authService.currentUser.uid == user.uid) return false;
        else return true;
      })
    // set val to the value of the searchbar
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.users = this.users.filter((user) => {
        console.log(user.displayName, user.uid, this.authService.currentUserUid);
        return (user.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  userSelected(user){
    console.log(user);
    this.navCtrl.push(UserEditPage, {user: user});
  }
  createUser(){
    this.navCtrl.push(UserEditPage, {user: null});
  }
}
