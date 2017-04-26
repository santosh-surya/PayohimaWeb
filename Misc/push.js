var firebase = require('firebase');
var apn = require("apn");
var gcm = require('node-gcm');

var bundleId = "com.santoshsingh.payohima";

var config = {
    apiKey: "AIzaSyDoHgtjBQ9LZE0hgSTVGRogaLlI4_d3GZE",
    authDomain: "ukmm-8ae9c.firebaseapp.com",
    databaseURL: "https://ukmm-8ae9c.firebaseio.com",
    storageBucket: "ukmm-8ae9c.appspot.com",
    messagingSenderId: "598320677247"
};
firebase.initializeApp(config);

console.log('DataService Initialised');

class Android {
    constructor() {
        this.sender = new gcm.Sender('AAAAi06xAX8:APA91bHWRkLHWuaMDqPWJDCepy5PCoVYuKSOk5HdqXIccbwwTaIaVFVB6ztgdiP4bzDGKMIV_kI4Xq10YcBNS8DnlrVetlgSWOz3ToKZONiKVLtMm4gAwASLZV16jx4zJXsYwC7JPW_1');
    }
    pushMessage(title, body, image, badge, tokens){
        // var message = new gcm.Message({
        //     collapseKey: 'demo',
        //     priority: 'high',
        //     contentAvailable: false,
        //     delayWhileIdle: false,
        //     timeToLive: 3,
        //     restrictedPackageName: bundleId,
        //     dryRun: false,
        //     data: {
        //         key1: 'message1',
        //         key2: 'message2'
        //     },
        //     notification: {
        //         title: title,
        //         body: body,
        //         message: body
        //     }
        // });
        var message = new gcm.Message();
        message.addData('title', title);
        message.addData('message', body);
        message.addData('sound', 'default');
        message.addData('image', image);
        this.sender.send(message, { registrationTokens: tokens }, function (err, response) {
            if(err) console.error(err);
            else     console.log(response);
        });
    }
}
//
class Apple {
    constructor () {
        var options = {
            keyFile : "./ios/aps_development_key.pem",
            certFile : "./ios/aps_development.pem",
            debug : true
        };
        this.service = new apn.Provider({
            cert: "ios/aps_development.pem",
            key: "ios/aps_development_key.pem"
        });

        console.log('connected');
    }
    pushMessage(title, body, image, badge, tokens){
        
        var note = new apn.Notification({
            alert:  {title: title, body: body},
            badge: badge,
            sound: "default",
            image: image
        });
        note.topic = bundleId;
        this.service.send(note, tokens).then( result => {
            console.log("sent:", result.sent);
            console.log("failed:", result.failed);
            console.log(result.failed);
        });
    }
}
var apple = new Apple();
var android = new Android();

firebase.database().ref('/deviceTokens/').orderByKey().on("child_added", function(snapshot){
    var d = snapshot.val();
    if (d.platform.includes('android')){
        console.log('android', d.deviceToken);
        android.pushMessage("New Flavours", "Try our Guava Flavour", "https://firebasestorage.googleapis.com/v0/b/ukmm-8ae9c.appspot.com/o/Guava-Free-Download-PNG.png?alt=media&token=87b960e8-8c35-4f61-8042-26ba2296410b", 0, [d.deviceToken]);
    }else if (d.platform.includes('ios')){
        console.log('ios', d.deviceToken);
        //apple.pushMessage("Title", "Helloo there", 0, [d.deviceToken]);
    }
    console.log("------");
});

