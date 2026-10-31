/* Rappel discret "Garde-nous sous la main" : favoris (ordinateur), écran d'accueil (mobile). Une seule fois, jamais avec les autres bulles. */
(function(){
'use strict';
var W=window,d=document,KEY='favNudge',PV='favNudgePV';
function get(k){try{return W.localStorage.getItem(k)}catch(e){return null}}
function set(k,v){try{W.localStorage.setItem(k,v)}catch(e){}}
var force=W.__favForce===true;
/* mesure anonyme, uniquement si les cookies statistiques ont été acceptés */
function track(n,x){try{if(get('leco-cookie-consent')==='accepted'&&typeof W.gtag==='function')W.gtag('event',n,{page_path:location.pathname,device:(/Mobi|Android|iPhone/i.test(navigator.userAgent)?'mobile':'ordinateur'),method:x||''})}catch(e){}}
if(!force){
 if(get(KEY))return;
 if(/bot|crawl|spider|slurp|lighthouse|headless|pagespeed|gtmetrix|preview/i.test(navigator.userAgent))return;
 if(W.matchMedia&&W.matchMedia('(display-mode: standalone)').matches)return;
 if(navigator.standalone)return;
}
var ua=navigator.userAgent,ios=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),
    android=/Android/i.test(ua),mac=/Mac/i.test(navigator.platform)&&!ios,mobile=ios||android||W.innerWidth<700,
    dp=null,el=null,shown=false,t0=Date.now();
W.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e});
var pv=parseInt(get(PV)||'0',10)+1;set(PV,String(pv));
var delay=force?300:(pv>=2?12000:45000);
function busy(){
 var b=d.getElementById('leco-cookie-banner');if(b&&b.classList.contains('show'))return true;
 if(d.documentElement.classList.contains('ld-on')||W.__ldHold)return true;
 var s=d.querySelector('.sp-notif');if(s&&parseFloat(getComputedStyle(s).opacity)>.05)return true;
 if(d.body.classList.contains('hv-lock'))return true;
 var m=d.getElementById('hvModal');if(m&&!m.hidden)return true;
 return false;
}
function close(remember,why){if(!el)return;track(why||'fav_nudge_close');var e=el;el=null;shown=false;e.classList.remove('on');setTimeout(function(){if(e.parentNode)e.parentNode.removeChild(e)},400);if(remember)set(KEY,String(Date.now()))}
function build(){
 var key=mac?'⌘ + D':'Ctrl + D',msg,btn='';
 if(mobile&&ios)msg='Appuie sur <b>Partager</b>, puis <b>Sur l’écran d’accueil</b>.';
 else if(mobile&&dp){msg='Retrouve-nous en un geste, comme une appli.';btn='<button type="button" class="fvn-go">Ajouter</button>'}
 else if(mobile)msg='Ouvre le menu du navigateur, puis <b>Ajouter à l’écran d’accueil</b>.';
 else msg='Appuie sur <kbd>'+key.replace(' + ','</kbd><kbd>')+'</kbd> pour nous ajouter à tes favoris.';
 var n=d.createElement('div');n.className='fvn';n.setAttribute('role','status');
 n.innerHTML='<span class="fvn-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z"/></svg></span><span class="fvn-tx"><b>Garde L’École des Coachs sous la main</b><span>'+msg+'</span></span>'+btn+'<button type="button" class="fvn-x" aria-label="Fermer">×</button>';
 return n;
}
function show(){
 if(shown)return;shown=true;el=build();d.body.appendChild(el);track('fav_nudge_view',ios?'ios':android?'android':'bureau');
 el.querySelector('.fvn-x').addEventListener('click',function(){close(true)});
 var g=el.querySelector('.fvn-go');if(g)g.addEventListener('click',function(){track('fav_nudge_add','install');try{dp.prompt();dp.userChoice.then(function(){close(true,'fav_nudge_done')})}catch(e){close(true,'fav_nudge_done')}});
 requestAnimationFrame(function(){requestAnimationFrame(function(){if(el)el.classList.add('on')})});
 setTimeout(function(){if(el)close(true,'fav_nudge_timeout')},16000);
}
var iv=setInterval(function(){
 if(d.hidden)return;
 if(!shown){if(Date.now()-t0>=delay&&!busy()){clearInterval(iv);show()}}
},1500);
W.__favShow=function(){show()};
})();
