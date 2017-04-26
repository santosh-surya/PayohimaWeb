
var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyAnVF75YKMd-XKFd275jKGNKSEuaarsLqQ",
    authDomain: "payohima-10d68.firebaseapp.com",
    databaseURL: "https://payohima-10d68.firebaseio.com",
    storageBucket: "payohima-10d68.appspot.com",
    messagingSenderId: "921700995648"
};
firebase.initializeApp(config);

var db = firebase.database();
var users = db.ref('/database/users');
users.orderByChild("company").equalTo("-KdC0F9unUNvUiVSwDcw").once("value", function(snapshot){
    var a = snapshot.val();
    for (var key in a){
        console.log(a[key]);
    }
    console.log(snapshot.val());

})
// // var company = companyDb.push({name: "payohima"});
// // console.log(company.key);
// companyDb.child('/-Kc3X6GMiaxyQqogHIRp/').once("value", function(value){
//     console.log(value.val());
//     process.exit();
// });
// var deviceTokenKey = "xxxxxxxxx";
// var db = firebase.database();
// var deviceTokens = db.ref('/deviceTokens/');
// console.log('DataService Initialised');
// // deviceTokens.orderByKey().equalTo("xxxxxxxxx").once("value", function(snapshot){
// //     if (snapshot.val() === null){
// //         console.log('not found');
// //         deviceTokens.child(deviceTokenKey).set({platform: "testing"}).then(()=>{
// //             console.log("Created record");
// //             process.exit(0);
// //         });
// //     }else{
// //         console.log(snapshot.val()[deviceTokenKey].platform);
// //         console.log(JSON.stringify(snapshot.val()));
// //         process.exit(0);
// //     }
// // });

// deviceTokens.once("child_added", function(snapshot){
//     console.log(snapshot.val());
// });
// // var query = deviceTokens.orderByChild("platform").equalTo("testing").limitToFirst(100);
// // query.on("child_added", function(snapshot, key){
// //     if (snapshot.val() === null){
// //         console.log('not found');
// //         deviceTokens.child(deviceTokenKey).set({platform: "testing"}).then(()=>{
// //             console.log("Created record");
// //             process.exit(0);
// //         });
// //     }else{
// //         console.log(key, snapshot.val().platform);
// //         query.off();
// //     }
// // });

