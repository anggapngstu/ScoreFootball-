const webPush = require('web-push');

const vapidKeys = {
   "publicKey":"BMoOqubsptIN5q97NMJLoD2X1wUxrPyiV5GtQS7yVyoIoKu1r8CvsLEIhr5dVSG8hk-OWSQOg_xqTXIiK8ivYD4",
   "privateKey": "8QryqcvIce01-MbydXYmDZns7XtL-E0AGFJZg-0esjw"
};

webPush.setVapidDetails(
   'maito:example@yourdomain.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)

const pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/eIRpYL5ybZs:APA91bHQHeAXyl058XyNvZ5UtIGEXLOCBdMEGo2RY120-Bym9YBh_WgVD_UR8dxdBRGLZraV6AquTBastgC-KJPHgrdgYhCfbXLjsFlJM607g2My3e5Anjwa3NdaoBgh2AgHOkIC3fg5",
   "keys": {
      "p256dh": "BKq24jO0RpIVHU0QPnfFbMP2Q9rB9npWEnt4+YxiMBjSMItfajf4jTAwtMsSdZ7ajxZdnWCzB4td9AmRwyVizcs=",
      "auth": "AOI0C4yvmGBtAfPoSoWxhA=="
   }
};

let payload = 'Ini adalah sebuah pesan notifikasi.';

const options = {
   gcmAPIKey: '129443663101',
   TTL: 60
};

webPush.sendNotification(
   pushSubscription,
   payload,
   options
)