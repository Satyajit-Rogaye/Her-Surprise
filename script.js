const CONFIG = {
  name: "My Favorite Person Hinata",
  signature: "❤️ Me",
  pin: "0823", // Change this to your secret 4-digit code
  hint: "our special date",
  quote: "In a world full of temporary things, you became my favorite forever.",
  musicFile: "assets/music.mp3"
};

const screens = ["home","flowers","quote","lock","loading","gallery","letter","final"];
const $ = id => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  $("nameHero").textContent = CONFIG.name;
  $("signature").textContent = CONFIG.signature;
  $("hint").textContent = CONFIG.hint;
  $("quoteText").textContent = CONFIG.quote;
  $("letterDate").textContent = new Date().toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"});
  buildGallery();
  setupNavigation();
  startHearts();
});

function show(id){
  screens.forEach(s => $(s).classList.add("hidden"));
  $(id).classList.remove("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
}

function setupNavigation(){
  $("openGift").addEventListener("click", async () => {
    $("giftWrap").style.animation = "giftOpen .7s forwards";
    burstHearts(18);
    setTimeout(()=>show("flowers"),650);
    playMusic();
  });

  $("continueFlower").addEventListener("click",()=>show("quote"));
  $("continueQuote").addEventListener("click",()=>show("lock"));
  $("continueGallery").addEventListener("click",()=>show("letter"));
  $("finalBtn").addEventListener("click",()=>{show("final");burstHearts(50)});
  $("replay").addEventListener("click",()=>show("home"));
  $("burst").addEventListener("click",()=>burstHearts(80));

  document.querySelectorAll(".keypad button[data-key]").forEach(btn=>{
    btn.addEventListener("click",()=>handlePin(btn.dataset.key));
  });
}

let pin = "";
function handlePin(key){
  if(key==="back"){pin=pin.slice(0,-1)}
  else if(pin.length<4){pin+=key}
  renderPin();
  if(pin.length===4){
    if(pin===CONFIG.pin){
      $("pinError").textContent="";
      setTimeout(()=>startLoading(),250);
    }else{
      $("pinError").textContent="Wrong code... try again ❤️";
      document.querySelector(".lock-screen").animate(
        [{transform:"translateX(-8px)"},{transform:"translateX(8px)"},{transform:"translateX(0)"}],
        {duration:220}
      );
      setTimeout(()=>{pin="";renderPin()},450);
    }
  }
}
function renderPin(){
  [...$("pinDots").children].forEach((dot,i)=>dot.classList.toggle("filled",i<pin.length));
}

function startLoading(){
  show("loading");
  let progress=0;
  const bar=$("progressBar");
  const text=$("loadingText");
  const messages=["Collecting little moments...","Finding our favorite memories...","Adding a little magic...","Almost there... ❤️"];
  const timer=setInterval(()=>{
    progress+=2;
    bar.style.width=progress+"%";
    text.textContent=messages[Math.min(messages.length-1,Math.floor(progress/25))];
    if(progress>=100){
      clearInterval(timer);
      setTimeout(()=>show("gallery"),500);
    }
  },45);
}

function buildGallery(){
  const captions=[
    "A beautiful moment,just the two of us.❤️",
    "Walking through life together,one moment at a time.❤",
    "You and me,looking perfect together.💕",
    "Wrapped in love,surrounded by a beautiful moment.✨",
    "Your smile makes every moment brighter.♡",
    "A moment I'll always want to remember.💕",
    "You looked beautiful,as always.✨",
    "A simple moment that became a beautiful memory.❤",
    "Some memories are meant to stay forever.💕"
  ];
  const grid=$("galleryGrid");
  for(let i=1;i<=9;i++){
    const card=document.createElement("div");
    card.className="photo-card";
    card.style.setProperty("--r",`${[-2,1,-1,2,-1.5,1.5,-2.5,.8,-1][i-1]}deg`);
    card.innerHTML=`<img src="assets/photos/photo${i}.jpg" alt="Our memory ${i}" onerror="this.src='data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="500" height="550"><rect width="100%" height="100%" fill="#f8e5e7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#b06a7b" font-family="sans-serif" font-size="24">Add photo${i}.jpg</text></svg>`)}'">`;
    card.innerHTML+=`<p>${captions[i-1]}</p>`;
    grid.appendChild(card);
  }
}

function burstHearts(count=20){
  const holder=$("hearts");
  for(let i=0;i<count;i++){
    const h=document.createElement("span");
    h.className="heart-particle";
    h.textContent=["❤","♥","♡","💕","✨"][Math.floor(Math.random()*5)];
    h.style.left=Math.random()*100+"vw";
    h.style.fontSize=(12+Math.random()*25)+"px";
    h.style.animationDuration=(3+Math.random()*4)+"s";
    h.style.animationDelay=Math.random()*.5+"s";
    holder.appendChild(h);
    setTimeout(()=>h.remove(),8000);
  }
}
function startHearts(){setInterval(()=>burstHearts(2),1200)}

function playMusic(){
  const m=$("music");
  m.volume=.35;
  m.play().catch(()=>{});
}
$("musicBtn").addEventListener("click",()=>{
  const m=$("music");
  if(m.paused){m.play().catch(()=>{});$("musicBtn").textContent="♫"}
  else{m.pause();$("musicBtn").textContent="🔇"}
});

const style=document.createElement("style");
style.textContent="@keyframes giftOpen{50%{transform:scale(1.15) rotate(-4deg)}100%{transform:scale(0) rotate(12deg);opacity:0}}";
document.head.appendChild(style);
