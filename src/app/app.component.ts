import { SettingsService } from './../providers/settings-service';
import { LocationService } from './../providers/location-service';
import { UserService } from './../providers/user-service';
import { ResetPasswordPage } from './../pages/resetpassword/resetpassword';
import { ReportsPage } from './../pages/reports/reports';
import { MobileAppPage } from './../pages/mobile-app/mobile-app';
import { CashRegisterPage } from './../pages/cash-register/cash-register';
import { SplashPage } from './../pages/splash/splash';
import { Database } from './../providers/database';
import { AuthService } from './../providers/auth-service';
import { LoginPage } from './../pages/login/login';
import { UsersPage } from './../pages/users/users';
import { OrdersPage } from './../pages/orders/orders';
import { ItemsPage } from './../pages/items/items';
import { TransactionsPage } from './../pages/transactions/transactions';
import { AccountPage } from './../pages/account/account';
import { DashboardPage } from './../pages/dashboard/dashboard';
import { Component, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Nav, Platform, MenuController, Events, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('accountImage') accountImage: any;
  rootPage: any = SplashPage;
  zone: NgZone;
  photoURL: any;

  pages: Array<{title: string, component: any, icon: string}>=[];

  constructor(
    public platform: Platform,
    public menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private userService: UserService,
    private settingsService: SettingsService,
    private locationSerivce: LocationService,
    private database: Database,
    private events: Events,
    public cd: ChangeDetectorRef
    ) {
      this.database.init().then(()=>{
        this.initializeApp();
      })
  }
  userLoggedin(){
    console.log("Just Logged In");
    this.photoURL = this.authService.currentUser.photoURL + '?' + new Date().getTime();
    this.processRole();
    this.nav.setRoot(DashboardPage); 
  }
  
  userLoggedOut(){
      console.log("Logged Out");
      if (this.nav.root != LoginPage){
        this.nav.setRoot(LoginPage);
      }
  }
  updateUI(){
    this.photoURL = this.authService.currentUser.photoURL + '?' + new Date().getTime();
    this.cd.detectChanges();
  }
  processRole(){
    var isSuper  = false;
    var isManager = false;
    for (let i=0; i<this.authService.currentUser.roles.length; i++){
      if (this.authService.currentUser.roles[i].role == 'super admin'){
        isSuper = true;
        break;
      } else if (this.authService.currentUser.roles[i].role == 'manager'){
        isManager = true;
        break;
      }
    }
    if (isSuper){
      this.pages = [
        { title: 'Dashboard', component: DashboardPage, icon:"home" },
        { title: 'Cash Register', component: CashRegisterPage, icon:"cash" },
        { title: 'Transactions', component: TransactionsPage, icon: "cash" },
        { title: 'Orders Management', component: OrdersPage, icon: "basket" },
        { title: 'Company Settings', component: ItemsPage, icon: "settings" },
        { title: 'Items Management', component: ItemsPage, icon: "pricetags" },
        { title: 'Users Management', component: UsersPage, icon: "people" },
        { title: 'Reports', component: ReportsPage, icon: "document" },
        { title: 'Mobile Homescreen', component: MobileAppPage, icon: "document" },
        { title: 'Your Account', component: AccountPage, icon: "person" },
      ];    
    }else if (isManager){
      this.pages = [
        { title: 'Your Account', component: AccountPage, icon: "person" },
        { title: 'Cash Register', component: CashRegisterPage, icon:"cash" },
        { title: 'Dashboard', component: DashboardPage, icon:"home" },
        { title: 'Items Management', component: ItemsPage, icon: "pricetags" },
        { title: 'Transactions Management', component: TransactionsPage, icon: "cash" },
        { title: 'Orders Management', component: OrdersPage, icon: "basket" },
        { title: 'Reports', component: ReportsPage, icon: "document" },
        { title: 'Mobile Homescreen', component: MobileAppPage, icon: "document" }
      ];    
    }else{
      this.pages = [
        { title: 'Your Account', component: AccountPage, icon: "person" },
        { title: 'Cash Register', component: CashRegisterPage, icon:"cash" },
        { title: 'Dashboard', component: DashboardPage, icon:"home" },
        { title: 'Items', component: ItemsPage, icon: "pricetags" },
        { title: 'Transactions', component: TransactionsPage, icon: "cash" },
      ];    
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.settingsService.init().then(()=>{
        this.authService.init().then(()=>{
          // this.authService.watchAuthentication();
          Splashscreen.hide();
          this.events.subscribe("login:loggedin", this.userLoggedin.bind(this));
          this.events.subscribe("login:loggedout", this.userLoggedOut.bind(this));
          this.events.subscribe("account:updated", this.updateUI.bind(this));
          this.userLoggedOut(); // start with login page
        });
      })
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    switch (page.component){
      case AccountPage:
      case UsersPage:
        this.nav.push(page.component)
        break;
      default:
      this.nav.setRoot(page.component);        
    }
  }
  resetPassword(){
    this.nav.push(ResetPasswordPage);
  }
  signOut(){
    this.authService.logoutUser();
  }
}
