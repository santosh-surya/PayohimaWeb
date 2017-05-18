import { ProductPricePage } from './../pages/products/product-price/product-price';
import { UploadProductPage } from './../pages/products/upload-product/upload-product';
import { ProductEditPage } from './../pages/products/product-edit/product-edit';
import { SettingsPage } from './../pages/settings/settings';
import { ProductService } from './../providers/product-service';
import { ProductsManagementPage } from './../pages/products/products-management/products-management';
import { EditRolePage } from './../pages/profile/edit-role/edit-role';
import { UserEditPage } from './../pages/profile/user-edit/user-edit';
import { UserService } from './../providers/user-service';
import { SettingsService } from './../providers/settings-service';
import { AccountService } from './../providers/account-service';
import { TicketService } from './../providers/ticket-service';
import { CashRegisterService } from './../providers/cash-register-service';
import { BlueToothPrinter } from './../providers/bluetooth-printer';
import { StorageService } from './../providers/storage-service';
import { LocationService } from './../providers/location-service';
import { UploadButtonComponent } from './../components/upload-button/upload-button';
import { CashRegisterPage } from './../pages/cash-register/cash-register';
import { MobileAppPage } from './../pages/mobile-app/mobile-app';
import { ReportsPage } from './../pages/reports/reports';
import { SplashPage } from './../pages/splash/splash';
import { AuthService } from './../providers/auth-service';
import { SignupPage } from './../pages/profile/signup/signup';
import { ResetPasswordPage } from './../pages/profile/resetpassword/resetpassword';
import { LoginPage } from './../pages/profile/login/login';
import { UsersPage } from './../pages/profile/users/users';
import { OrdersPage } from './../pages/orders/orders';
import { TransactionsPage } from './../pages/transactions/transactions';
import { AccountPage } from './../pages/profile/account/account';
import { DashboardPage } from './../pages/dashboard/dashboard';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Database } from './../providers/database';
import { Storage } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    SettingsPage,
    SplashPage,
    DashboardPage,
    AccountPage,
    ProductsManagementPage,
    ProductEditPage,
    ProductPricePage,
    UploadProductPage,
    TransactionsPage,
    OrdersPage,
    LoginPage,
    ResetPasswordPage,
    SignupPage,
    UsersPage,
    UserEditPage,
    EditRolePage,
    ReportsPage,
    MobileAppPage,
    CashRegisterPage,
    UploadButtonComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SettingsPage,
    SplashPage,
    DashboardPage,
    AccountPage,
    ProductsManagementPage,
    ProductEditPage,
    ProductPricePage,
    UploadProductPage,
    TransactionsPage,
    OrdersPage,
    LoginPage,
    ResetPasswordPage,
    SignupPage,
    UsersPage,
    UserEditPage,
    EditRolePage,
    ReportsPage,
    MobileAppPage,
    CashRegisterPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    Storage, 
    AuthService, 
    StorageService, 
    Database, 
    BlueToothPrinter,
    CashRegisterService,
    TicketService,
    AccountService,
    SettingsService,
    LocationService,
    ProductService,
    UserService]
})
export class AppModule {}
