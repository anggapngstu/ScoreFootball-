const base_url = 'https://api.football-data.org/v2';
const options = {
   headers: {
      'X-Auth-Token': '56f7b977c1064e2cb167ec3116447a62'
   }
};


function status(response){
   if(response.status !== 200){
      console.log(`ERROR : ${response.status}`);
      return Promise.reject(new Error(response.statusText));
   } else {
      return Promise.resolve(response);
   }
}

// to parse json to the array //
function parseJson(response){
   return response.json();
}

function error(err){
   console.log(`ERROR : ${err}`);
}

// index page view //
function matchInfo(){
   function htmlData(datas){
      let show_out_data = '';
      datas.matches.forEach(data => {
         show_out_data += `
         <div class="col s12 m6 l6">
            <a href="./pages/match.html?id=${data.id}&home=${data.homeTeam.id}&away=${data.awayTeam.id}">
               <div class="card">
                  <div class="card-content white-text">
                     <div class="card-panel light-blue lighten-1">          
                        <span class="white-text left">${data.homeTeam.name}</span>
                        <span class="white-text right">${data.awayTeam.name}</span>
                     </div>
                     <div class="center-align black-text abs col s10 m10 l10">VS</div>
                     <span class="white-text left light-blue lighten-1 score home">${data.score.fullTime.homeTeam}</span>
                     <span class="white-text right light-blue lighten-1 score away">${data.score.fullTime.awayTeam}</span>
                  </div>
                  <div class="card-content">
                     <span class="black-text left homehead">Home</span>
                     <span class="black-text right awayhead">Away</span>
                  </div>
               </div>
            </a>
         </div>
         `;
         document.getElementById("match").innerHTML =  show_out_data;
      });
   }

   if('caches' in window){
      caches.match(`${base_url}/competitions/2015/matches?matchday=3`)
      .then(response => {
         if(response){
            parseJson(response)
            .then(datas => {
               htmlData(datas);
            });
         }
      });
   }
   
   fetch(`${base_url}/competitions/2015/matches?matchday=3`, options)
   .then(status)
   .then(parseJson)
   .then(datas => {
      htmlData(datas);
   });
}

// match page display //
function matchDetail(){
   return new Promise(function(resolve, reject){
      const urlParam = new URLSearchParams(window.location.search);
      const idParam = urlParam.get("id");

         function htmlData(data){
         let printReferees = '';
         data.match.referees.forEach(person => {
            printReferees += `
            <tr>
               <td>${person.id}</td>
               <td>${person.name}</td>
            </tr>`;
         });
         let score = {
            home:{
               _fulltime: data.match.score.fullTime.homeTeam,
               _halftime: data.match.score.halfTime.homeTeam,
               _extratime: data.match.score.extraTime.homeTeam,
               penalties: data.match.score.penalties.homeTeam
            },
            away:{
               _fulltime: data.match.score.fullTime.awayTeam,
               _halftime: data.match.score.halfTime.awayTeam,
               _extratime: data.match.score.extraTime.awayTeam,
               penalties: data.match.score.penalties.awayTeam
            }
         }
         
         const scoreType = new Array(score.home._fulltime, score.home._halftime, score.home._extratime, score.home.penalties, score.away._fulltime, score.away._halftime, score.away._extratime, score.away.penalties);
         for(let i = 0; i <= 7; i++){
            switch(scoreType[i]){
               case null:
                  scoreType[i] = '-';
               break;
               case '':
                  scoreType[i] = '0';
               break;
            default:
               scoreType[i];
            }
         }

         let  show_out_data = `
         <div class="container">
            <table class="centered" rules="all">
               <thead>
                  <tr>
                     <th><h4>STADIUM</h4></th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>${data.match.venue}</td>
                  </tr>
               </tbody>
            </table>
            <br />
            <h4 class="center-align">SCORE</h4>
            <table class="centered">
               <tr>
                  <td>${scoreType[0]}</td>
                  <th class="center-align">Full-time</th>
                  <td>${scoreType[4]}</td>
               </tr>
               <tr>
                  <td>${scoreType[1]}</td>
                  <th class="center-align">Half-time</th>
                  <td>${scoreType[5]}</td>
               </tr>
               <tr>
                  <td>${scoreType[2]}</td>
                  <th class="center-align">Extra-time</th>
                  <td>${scoreType[6]}</td>
               </tr>
               <tr>
                  <td>${scoreType[3]}</td>
                  <th class="center-align">Penalties</th>
                  <td>${scoreType[7]}</td>
               </tr>
            </table>
            <br />
            <h4 class="center-align">REFEREE</h4>
            <table class="centered">
               <thead>
                  <tr>
                     <th>Id Referee</th>
                     <th>Name Referee</th>
                  </tr>
               </thead>
               <tbody>
                  ${printReferees}
               </tbody>
            </table>
         </div`;

         //display data form html//
         document.getElementById("match").innerHTML =  show_out_data;
         resolve(data);
      }
      if('caches' in window){         
         caches.match(`${base_url}/matches/${idParam}`)         
         .then(response => {            
            if(response){               
               parseJson(response)               
               .then(data => {                  
                  htmlData(data);        
               });            
            }         
         })      
      }
      
      fetch(`${base_url}/matches/${idParam}`, options)
            .then(status)
            .then(parseJson)
            .then(data => {
               htmlData(data);
            });
         });
      }

