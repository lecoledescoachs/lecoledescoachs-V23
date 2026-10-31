/* Rail de vidéos de l'accueil : défilement continu (boucle sans fin), pause au survol, glisser, flèches, filtres. */
(function(){
'use strict';
var rail=document.getElementById('hvRail'),track=document.getElementById('hvTrack');
if(!rail||!track)return;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var origs=[].slice.call(track.querySelectorAll('.hv-card'));
var prev=document.getElementById('hvPrev'),next=document.getElementById('hvNext'),count=document.getElementById('hvCount');
var chips=[].slice.call(document.querySelectorAll('.hv-chip'));
var anchor=document.querySelector('.hv-chips')||document.querySelector('.hv-head');
var SPEED=44;                 // pixels par seconde
var W=0,pos=0,pad=0,loop=false,hover=false,drag=false,focused=false,visible=true,tween=null,last=0,resumeAt=0;
function padLeft(){return anchor?anchor.getBoundingClientRect().left-rail.getBoundingClientRect().left:40}
function clearClones(){[].slice.call(track.querySelectorAll('.hv-clone')).forEach(function(n){n.remove()})}
function setCount(n){if(count)count.textContent=n+(n>1?' contenus':' contenu')}
if(reduce){ // mode natif : défilement manuel, sans animation automatique
 rail.classList.add('hv-native');
 function step(){return Math.max(280,Math.round(rail.clientWidth*.8))}
 function upd(){var m=rail.scrollWidth-rail.clientWidth-4;if(prev)prev.disabled=rail.scrollLeft<=4;if(next)next.disabled=rail.scrollLeft>=m}
 if(prev)prev.addEventListener('click',function(){rail.scrollBy({left:-step()})});
 if(next)next.addEventListener('click',function(){rail.scrollBy({left:step()})});
 rail.addEventListener('scroll',upd,{passive:true});
 chips.forEach(function(ch){ch.addEventListener('click',function(){
  chips.forEach(function(c){c.classList.toggle('on',c===ch)});var f=ch.getAttribute('data-f'),n=0;
  origs.forEach(function(c){var ok=f==='all'||c.getAttribute('data-cat')===f;c.hidden=!ok;if(ok)n++});setCount(n);rail.scrollTo({left:0});upd();
 })});
 upd();return;
}
rail.classList.add('hv-auto');
function clone(c){var k=c.cloneNode(true);k.classList.add('hv-clone');k.setAttribute('aria-hidden','true');k.setAttribute('tabindex','-1');return k}
function build(){
 clearClones();pad=padLeft();
 var vis=origs.filter(function(c){return !c.hidden});
 if(!vis.length){W=0;loop=false;return}
 var gap=parseFloat(getComputedStyle(track).columnGap||getComputedStyle(track).gap)||18;
 W=vis.reduce(function(a,c){return a+c.offsetWidth+gap},0);
 loop=W>rail.clientWidth+40;
 if(loop){
  var first=vis[0],i;
  vis.forEach(function(c){track.insertBefore(clone(c),first)});
  vis.forEach(function(c){track.appendChild(clone(c))});
 }
 pos=0;apply();
 if(prev)prev.disabled=!loop;if(next)next.disabled=!loop;
}
function apply(){
 if(loop){track.style.transform='translate3d('+(pad-W-pos)+'px,0,0)'}
 else{track.style.transform='translate3d('+pad+'px,0,0)'}
}
function norm(p){return W?((p%W)+W)%W:0}
function frame(t){
 var dt=Math.min(.05,(t-last)/1000);last=t;
 if(loop&&visible&&!hover&&!drag&&!focused&&!tween&&t>=resumeAt&&!document.body.classList.contains('hv-lock')){pos=norm(pos+SPEED*dt);apply()}
 requestAnimationFrame(frame);
}
function slide(d){
 if(!loop)return;var from=pos,to=pos+d*Math.max(300,Math.round(rail.clientWidth*.7)),t0=performance.now(),dur=550;
 tween=true;(function f(n){var k=Math.min(1,(n-t0)/dur);k=1-Math.pow(1-k,3);pos=norm(from+(to-from)*k);apply();if(k<1)requestAnimationFrame(f);else{tween=null;resumeAt=performance.now()+1500}})(t0);
}
if(prev)prev.addEventListener('click',function(){slide(-1)});
if(next)next.addEventListener('click',function(){slide(1)});
rail.addEventListener('mouseenter',function(){hover=true});
rail.addEventListener('mouseleave',function(){hover=false});
rail.addEventListener('focusin',function(){focused=true});
rail.addEventListener('focusout',function(){focused=false});
// glisser (souris, doigt, stylet)
var sx=0,sp=0,moved=false,pid=null;
rail.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button!==0)return;if(!loop)return;drag=true;moved=false;sx=e.clientX;sp=pos;pid=e.pointerId});
window.addEventListener('pointermove',function(e){if(!drag||e.pointerId!==pid)return;var dx=e.clientX-sx;if(Math.abs(dx)>6){moved=true;rail.classList.add('drag')}if(moved){pos=norm(sp-dx);apply()}});
function endDrag(){if(!drag)return;drag=false;rail.classList.remove('drag');resumeAt=performance.now()+(moved?1800:300)}
window.addEventListener('pointerup',endDrag);window.addEventListener('pointercancel',endDrag);
rail.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
// filtres
chips.forEach(function(ch){ch.addEventListener('click',function(){
 chips.forEach(function(c){c.classList.toggle('on',c===ch)});
 var f=ch.getAttribute('data-f'),n=0;
 origs.forEach(function(c){var ok=f==='all'||c.getAttribute('data-cat')===f;c.hidden=!ok;if(ok)n++});
 setCount(n);build();
})});
// ne tourne que si la section est à l'écran
// le rail (et ses copies pour la boucle) n'est construit qu'à l'approche de la section : la page d'accueil se charge plus vite
var built=false;
function ensure(){if(built)return;built=true;build();requestAnimationFrame(function(t){last=t;frame(t)})}
if('IntersectionObserver' in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(visible)ensure()},{rootMargin:'600px 0px'}).observe(rail)}else{ensure()}
var rz;window.addEventListener('resize',function(){if(!built)return;clearTimeout(rz);rz=setTimeout(build,150)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(built)build()});
})();
