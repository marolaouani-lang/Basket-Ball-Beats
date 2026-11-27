const categories = {
  attaque:{title:"ATTAQUE",eyebrow:"FAIRE EXPLOSER LE COMPTEUR",items:[
    ["2 POINTS","🏀","Panier", "green"],["3 POINTS","🎯","Panier", "green"],["LANCER FRANC","⛹️","Panier", "green"],["DUNK","💥","Action", "green"],
    ["LAY-UP","🙌","Action", "green"],["ALLEY-OOP","🚀","Action", "green"],["CONTRE-ATTAQUE","⚡","Action", "green"],["PASSE DÉCISIVE","🤝","Action", "green"],
    ["GROS PANIER","🔥","Action", "green"],["BUZZER BEATER","⏰","Action", "green"],["AND ONE","☝️","Action", "green"],["BRAVO !","👏","Public", "green"]
  ]},
  defense:{title:"DÉFENSE",eyebrow:"FAIRE MONTER LA PRESSION",items:[
    ["GROS CONTRE","🖐️","Défense","blue"],["INTERCEPTION","🛡️","Défense","blue"],["REBOND DÉFENSIF","💪","Défense","blue"],["FAUTE ATTAQUANT","🚫","Défense","blue"],
    ["PRESSION !","📣","Défense","blue"],["DÉFENSE !","🏰","Défense","blue"],["STOP !","✋","Défense","blue"],["VOL DE BALLE","🦅","Défense","blue"],
    ["CHARGE","💢","Défense","blue"],["GROSSE DÉFENSE","🔥","Défense","blue"],["CLAP DE DÉFENSE","👏","Public","blue"],["ON NE PASSE PAS","⛔","Défense","blue"]
  ]},
  ambiance:{title:"AMBIANCE",eyebrow:"FAIRE VIBRER LA SALLE",items:[
    ["ALLEZ !","📣","Public","purple"],["DÉFENSE !","🥁","Public","purple"],["CLAP CLAP","👏","Public","purple"],["OLA","🌊","Public","purple"],
    ["Sifflets","📯","Public","purple"],["Applaudissements","🙌","Public","purple"],["HOURRA","🎉","Public","purple"],["MUSIQUE","🎵","Musique","purple"],
    ["TAMBOURS","🥁","Musique","purple"],["CHANT DU PUBLIC","🎤","Public","purple"],["BOUcan","🔊","Public","purple"],["HUMOUR","😂","Animation","purple"],
    ["ANNONCE","🎙️","Voix","purple"],["HYPE !","⚡","Animation","purple"],["VICTOIRE","🏆","Animation","purple"],["SILENCE...","🤫","Animation","purple"]
  ]},
  match:{title:"MATCH",eyebrow:"LES TEMPS FORTS DE LA RENCONTRE",items:[
    ["COUP D'ENVOI","🏁","Match","red"],["FIN DU QUART-TEMPS","⏱️","Match","red"],["MI-TEMPS","☕","Match","red"],["FIN DU MATCH","🔔","Match","red"],
    ["BUZZER","🚨","Match","red"],["TEMPS MORT","✋","Match","red"],["REPRISE","▶️","Match","red"],["FAUTE","🚩","Match","red"],
    ["LANCERS FRANCS","🎯","Match","red"],["CHANGEMENT","🔄","Match","red"],["ARBITRE","📢","Match","red"],["VICTOIRE !","🏆","Match","red"]
  ]},
  "mes-sons":{title:"MES SONS",eyebrow:"TON ESPACE PERSONNEL",items:[]}
};
const grid=document.getElementById("soundGrid"), title=document.getElementById("sectionTitle"), eyebrow=document.getElementById("sectionEyebrow"), count=document.getElementById("soundCount"), state=document.getElementById("playbackState");
let currentTab="attaque", masterVolume=.8, activeAudios=[];
const offlineSoundSources={};
if("caches"in window){caches.open("basket-sound-audio-v1").then(async cache=>{for(const url of Object.values(realSounds)){const saved=await cache.match(url);if(saved)offlineSoundSources[url]=URL.createObjectURL(await saved.blob())}}).catch(()=>{})}
const realSounds={
  buzzer:"https://sfxmint.com/dl/basketball-buzzer-01.mp3",
  bounce:"https://sfxmint.com/dl/impact-bounce-15.mp3",
  applause:"https://sfxmint.com/dl/crowd-applause-58.mp3",
  cheer:"https://sfxmint.com/dl/crowd-chant-15.mp3",
  chant:"https://sfxmint.com/dl/crowd-chant-05.mp3",
  whistle:"https://sfxmint.com/dl/stadium-crowd-04.mp3",
  groan:"https://sfxmint.com/dl/crowd-groan-01.mp3",
  horn:"https://sfxmint.com/dl/goal-horn-01.mp3",
  chantCall:"https://sfxmint.com/dl/crowd-chant-08.mp3",
  chantStop:"https://sfxmint.com/dl/crowd-chant-07.mp3",
  groan2:"https://sfxmint.com/dl/crowd-groan-02.mp3",
  laughter:"https://sfxmint.com/dl/baby-babble-02.mp3"
};
const soundForLabel={
  "2 POINTS":"cheer","3 POINTS":"cheer","LANCER FRANC":"applause","DUNK":"cheer",
  "LAY-UP":"cheer","ALLEY-OOP":"cheer","GROS PANIER":"cheer","BUZZER BEATER":"buzzer",
  "GROS CONTRE":"cheer","INTERCEPTION":"bounce","REBOND DÉFENSIF":"bounce",
  "FAUTE ATTAQUANT":"whistle","Sifflets":"whistle","Applaudissements":"applause",
  "CLAP CLAP":"applause","CHANT DU PUBLIC":"chant","ALLEZ !":"chant",
  "DÉFENSE !":"chant","HOURRA":"cheer","BOUcan":"cheer","VICTOIRE":"cheer",
  "VICTOIRE !":"cheer","FIN DU QUART-TEMPS":"buzzer","FIN DU MATCH":"buzzer",
  "BUZZER":"buzzer","MI-TEMPS":"buzzer","TEMPS MORT":"whistle","REPRISE":"buzzer",
  "GROSSE DÉFENSE":"chant","CLAP DE DÉFENSE":"applause","BRAVO !":"applause",
  "CONTRE-ATTAQUE":"cheer","PASSE DÉCISIVE":"cheer","AND ONE":"cheer",
  "PRESSION !":"chant","STOP !":"whistle","VOL DE BALLE":"bounce",
  "CHARGE":"whistle","ON NE PASSE PAS":"chantStop",
  "HUMOUR":"laughter","HYPE !":"cheer",
  "COUP D'ENVOI":"horn","FAUTE":"whistle","LANCERS FRANCS":"applause",
  "CHANGEMENT":"whistle","ARBITRE":"whistle"
};
function playRealSound(key){
  const url=realSounds[key];
  if(!url){state.classList.remove("active");state.innerHTML='<span class="pulse"></span> Son réel bientôt disponible';return}
  const audio=new Audio(offlineSoundSources[url]||url);
  audio.volume=masterVolume;
  audio.preload="auto";
  activeAudios.push(audio);
  audio.addEventListener("ended",()=>{activeAudios=activeAudios.filter(a=>a!==audio);if(!activeAudios.length){state.classList.remove("active");state.innerHTML='<span class="pulse"></span> Aucun son en lecture'}});
  audio.addEventListener("error",()=>{activeAudios=activeAudios.filter(a=>a!==audio);state.classList.remove("active");state.innerHTML='<span class="pulse"></span> Son indisponible — vérifie ta connexion'});
  audio.play().then(()=>{state.classList.add("active");state.innerHTML='<span class="pulse"></span> Son réel en lecture'}).catch(()=>{activeAudios=activeAudios.filter(a=>a!==audio);state.classList.remove("active");state.innerHTML='<span class="pulse"></span> Appuie à nouveau pour autoriser le son'});
}
function render(){const data=categories[currentTab];title.textContent=data.title;eyebrow.textContent=data.eyebrow;count.textContent=data.items.length?data.items.length+" sons":"Bientôt disponible";grid.innerHTML="";if(!data.items.length){grid.innerHTML='<div class="empty-state"><div>⭐</div><h3>TES SONS PERSONNELS</h3><p>L’import de fichiers MP3 et la création de boutons personnalisés seront ajoutés dans une prochaine version.</p></div>';return}data.items.forEach((item,i)=>{const b=document.createElement("button");b.className="sound-button "+item[3];b.innerHTML='<span class="sound-icon">'+item[1]+'</span><span class="sound-name">'+item[0]+'</span><span class="sound-type">'+item[2]+'</span>';b.addEventListener("click",()=>{if(item[0]==="SILENCE..."){document.getElementById("stopAll").click();return}document.querySelectorAll(".sound-button.playing").forEach(x=>x.classList.remove("playing"));b.classList.add("playing");playRealSound(soundForLabel[item[0]])});grid.appendChild(b)})}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{document.querySelector(".tab.active")?.classList.remove("active");b.classList.add("active");currentTab=b.dataset.tab;render()}));
document.getElementById("masterVolume").addEventListener("input",e=>{masterVolume=Number(e.target.value)/100;document.getElementById("volumeValue").value=e.target.value+"%";activeAudios.forEach(a=>a.volume=masterVolume)});
document.getElementById("downloadSounds").addEventListener("click",async()=>{
  const button=document.getElementById("downloadSounds");
  const urls=[...new Set(Object.values(realSounds))];
  button.disabled=true;button.textContent="TÉLÉCHARGEMENT…";
  state.classList.remove("active");state.innerHTML='<span class="pulse"></span> Enregistrement des sons…';
  try{
    const cache=await caches.open("basket-sound-audio-v1");
    let done=0;
    for(const url of urls){
      if(await cache.match(url)){done++;continue}
      const response=await fetch(url,{mode:"cors"});
      if(!response.ok||response.type==="opaque")throw new Error("Téléchargement impossible");
      await cache.put(url,response.clone());offlineSoundSources[url]=URL.createObjectURL(await response.clone().blob());done++;
      button.textContent="TÉLÉCHARGEMENT "+Math.round(done/urls.length*100)+"%";
    }
    state.innerHTML='<span class="pulse"></span> '+done+' sons enregistrés sur cet appareil';
    button.textContent="SONS ENREGISTRÉS ✓";
  }catch(e){
    state.innerHTML='<span class="pulse"></span> Téléchargement interrompu — vérifie ta connexion';
    button.textContent="RÉESSAYER LE TÉLÉCHARGEMENT";
  }finally{button.disabled=false}
});
document.getElementById("stopAll").addEventListener("click",()=>{activeAudios.forEach(a=>{try{a.pause();a.currentTime=0}catch(e){}});activeAudios=[];document.querySelectorAll(".sound-button.playing").forEach(x=>x.classList.remove("playing"));state.classList.remove("active");state.innerHTML='<span class="pulse"></span> Lecture arrêtée'});
document.getElementById("themeToggle").addEventListener("click",()=>document.body.classList.toggle("light"));
if("serviceWorker"in navigator&&location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}))}
render();