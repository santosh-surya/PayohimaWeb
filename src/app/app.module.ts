import { ProductEditPage } from './../pages/product-edit/product-edit';
import { ProductService } from './../providers/product-service';
import { ProductsManagementPage } from './../pages/products-management/products-management';
import { EditRolePage } from './../pages/edit-role/edit-role';
import { UserEditPage } from './../pages/user-edit/user-edit';
import { UserService } from './../providers/user-service';
import { SettingsService } from './../providers/settings-service';
import { AccountService } from './../providers/account-service';
import { TicketService } from './../providers/ticket-service';
import { CashRegisterService } from './../providers/cash-register-service';
import { BlueToothPrinter } from './../providers/bluetooth-printer';
import { ImageService } from './../providers/image-service';
import { LocationService } from './../providers/location-service';
import { UploadButtonComponent } from './../components/upload-button/upload-button';
import { CashRegisterPage } from './../pages/cash-register/cash-register';
import { MobileAppPage } from './../pages/mobile-app/mobile-app';
import { ReportsPage } from './../pages/reports/reports';
import { SplashPage } from './../pages/splash/splash';
import { AuthService } from './../providers/auth-service';
import { SignupPage } from './../pages/signup/signup';
import { ResetPasswordPage } from './../pages/resetpassword/resetpassword';
import { LoginPage } from './../pages/login/login';
import { UsersPage } from './../pages/users/users';
import { OrdersPage } from './../pages/orders/orders';
import { TransactionsPage } from './../pages/transactions/transactions';
import { AccountPage } from './../pages/account/account';
import { DashboardPage } from './../pages/dashboard/dashboard';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Database } from './../providers/database';
import { Storage } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    SplashPage,
    DashboardPage,
    AccountPage,
    ProductsManagementPage,
    ProductEditPage,
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
    SplashPage,
    DashboardPage,
    AccountPage,
    ProductsManagementPage,
    ProductEditPage,
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
    ImageService, 
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