function matchHomeTeamDetail(){
   return new Promise((resolve, reject) => {
      const urlParam = new URLSearchParams(window.location.search);
      const homeParam = urlParam.get("home");

      function htmlData(homeData){
         let playerList = '';
         let printPlayerList = '';
         let coachName = '-';
         homeData.squad.forEach(player => {
            if(player.role == "PLAYER"){
               playerList += `
                  <tr>
                     <td>${player.id}</td>
                     <td>${player.name}</td>
                     <td>${player.position}</td>
                  </tr>
               `;
            } else if(player.role == "COACH"){
               if(player.name != '') coachName = player.name;
            }
         });
         if(playerList == ''){
            printPlayerList = `<p>Sorry, player data isn't available.</p>`;
         } else {
            printPlayerList = `
               <h4 class="center-align">SKUAT</h4>
               <table class="striped">
                  <thead>
                     <tr>
                        <th>Id Player</th>
                        <th>Name Player</th>
                        <th>Position Player</th>
                     </tr>
                  </thead>
                  <tbody>${playerList}</tbody>
               </table>
            `;
         }
         let urlPicture = homeData.crestUrl;
         let printOutImage = '';
         if(homeData.crestUrl == null || homeData.crestUrl == ''){
            urlPicture = "";
         } else {
            urlPicture.replace(/^http:\/\//i, 'https://');
            printOutImage = `
            <div class="row center-align">
            <div class="col s12 m6 l4 z-depth-6 card-panel white">
                  <img class="responsive-img" src="${urlPicture}" />
                  </div>
                  </div>`;
         }
         let  show_out_data = `
            <div class="container">
               <h3 class="center-align">${homeData.tla} - ${homeData.name}</h3>
               ${printOutImage}
               <table>
                  <tr>
                     <th>Club Colors</th>
                     <td>: ${homeData.clubColors}</td>
                  </tr>
                  <tr>
                     <th>Coach</th>
                     <td>: ${coachName}</td>
                  </tr>
               </table>
            
               <br/>
            
               ${printPlayerList}
            </div>`;
            
         // display data from html //
         document.getElementById("homeTeam").innerHTML =  show_out_data;
         resolve(homeData);
      }
      if('caches' in window){
         caches.match(`${base_url}/teams/${homeParam}`)
         .then(response => {
            if(response){
               parseJson(response)
               .then(homeData => {
                  htmlData(homeData);
               });
            }
         })
      }
      
      fetch(`${base_url}/teams/${homeParam}`, options)
      .then(status)
      .then(parseJson)
      .then(homeData => {
         htmlData(homeData);
      });
   });
}

function matchAwayTeamDetail(){
   return new Promise((resolve, reject) => {
      const urlParam = new URLSearchParams(window.location.search);
      const awayParam = urlParam.get("away");
      function htmlData(awayData){
         let playerList = '';
         let printPlayerList = '';
         let coachName = '-';
         awayData.squad.forEach(player => {
            if(player.role == "PLAYER"){
               playerList += `
                  <tr>
                     <td>${player.id}</td>
                     <td>${player.name}</td>
                     <td>${player.position}</td>
                  </tr>
               `;
            } else if(player.role == "COACH"){
               if(player.name != '') coachName = player.name;
            }
         });
         if(playerList == ''){
            printPlayerList = `<p>Sorry, player data isn't available.</p>`;
         } else {
            printPlayerList = `
               <h4 class="center-align">SKUAT</h4>
               <table class="striped">
                  <thead>
                     <tr>
                        <th>Id Player</th>
                        <th>Name Player</th>
                        <th>Position Player</th>
                     </tr>
                  </thead>
                  <tbody>${playerList}</tbody>
               </table>
            `;
         }
         let urlPicture = awayData.crestUrl;
         let printOutImage = '';
         if(awayData.crestUrl == null || awayData.crestUrl == ''){
            urlPicture = "";
         } else {
            urlPicture.replace(/^http:\/\//i, 'https://');
            printOutImage = `
            <div class="row center-align">
            <div class="col s12 m6 l4 z-depth-6 card-panel white">
                  <img class="responsive-img" src="${urlPicture}" />
                  </div>
                  </div>
            `;
         }
         let  show_out_data = `
            <div class="container">
               <h3 class="center-align">${awayData.tla} - ${awayData.name}</h3>
               ${printOutImage}
               <table>
                  <tr>
                     <th>Club Color</th>
                     <td>: ${awayData.clubColors}</td>
                  </tr>
                  <tr>
                     <th>Coach</th>
                     <td>: ${coachName}</td>
                  </tr>
               </table>
               <br/>
               ${printPlayerList}
            </div>
         `;
            
         // display data from html //
         document.getElementById("awayTeam").innerHTML =  show_out_data;
         resolve(awayData);
      }
      if('caches' in window){
         caches.match(`${base_url}/teams/${awayParam}`)
         .then(response => {
            if(response){
               parseJson(response)
               .then(awayData => {
                  htmlData(awayData);
               });
            }
         })
      }
      
      fetch(`${base_url}/teams/${awayParam}`, options)
      .then(status)
      .then(parseJson)
      .then(awayData => {
         htmlData(awayData);
      });
   });
}

// show your favorites //
function getSavedMatchInfo(){
   getAll()
   .then(datas => {
      let  show_out_data = '';
      datas.forEach(data => {
         show_out_data += `
         <div class="col s12 m6 l6">
            <a href="./pages/match.html?id=${data.id}&home=${data.homeTeam.id}&away=${data.awayTeam.id}&saved=true">
               <div class="card">
                  <div class="card-content white-text">
                     <div class="card-panel light-blue lighten-1">          
                        <span class="white-text left">${data.homeTeam.name}</span>
                        <span class="white-text right">${data.awayTeam.name}</span>
                     </div>
                     <div class="center-align black-text abs col s10 m10 l10">VS</div>
                     <span class="black-text left light-blue lighten-1 score home">${data.score.fullTime.homeTeam}</span>
                     <span class="black-text right light-blue lighten-1 score away">${data.score.fullTime.awayTeam}</span>
                  </div>
                  <div class="card-content">
                     <span class="black-text left homehead">Home</span>
                     <span class="black-text right awayhead">Away</span>
                  </div>
                  <div class="card-action">
                     <a class="right button" href="#" onclick="deleteMatch(${data.id})">Delete</a>
                  </div>
               </div>
            </a>
         </div>`;
         document.getElementById("match").innerHTML =  show_out_data;
      });
   })
}

function deleteMatch(match){
   deleteFromDb(match);
   getSavedMatchInfo();
   M.toast({html: '<p>Horeee you successfully deleted!</p>', classes: 'rounded', displayLength: 2000});
}

function getSavedMatchDetail(){
   const urlParam = new URLSearchParams(window.location.search);
   const idParam = parseInt(urlParam.get("id"));

   getMatchById(idParam)
   .then(data => {
      console.log(data);
      let printReferees = '';
         data.referees.forEach(person => {
            printReferees += `
            <tr>
               <td>${person.id}</td>
               <td>${person.name}</td>
            </tr>`;
         });
         let score = {
            home:{
               _fulltime: data.score.fullTime.homeTeam,
               _halftime: data.score.halfTime.homeTeam,
               _extratime: data.score.extraTime.homeTeam,
               penalties: data.score.penalties.homeTeam
            },
            away:{
               _fulltime: data.score.fullTime.awayTeam,
               _halftime: data.score.halfTime.awayTeam,
               _extratime: data.score.extraTime.awayTeam,
               penalties: data.score.penalties.awayTeam
            }
         }

      const scoreType = new Array(score.home._fulltime, score.home._halftime, score.home._extratime, score.home.penalties, score.away._fulltime, score.away._halftime, score.away._extratime, score.away.penalties);
      for(let i = 0; i <= 7; i++){
         switch(scoreType[i]){
            case null:
               scoreType[i] = '-';
            break;
            case '':
               scoreType[i] = '0';
            break;
         default:
            scoreType[i];
         }
      }

      let  show_out_data = `
      <div class="container">
         <table class="centered" rules="all">
            <thead>
               <tr>
                  <h4><th>STADIUM</th></h4>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td>${data.venue}</td>
               </tr>
            </tbody>
         </table>
         <br />
         <h4 class="center-align">SCORE</h4>
         <table class="centered">
            <tr>
               <td>${scoreType[0]}</td>
               <th class="center-align">Full-time</th>
               <td>${scoreType[4]}</td>
            </tr>
            <tr>
               <td>${scoreType[1]}</td>
               <th class="center-align">Half-time</th>
               <td>${scoreType[5]}</td>
            </tr>
            <tr>
               <td>${scoreType[2]}</td>
               <th class="center-align">Extra-time</th>
               <td>${scoreType[6]}</td>
            </tr>
            <tr>
               <td>${scoreType[3]}</td>
               <th class="center-align">Penalties</th>
               <td>${scoreType[7]}</td>
            </tr>
         </table>
         <br />
         <h4 class="center-align"></h4>
         <table class="centered">
            <thead>
               <tr>
                  <th>Id Referess</th>
                  <th>Name Referess</th>
               </tr>
            </thead>
            <tbody>
               ${printReferees}
            </tbody>
         </table>
      </div`;

      // send id information from each team to get data for each team from the fire. //
      document.getElementById("match").innerHTML =  show_out_data;
   });
}

function getSavedHomeTeamDetail(){
   const urlParam = new URLSearchParams(window.location.search);
   const idParam = parseInt(urlParam.get("home"));

   getTeamById(idParam)
   .then(homeData => {
      let playerList = '';
      let printPlayerList = '';
      let coachName = '-';
      homeData.squad.forEach(player => {
         if(player.role == "PLAYER"){
            playerList += `
               <tr>
                  <td>${player.id}</td>
                  <td>${player.name}</td>
                  <td>${player.position}</td>
               </tr>
            `;
         } else if(player.role == "COACH"){
            if(player.name != '') coachName = player.name;
         }
      });
      if(playerList == ''){
         printPlayerList = `<p>Sorry, player data isn't available.</p>`;
      } else {
         printPlayerList = `
         <h4 class="center-align">SKUAT</h4>
         <table class="striped">
            <thead>
               <tr>
                  <th>Id Player</th>
                  <th>Name Player</th>
                  <th>Position Player</th>
               </tr>
            </thead>
            <tbody>${playerList}</tbody>
         </table>`;
      }
      let urlPicture = homeData.crestUrl;
      let printOutImage = '';
      if(homeData.crestUrl == null || homeData.crestUrl == ''){
         urlPicture = "";
      } else {
         urlPicture.replace(/^http:\/\//i, 'https://');
         printOutImage = `
         <div class="row center-align">
         <div class="col s12 m6 l4 z-depth-6 card-panel white">
            <img class="responsive-img" src="${urlPicture}" />
            </div>
            </div>`;
      }
      let  show_out_data = `
      <div class="container">
         <h3 class="center-align">${homeData.tla} - ${homeData.name}</h3>
         ${printOutImage}
         <table>
            <tr>
               <th>Club Color</th>
               <td>: ${homeData.clubColors}</td>
            </tr>
            <tr>
               <th>Coach</th>
               <td>: ${coachName}</td>
            </tr>
         </table>
         <br/>
         ${printPlayerList}
      </div>`;

      // display data from html //
      document.getElementById("homeTeam").innerHTML =  show_out_data;
   });
}

function getSavedAwayTeamDetail(){
   const urlParam = new URLSearchParams(window.location.search);
   const idParam = parseInt(urlParam.get("away"));

   getTeamById(idParam)
   .then(awayData => {
      let playerList = '';
      let printPlayerList = '';
      let coachName = '-';
      awayData.squad.forEach(player => {
         if(player.role == "PLAYER"){
            playerList += `
               <tr>
                  <td>${player.id}</td>
                  <td>${player.name}</td>
                  <td>${player.position}</td>
               </tr>
            `;
         } else if(player.role == "COACH"){
            if(player.name != '') coachName = player.name;
         }
      });
      if(playerList == ''){
         printPlayerList = `<p>Sorry, player data isn't available.</p>`;
      } else {
         printPlayerList = `
         <h4 class="center-align">SKUAT</h4>
         <table class="striped">
            <thead>
               <tr>
                  <th>Id Player</th>
                  <th>Name Player</th>
                  <th>Position Player</th>
               </tr>
            </thead>
            <tbody>${playerList}</tbody>
         </table>`;
      }
      let urlPicture = awayData.crestUrl;
      let printOutImage = '';
      if(awayData.crestUrl == null || awayData.crestUrl == ''){
         urlPicture = "";
      } else {
         urlPicture.replace(/^http:\/\//i, 'https://');
         printOutImage = `
         <div class="row center-align">
         <div class="col s12 m6 l4 z-depth-6 card-panel white">
            <img class="responsive-img" src="${urlPicture}" />
            </div>
            </div>`;
      }
      let show_out_data = `
      <div class="container">
         <h3 class="center-align">${awayData.tla} - ${awayData.name}</h3>
         ${printOutImage}
         <table>
            <tr>
               <th>Club Colors</th>
               <td>: ${awayData.clubColors}</td>
            </tr>
            <tr>
               <th>Coach</th>
               <td>: ${coachName}</td>
            </tr>
         </table>
         
         <br />
         ${printPlayerList}
      </div>`;

      // display data from html //
      document.getElementById("awayTeam").innerHTML =  show_out_data;
   });
}

// displays football standings data //
function standingList(){
   if('caches' in window){
      caches.match(`${base_url}/competitions/2015/standings?standingType=TOTAL`)
      .then(response => {
         if(response){
            parseJson(response)
            .then(datas => {
               let show_out_data = '';
               datas.standings.forEach(data => {
                  let standingStage = data.stage;
                  if(standingStage == 'REGULAR_SEASON'){
                     let printTeams = "";
                     data.table.forEach(team => {
                        printTeams +=`
                        <tr>
                           <td>${team.position}</td>
                           <td>${team.team.name}</td>
                           <td>${team.playedGames}</td>
                           <td>${team.won}</td>
                           <td>${team.lost}</td>
                           <td>${team.goalsFor}</td>
                           <td>${team.points}</td>
                           
                        </tr>`;
                     });
                     show_out_data += `
                     <h3 class="center-align">Football Standings</h3>
                     <table class="centered">
                        <thead class="card">
                           <tr>
                           <th>Ps</th>
                           <th>Team</th>
                           <th>P</th>
                           <th>W</th>
                           <th>GF</th>
                           <th>GA</th>
                           <th>Pts</th>
                           </tr>
                        </thead>
                        <tbody>
                           ${printTeams}
                        </tbody>
                     </table>`;
                  } 
               });
               document.getElementById("standings").innerHTML =  show_out_data;
            });
         }
      });
   }
   
   fetch(`${base_url}/competitions/2015/standings?standingType=TOTAL`, options)
   .then(status)
   .then(parseJson)
   .then(datas => {
      let show_out_data = '';
      datas.standings.forEach(data => {
         let standingStage = data.stage;
         if(standingStage == 'REGULAR_SEASON'){
            let printTeams = "";
            data.table.forEach(team => {
               printTeams +=`
               <tr>
                  <td>${team.position}</td>
                  <td>${team.team.name}</td>
                  <td>${team.playedGames}</td>
                  <td>${team.won}</td>
                  <td>${team.lost}</td>
                  <td>${team.goalsFor}</td>
                  <td>${team.points}</td>
               </tr>`;
            });
            show_out_data += `
            <h3 class="center-align">Football Standings</h3>
            <table class="centered">
               <thead class="card">
                  <tr>
                  <th>Ps</th>
                  <th>Team</th>
                  <th>P</th>
                  <th>W</th>
                  <th>GF</th>
                  <th>GA</th>
                  <th>Pts</th>
                  </tr>
               </thead>
               <tbody>
                  ${printTeams}
               </tbody>
            </table>`;
         } 
      });
      document.getElementById("standings").innerHTML =  show_out_data;
   });
};