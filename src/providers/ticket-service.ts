import { Database } from './database';
import { AuthService } from './auth-service';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the TicketService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TicketService {

  public tickets: any = [];
  // ticket = {
  //   cashier: 'xlxlslsi2292929',
  //   items: [ 
  //     {
  //       name: "product.name",
  //       short_description: "product.short_description",
  //       image: "product.image",
  //       unit: "unit",
  //       quantity: 2,
  //       price: "product[unit]",
  //       discounts: [
  //         { name: "20%", type: "%", discount: 20}, // 20%
  //         { name: "$20", type: "$", discount: 20}, // 20$ 
  //       ],
  //       total: 222
  //     },
  //   ],
  //   total: 1000,
  //   discount: 88
  // }
  
  constructor(
    public http: Http, 
    private events: Events, 
    private authService: AuthService,
    private database: Database,
    private storage: Storage) {
    console.log('TicketService Provider');
  }
  createTicket(){
    //cashier based
    this.tickets.push({
      cashier: this.authService.currentUser.uid,
      items: [],
      total: 0.00,
      discount: 0.00
    })
  }
  addToTicket(ticketIndex: number, product:any, unit:string, quantity:number=1, discounts:Array<any>=[]){
    //find if product exists
    var found = false;
    for (let i=0; i<this.tickets[ticketIndex].items.length; i++){
      if (this.tickets[ticketIndex][i].items[i].name == product.name && this.tickets[ticketIndex].items[i].unit == unit){
        this.tickets[ticketIndex].items[i].quantity = Number.parseInt(this.tickets[ticketIndex].items[i].quantity) + quantity;
        found = true;
      }
    }
    if (!found){
      this.tickets[ticketIndex].items.push({
        name: product.name,
        short_description: product.short_description,
        image: product.image,
        unit: unit,
        quantity: quantity,
        price: product[unit],
        discount: 0,
        discounts: discounts
      });
    }
    // console.log(JSON.stringify(this.cart));
    this.totalTicketPrice(ticketIndex);
    return this.tickets[ticketIndex];
  }
  plusToTicket(ticketIndex:number, itemIndex:number, quantity:number){
    if (itemIndex<this.tickets[ticketIndex].items.length){
      this.tickets[ticketIndex].items[itemIndex].quantity += quantity;
    }
    this.totalTicketPrice(ticketIndex);
    return this.tickets[ticketIndex];
  }
  minusFromTicket(ticketIndex, itemIndex, quantity){
    var remove = false;
    if (itemIndex<this.tickets[ticketIndex].items.length){
      this.tickets[ticketIndex].items[itemIndex].quantity -= quantity;
      if (this.tickets[ticketIndex].items[itemIndex].quantity<=0){
        remove = true;
      }
    }
    if (remove){
      this.tickets[ticketIndex].items.splice(itemIndex, 1);
    }
    this.totalTicketPrice(ticketIndex);
    return this.tickets[ticketIndex];    
  }
  addDiscountToTicketItem(ticketIndex, itemIndex, discount){
    //check if this discount already exists on the item
    var found = false;
    for (let j=0; j<this.tickets[ticketIndex].items[itemIndex].discounts.length; j++){
      if (this.tickets[ticketIndex].items[itemIndex].discounts[j].name == discount.name) found = true;
    }
    if (!found){
      this.tickets[ticketIndex].items[itemIndex].discounts.push(discount);
    }
    this.totalTicketPrice(ticketIndex);
    return this.tickets[ticketIndex];
  }
  removeDiscountFromTicketItem(ticketIndex, itemIndex, discount){
    //check if this discount already exists on the item
    for (let j=0; j<this.tickets[ticketIndex].items[itemIndex].discounts.length; j++){
      if (this.tickets[ticketIndex].items[itemIndex].discounts[j].name == discount.name){
        this.tickets[ticketIndex].items[itemIndex].discounts.splice(j,1);
        break;
      }
    } 
    this.totalTicketPrice(ticketIndex);
    return this.tickets[ticketIndex];
  }
  //adding discount to ticket adds it to all items
  addDiscountToTicket(ticketIndex, discount){
    for (let i=0; i<this.tickets[ticketIndex].items.length; i++){
      //check if this discount already exists on the item
      var found = false;
      for (let j=0; j<this.tickets[ticketIndex].items[i].discounts.length; j++){
        if (this.tickets[ticketIndex].items[i].discounts[j].name == discount.name) found = true;
      }
      if (!found){
        this.tickets[ticketIndex].items[i].discounts.push(discount);
      }
    }
    this.totalTicketPrice(ticketIndex);
    return this.tickets[ticketIndex];
  }
  removeDiscountFromTicket(ticketIndex, discount){
    //remvoes from all items
    for (let i=0; i<this.tickets[ticketIndex].items.length; i++){
      //check if this discount already exists on the item
      for (let j=0; j<this.tickets[ticketIndex].items[i].discounts.length; j++){
        if (this.tickets[ticketIndex].items[i].discounts[j].name == discount.name){
          this.tickets[ticketIndex].items[i].discounts.splice(j, 1);
          break;
        }
      }
    }
    this.totalTicketPrice(ticketIndex);
    return this.tickets[ticketIndex];
  }
  removeFromTicket(ticketIndex, index){
    if (index<=this.tickets[ticketIndex].length-1) this.tickets[ticketIndex].splice(index, 1);
    this.totalTicketPrice(ticketIndex);
    return this.tickets[ticketIndex];
  }
  clearTicket(ticketIndex){
    this.tickets[ticketIndex] = [];
    this.totalTicketPrice(ticketIndex);
  }
  totalTicketPrice(ticketIndex){
    var total = 0;
    var totalDiscount = 0
    for (let i=0; i<this.tickets[ticketIndex].items.length; i++){
      var itemTotal = 0;
      var itemDiscount = 0;
      itemTotal = Number.parseInt(this.tickets[ticketIndex].items[i].quantity) * Number.parseFloat(this.tickets[ticketIndex].items[i].price);
      for (let j=0; j<this.tickets[ticketIndex].items[i].discounts.length; j++){
        if (this.tickets[ticketIndex].items[i].discounts[j].type == '%'){
          itemDiscount = itemDiscount + itemTotal * Number.parseFloat(this.tickets[ticketIndex].items[i].discounts[j].value)/100;
        }else{
          itemDiscount = itemDiscount + Number.parseFloat(this.tickets[ticketIndex].items[i].discounts[j].value);
        }
      }
      this.tickets[ticketIndex].items[i].total = itemTotal;
      this.tickets[ticketIndex].items[i].discount = itemDiscount;
      totalDiscount += itemDiscount;
      total += itemTotal;
    }
    this.tickets[ticketIndex].discount = totalDiscount;
    this.tickets[ticketIndex].total = total;
    this.events.publish("ticket:updated", ticketIndex, this.tickets[ticketIndex]);
    this.storage.set('tickets', this.tickets);
  }
  //update the tickets database
  updateTicketsDatabase(){

  }
}
