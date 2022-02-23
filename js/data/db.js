let dbPromised = idb.open("sepak-bola", 1, upgradeDB => {
  // Match object store
  const matchObjectStore = upgradeDB.createObjectStore("match", {keyPath: "id"});
  matchObjectStore.createIndex("id", "id", {unique: false});

  // Team object store
  const teamsObjectStore = upgradeDB.createObjectStore("team", {keyPath: "id"});
  teamsObjectStore.createIndex("TeamId", "id", {unique: false});
});

function saveForLater(match){  
  dbPromised
  .then(db => {
     let tx = db.transaction("match", "readwrite");
     let store = tx.objectStore("match");
     console.log(db);
     console.log(match);
     store.put(match.match);
     return tx.complete;
  })
  .then(() => {
     console.log(`Selamat Pertadingan berhasil disimpan!`);
  });
}

function saveTeam(team){
  dbPromised
  .then(db => {
     let tx = db.transaction("team", "readwrite");
     let store = tx.objectStore("team");
     console.log(team)
     store.put(team);
     return tx.complete;
  })
  .then(() => {
     console.log(`Selamat Team Home berhasil disimpan!`);
  })
  .catch(() => {
     console.log(`Team ${team.name} sudah ada di idb.`);
  });
}

function getAll(){
  return new Promise(function(resolve, reject){
    dbPromised
    .then(db => {
       let tx = db.transaction("match", "readonly");
       let store = tx.objectStore("match");
       return store.getAll();
    }) 
    .then(data => {
       resolve(data);
       console.log(data);
    });
  });
}

function getMatchById(id){
  return new Promise(function(resolve, reject){
     dbPromised
     .then(db => {
        let tx = db.transaction("match", "readonly");
        let store = tx.objectStore("match");
        console.log(db);
        return store.get(id);
     })
     .then(data => {
        resolve(data);
        console.log(data);
     });
  });
}

function getTeamById(id){
  return new Promise((resolve, reject) => {
     dbPromised
     .then(db => {
        let tx = db.transaction("team", "readonly");
        let store = tx.objectStore("team");
        return store.get(id);
     })
     .then(data => {
        resolve(data);
     });
  });
}

function deleteFromDb(matchId){
  dbPromised
  .then(db => {
     let tx = db.transaction("match", "readwrite");
     let matchStore = tx.objectStore("match");
     matchStore.delete(matchId);
     return tx.complete;
  })
  .then(() => {
     console.log(`Item deleted`);
  });
}