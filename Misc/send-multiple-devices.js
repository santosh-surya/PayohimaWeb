
/**

Send an identical notification to multiple devices.

Possible use cases:

 - Breaking news
 - Announcements
 - Sport results
*/

const apn = require("apn");

var tokens = ["da507e17af58200391bcf5a57f99fb74e0254fc2736f3d150df086b662db2c4e"];

var service = new apn.Provider({
  cert: "certificates/Certificates_development.pem",
  key: "certificates/Certificates_development.key",
});

var note = new apn.Notification({
	alert:  {title: "Breaking News", body: "I just sent my first Push Notification"},
    badge: 0,
    sound: "default"
});

// The topic is usually the bundle identifier of your application.
note.topic = "com.santoshsingh.testpush";

console.log(`Sending: ${note.compile()} to ${tokens}`);
service.send(note, tokens).then( result => {
    console.log("sent:", result.sent.length);
    console.log("failed:", result.failed.length);
    console.log(result.failed);
});


// For one-shot notification tasks you may wish to shutdown the connection
// after everything is sent, but only call shutdown if you need your 
// application to terminate.
service.shutdown();
