"use strict";

/**

Send individualised notifications

i.e. Account updates for users with one-or-more device tokens
*/

const apn = require("apn");

let users = [
  { name: "Wendy", "devices": ["da507e17af58200391bcf5a57f99fb74e0254fc2736f3d150df086b662db2c4e"]},
  { name: "John",  "devices": ["da507e17af58200391bcf5a57f99fb74e0254fc2736f3d150df086b662db2c4e"]},
];

let service = new apn.Provider({
  cert: "certificates/Certificates_development.pem",
  key: "certificates/Certificates_development.key",
});

users.forEach( (user) => {

  let note = new apn.Notification();
  note.alert = {title: `Hey ${user.name}`, body:"I just sent my first Push Notification"};
  note.badge = 1;
  note.topic = "com.santoshsingh.testpush";
  note.sound = "default";
  
  console.log(`Sending: ${note.compile()} to ${user.devices}`);

  service.send(note, user.devices).then( result => {
    console.log(JSON.stringify(result));
      console.log("sent:", result.sent.length);
      console.log("failed:", result.failed.length);
      console.log(result.failed);
  });
});

// For one-shot notification tasks you may wish to shutdown the connection
// after everything is sent, but only call shutdown if you need your
// application to terminate.
service.shutdown();
