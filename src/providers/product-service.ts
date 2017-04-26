import { Events } from 'ionic-angular';
import { Database } from './database';
import { AuthService } from './auth-service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ProductService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductService {
  public products: any = [];
  constructor(public http: Http) {
    console.log('Hello ProductService Provider');
  }

}
