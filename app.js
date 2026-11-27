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
let currentTab="attaque", masterVolume=.8, activeNodes=[];
let audioContext=null;
function getAudio(){if(!audioContext)audioContext=new(window.AudioContext||window.webkitAudioContext)();if(audioContext.state==="suspended")audioContext.resume();return audioContext}
function playDemo(index){const ctx=getAudio(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=index%3===0?"triangle":index%3===1?"sine":"sawtooth";const base=[440,523,659,784,880][index%5];osc.frequency.setValueAtTime(base,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(base*1.35,ctx.currentTime+.12);gain.gain.setValueAtTime(Math.max(.001,masterVolume*.16),ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.42);osc.connect(gain);gain.connect(ctx.destination);const node={osc,gain};activeNodes.push(node);osc.onended=()=>{activeNodes=activeNodes.filter(n=>n!==node);if(!activeNodes.length){state.classList.remove("active");state.innerHTML='<span class="pulse"></span> Aucun son en lecture'}};osc.start();osc.stop(ctx.currentTime+.44);state.classList.add("active");state.innerHTML='<span class="pulse"></span> Son de démonstration en lecture'}
function render(){const data=categories[currentTab];title.textContent=data.title;eyebrow.textContent=data.eyebrow;count.textContent=data.items.length?data.items.length+" sons":"Bientôt disponible";grid.innerHTML="";if(!data.items.length){grid.innerHTML='<div class="empty-state"><div>⭐</div><h3>TES SONS PERSONNELS</h3><p>L’import de fichiers MP3 et la création de boutons personnalisés seront ajoutés dans une prochaine version.</p></div>';return}data.items.forEach((item,i)=>{const b=document.createElement("button");b.className="sound-button "+item[3];b.innerHTML='<span class="sound-icon">'+item[1]+'</span><span class="sound-name">'+item[0]+'</span><span class="sound-type">'+item[2]+'</span>';b.addEventListener("click",()=>{document.querySelectorAll(".sound-button.playing").forEach(x=>x.classList.remove("playing"));b.classList.add("playing");playDemo(i)});grid.appendChild(b)})}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{document.querySelector(".tab.active")?.classList.remove("active");b.classList.add("active");currentTab=b.dataset.tab;render()}));
document.getElementById("masterVolume").addEventListener("input",e=>{masterVolume=Number(e.target.value)/100;document.getElementById("volumeValue").value=e.target.value+"%"});
document.getElementById("stopAll").addEventListener("click",()=>{activeNodes.forEach(n=>{try{n.gain.gain.cancelScheduledValues(audioContext.currentTime);n.gain.gain.setTargetAtTime(0,audioContext.currentTime,.015);n.os.stop(audioContext.currentTime+.08)}catch(e){}});activeNodes=[];document.querySelectorAll(".sound-button.playing").forEach(x=>x.classList.remove("playing"));state.classList.remove("active");state.innerHTML='<span class="pulse"></span> Lecture arrêtée'});
document.getElementById("themeToggle").addEventListener("click",()=>document.body.classList.toggle("light"));
if("serviceWorker"in navigator&&location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}))}
render();