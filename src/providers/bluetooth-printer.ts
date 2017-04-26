import { Platform, Events } from 'ionic-angular';
import { Bluetooth } from './bluetooth';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Printer provider.
*/
@Injectable()
export class BlueToothPrinter extends Bluetooth {

  constructor(public http: Http, public platform: Platform, public events: Events) {
    super(http, platform, events);
  }
  initialise(){
    return this.write('\x1b\x40');
  }
  setEmphasizedOn(){
    return this.write('\x1b\x45\x01');
  }
  setEmphasizedOff(){
    return this.write('\x1b\x45\x00');
  }
  setEscEmphasizedOn(){
    return this.write('\x1b\x21\x08');
  }
  setEscEmphasizedOff(){
    return this.write('\x1b\x21\x00');
  }
  setEscDoubleHeightOn(){
    return this.write('\x1b\x21\x10');
  }
  setEscDoubleHeightOff(){
    return this.write('\x1b\x21\x00');
  }
  setEscDoubleWidthOn(){
    return this.write('\x1b\x21\x20');
  }
  setEscDoubleWidthOff(){
    return this.write('\x1b\x21\x00');
  }
  setEscUnderlineOn(){
    return this.write('\x1b\x21\x80');
  }
  setEscUnderlineOff(){
    return this.write('\x1b\x21\x00');
  }
  setEscFontA(){
    return this.write('\x1b\x21\x00');
  }
  setEscFontB(){
    return this.write('\x1b\x21\x01');
  }
  setDoubleStrikeOn(){
    return this.write('\x1b\x47\x01');
  }
  setDoubleStrikeOff(){
    return this.write('\x1b\x47\x00');
  }
  setFontA(){
    return this.write('\x1b\x4d\x00');
  }
  setFontB(){
    return this.write('\x1b\x4d\x01');
  }
  setJustificationLeft(){
    return this.write('\x1b\x61\x00');
  }
  setJustificationRight(){
    return this.write('\x1b\x61\x02');
  }
  setJustificationCentre(){
    return this.write('\x1b\x61\x01');    
  }
  feedLines(n){
    var a = this.ascii_to_hexa('\x1b\x64');
    a.push(n);
    return this.write(a);
  }
  reverseFeedLines(n){
    var a = this.ascii_to_hexa('\x1b\x65');
    a.push(n);
    return this.write(a);
  }
  drawerPulse(){
    var a = this.ascii_to_hexa('\x1b\x70');
    a.push(0);a.push(100);a.push(100); // connector pin 2
    a.push(this.ascii_to_hexa('\x1b\x70'));
    a.push(1);a.push(100);a.push(100); // connector pin 5
    return this.write(a);    
  }
  setColor1(){
    return this.write('\x1b\x72\x00');    
  }
  setColor2(){
    return this.write('\x1b\x72\x01');    
  }
  setCharacterCode(n){
    var a = this.ascii_to_hexa('\x1b\x70');
    a.push(n);
    return this.write(a);    
  }
  setReversePrintingOn(){
    return this.write('\x1d\x42\x01');    
  }
  setReversePriningOff(){
    return this.write('\x1d\x42\x00');    
  }
  cutPaperFull(){ 
    return this.write('\x1d\x56\x00'); //EPSON Function A
  }
  cutPaperPartial(){
    return this.write('\x1d\x56\x01'); //EPSON Function A
  }
  cutMovePaperFull(n){ 
    var a = this.ascii_to_hexa('\x1d\x56'); //EPSON Function B
    a.push(65);a.push(n);
    return this.write(a);    
  }
  cutMovePaperPartial(n){
    var a = this.ascii_to_hexa('\x1d\x56'); //EPSON Function B
    a.push(66);a.push(n);
    return this.write(a);    
  }  
  //height in dots
  setBarcodeHeight(n){
    var a = this.ascii_to_hexa('\x1d'); //EPSON Function B
    a.push(68);a.push(n);
    return this.write(a);    
  }
  printBarcode(system:number, data){
    var a = this.ascii_to_hexa('\x1d\x6b'); //use different systems for barcode printing
    a.push(system);
    a.push(this.ascii_to_hexa(data));
    a.push('\x00');
    return this.write(a);
  }
  //errorCorrectionLevel L - 0, M - 1, Q - 2, H - 3
  //size 1, 2, 3, 4, 5, 10, 16
  //model 1, 2
  printQRCode(data:string, errorCorrectionLevel, size, model){
    let self = this;
    //set model 
    var a = this.ascii_to_hexa('\x1d\x28\x6B\x04\x00\x31\x41');
    a.push(model);
    this.write(a).then(()=>{
      //set size
      a = self.ascii_to_hexa('\x1d\x28\x6B\x03\x00\x31\x43');
      a.push(size);
      self.write(a).then(()=>{
        //set ec level
        a = self.ascii_to_hexa('\x1d\x28\x6B\x03\x00\x31\x45');
        a.push(errorCorrectionLevel);
        self.write(a).then(()=>{
          //send data up to 7000 bytes
          a = self.ascii_to_hexa('\x1d\x28\x6B');
          var s = data.length+3;
          var pL = s % 256;
          var pH = Math.trunc(s/256);
          a.push(pL);
          a.push(pH);
          a.push(self.ascii_to_hexa('\x31\x50\x30'));
          a.push(self.ascii_to_hexa(data));
          self.write(a).then(()=>{
            console.log("QR printed");
          })
        }) 
      })        
    })
    
  }
  printLine(line){
    var a = this.ascii_to_hexa(line);
    a.push('\x0a\x0d');
    return this.write(a);
  }
  print(data){
    return this.write(this.ascii_to_hexa(data));
  }
  
  ascii_to_hexa(str){
    var arr = [];
    for (var n = 0, l = str.length; n < l; n ++) 
    {
        arr.push(Number(str.charCodeAt(n)));
    }
    console.log(arr);
    return arr;
  }

}
