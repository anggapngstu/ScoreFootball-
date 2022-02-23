// Config Navigasi
document.addEventListener("DOMContentLoaded", function(){

  // activate sidebar nav
const elems = document.querySelectorAll(".sidenav");
M.Sidenav.init(elems);
loadNav();

  // Load page content
let page = window.location.hash.substr(1);
if(page === "") page = "home";
loadPage(page);

function loadNav(){
   const xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function(){
      if(this.readyState == 4){
         if(this.status != 200) return;

            // Muat daftar tautan menu
         document.querySelectorAll(".topnav, .sidenav").forEach(elm => {
            elm.innerHTML = xhttp.responseText;
         });

           // Daftarkan event listener pada setiap tautan menu
         document.querySelectorAll(".topnav a, .sidenav a").forEach(elm => {
            elm.addEventListener("click", event => {
                 // Tutup sidenav
               let sidenav = document.querySelector(".sidenav");
               M.Sidenav.getInstance(sidenav).close();

                 // Muat konten yang dipanggil
               page = event.target.getAttribute("href").substr(1);
               loadPage(page);
            });
         });
      }
   };

   xhttp.open("GET", "pages/nav.html", true);
   xhttp.send();
}


function loadPage(page){
   const xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function(){
      if(this.readyState == 4){
         let content = document.querySelector("#body-content");
         if(this.status == 200){
            content.innerHTML = xhttp.responseText;
            if(page === 'home') {
               matchInfo();
            } else if(page === 'standings'){
               standingList();
            } else if(page === 'favorites'){
               getSavedMatchInfo();
            }
         } else if(this.status == 404){
            content.innerHTML = `<h3>Page Not Found!</h3>`;
         } else {
            content.innerHTML = `<h3>Oops.... The page cannot be accessed!</h3>`;
         }
      }
   };

   xhttp.open("GET", `/pages/${page}.html`, true);
   xhttp.send();
}
});