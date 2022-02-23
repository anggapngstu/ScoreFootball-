document.addEventListener("DOMContentLoaded", function(){
    let elems = document.querySelectorAll(".tabs");   
    const options = {
       swipeable: false
    };
    M.Tabs.init(elems, options);
 
    const urlParams = new URLSearchParams(window.location.search);
    const isFromSaved = urlParams.get("saved");
 
    let saveBtn = document.getElementById("save");
    let matchPage, homeTeam, awayTeam;  
 
    if(isFromSaved){
       saveBtn.style.display = 'none';
       getSavedMatchDetail();
       getSavedHomeTeamDetail();
       getSavedAwayTeamDetail();
    } else {
       matchPage = matchDetail();
       homeTeam = matchHomeTeamDetail();
       awayTeam = matchAwayTeamDetail();
    }
 
    saveBtn.onclick = function(){
       console.log(`You save the match ......`);
       matchPage.then(match => {
          saveForLater(match);
       });
       homeTeam.then(home => {
          saveTeam(home);
       });
       awayTeam.then(away => {
          saveTeam(away);
       });
       M.toast({html: '<p>Horee congratulations you have successfully added to favorites please see!</p>',classes: 'rounded', displayLength: 2000});
       saveBtn.classList.add('disabled');
    }
 })