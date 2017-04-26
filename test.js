// var a = {name: 'ssss', data:'ddddd'};
// console.log(a.hello == undefined);

// var firebase = require('firebase');
var crypto = require('crypto');
var salt = "Adw2bJoxJl7q2jGtvbzL31pjyDfKOt4jlrmURw33vfSZggT4jF1e56qRBgWoBcyfUQ/ORflSSpzgTu9C5K0h79UoBySPpNekgjOeKlNK27RIIYk2AL+wdftq57ExUs60nb5RUliEsh6ch8UcarGwhXc/GObAjuzwyH6HcSi4klc=";
// var salt = crypto.randomBytes(128).toString('base64');

// var config = {
// apiKey: "AIzaSyAnVF75YKMd-XKFd275jKGNKSEuaarsLqQ",
// authDomain: "payohima-10d68.firebaseapp.com",
// databaseURL: "https://payohima-10d68.firebaseio.com",
// storageBucket: "payohima-10d68.appspot.com",
// messagingSenderId: "921700995648"
// };
// var fireApp = firebase.initializeApp(config);
// var dbInstance = fireApp.database();

// var p = generatePasswordHash("password", salt);
// dbInstance.ref("/database/users").orderByChild("password").equalTo("anita@payohima.com"+p).on("value", (snapshot)=>{
//     for (var d in snapshot.val()){
//         console.log(snapshot.val()[d]);
//     }
// })

//   var settingsDb = dbInstance.ref("/database/settings/salt");
//   settingsDb.once("value", (snapshot)=>{
//       console.log(snapshot.val());
//       var p = generatePasswordHash("password", snapshot.val());
//       console.log(p);
//   });
//   settingsDb.child("salt").set(salt);


// var usersDb = dbInstance.ref('/database/users/');
// usersDb.orderByChild("company").equalTo('-KdC0F9unUNvUiVSwDcw').on("value", function(snapshot){
//     var data = snapshot.val();
//     var users = [];
    
//     for (var key in data){
//         data[key].uid = key;
//         users.push(data[key]);
//     }
//     console.log(users);
// });

var p = generatePasswordHash("password", salt);
console.log(p);

// usersDb.once("value", function(child){
//     for (var d in child.val()){
//         console.log (d);
//         console.log(child.val()[d]);
//         var a = child.val()[d];
//         a.password = a.email+p;
//         usersDb.child('/'+d).set(a);
//     }
// });

function generatePasswordHash(password, salt=null){
    var key = crypto.pbkdf2Sync('password', salt, 10, 20, 'sha512');
    return key.toString("base64");    
}

function verifyPassword(password, passwordHash){
    var p = generatePasswordHash(password, salt);
    if (p == passwordHash)
        console.log('done');
    else    
        console.log('oops');
}
