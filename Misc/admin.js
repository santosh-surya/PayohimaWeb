#!/usr/bin/env node
const program = require('commander');
program
  .version('0.0.1')
  .description('Payohima utility to manipulate Firebase data')
  
program
  .command('upload-image <imageFile>')
  .description('upload a new image for an article')
  .option('-k, --key [unique key]','Unique key of the existing image to replace', null)
  .action(function(imageFile, options ){

      console.log(imageFile, options.url);
  });

program
  .command('upload-article <title> <body>')
  .description('upload an article')
  .option('-u, --url [location url]','Location of the existing article to replace')
  .option('-i, --image [image file]','Image file to upload with article ')
  .action(function(imageFile, firebaseKey, command ){
      console.log(imageFile, firebaseKey, command.force);
  })

program.on('--help', function(){
  console.log('Commands');
  console.log('    upload-image /abc/xxx/yyy.png -u http://firebase.com/xxxxx');
  console.log('    upload-article "title of article" "body of article" -u http://firebase.com/yyyyy -i /abc/xxxx/yyy.png');
  console.log('');
});
  
program
  .command('')
  .action(function(env){
    console.log('deploying "%s"', env);
  });

program.parse(process.argv); // notice that we have to parse in a new statement.

var firebase = require('firebase');
var gcloud = require('gcloud');

var config = {
    apiKey: "AIzaSyAnVF75YKMd-XKFd275jKGNKSEuaarsLqQ",
    authDomain: "payohima-10d68.firebaseapp.com",
    databaseURL: "https://payohima-10d68.firebaseio.com",
    storageBucket: "payohima-10d68.appspot.com",
    messagingSenderId: "921700995648"
};
firebase.initializeApp(config);

const images = firebase.storage().ref('images');
const path = require('path');

function uploadImage (file, key){
    var filename = path.basename(file);
    console.log('   File: ', filename);

//     if (key){
//         //check to see if the file exists
//         this.images.child(key).child('image.png')
//             .putString(guestPicture, 'base64', {contentType: 'image/png'})
//             .then((savedPicture) => {
//                 this.eventList.child(eventId).child('guestList').child(newGuest.key)
//                     .child('profilePicture')
//                 .set(savedPicture.downloadURL);
//             });        
//             }
//         images.orderByKey().equalTo(key).once("value", function(snapshot){
//             if (snapshot.val() === null){
//                 console.error('Image not found');
//                 process.exit(-1);
//             }else{
//                 //found
//                 images.child(key)
//                     .putString(base64_encode(file), 'base64', {contentType: 'image/png'})
//   .then((savedPicture) => {
                
//                 .set({image: base64_encode(file)}).then(()=>{
//                     console.log("Image updated");
//                     process.exit(0);
//                 });                
//                 process.exit(0);
//             }
//         });

//     }else{

//     }
}

var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

// convert image to base64 encoded string
var base64str = base64_encode('kitten.jpg');
console.log(base64str);
// convert base64 string back to image 
base64_decode(base64str, 'copy.jpg');