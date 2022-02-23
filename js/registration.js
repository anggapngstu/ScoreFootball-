// REGISTER SERVICE WORKER //
if(!("serviceWorker" in navigator)){
   console.log('Service Worker tidak didukung browser ini.');
} else {
   registerServiceWorker();
   requestPermission();
}

function registerServiceWorker(){
   window.addEventListener("load", () => {
      return navigator.serviceWorker.register("/sw.js")
      .then(registration => {
         console.log('Registrasi Service Worker berhasil!');
            return registration;
      })
      .catch(err => {
      console.error('Registrasi Service Worker gagal', err);
      });
   });
}

function requestPermission(){
   if('Notification' in window){
      Notification.requestPermission()
      .then(result => {
         if(result === "denied"){
         console.log('Fitur notifikasi tidak diizinkan.');
            return;
         } else if(result === "default"){
            console.error('Pengguna menutup kotak dialog permintaan izin.');
            return;
         }

         navigator.serviceWorker.ready.then(() => {
            if(('PushManager' in window)){
               navigator.serviceWorker.getRegistration()
               .then(registration => {
                  registration.pushManager.subscribe({
                     userVisibleOnly: true,
                     applicationServerKey: urlBase64ToUint8Array("BMoOqubsptIN5q97NMJLoD2X1wUxrPyiV5GtQS7yVyoIoKu1r8CvsLEIhr5dVSG8hk-OWSQOg_xqTXIiK8ivYD4")
                  })
                  .then(subscribe => {
                     console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                     console.log('Berhasil melakukan subscribe dengan p256dh key: ',
                     btoa(
                        String
                        .fromCharCode
                        .apply(null, new Uint8Array(subscribe.getKey('p256dh')))
                     ));
                     console.log('Berhasil melakukan subscribe dengan auth key: ', 
                     btoa(
                        String
                        .fromCharCode
                        .apply(null, new Uint8Array(subscribe.getKey('auth')))
                     ));
                  })
                  .catch(e => {
                     console.error('Tidak dapat melakukan subscribe ', e.message);
                  });
               });
            }
         });
      });
   }
}

function urlBase64ToUint8Array(base64String){
   const padding = '='.repeat((4 - base64String % 4) % 4);
   const base64 = (base64String + padding)
   .replace(/-/g, '+')
   .replace(/_/g, '/');
   const rawData = window.atob(base64);
   let outputArray = new Uint8Array(rawData.length);
   for(let i = 0; i < rawData.length; ++i){
   outputArray[i] = rawData.charCodeAt(i);
   }
   return outputArray;
}