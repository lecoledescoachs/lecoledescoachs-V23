(function(){
'use strict';
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduce)return;
// barre de progression de lecture
var bar=document.createElement('div');bar.className='lm-progress';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
var tick=false;
function upd(){tick=false;var h=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0)+')'}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();
// apparition en cascade des éléments d'une même rangée
var groups=new Map();
document.querySelectorAll('.reveal').forEach(function(el){var p=el.parentNode;if(!groups.has(p))groups.set(p,[]);groups.get(p).push(el)});
groups.forEach(function(list){if(list.length<2)return;list.forEach(function(el,i){el.style.transitionDelay=Math.min(i,5)*90+'ms'})});
// compteurs des chiffres clés
var nums=document.querySelectorAll('.chiffre-val');
if('IntersectionObserver' in window){
var io=new IntersectionObserver(function(es){es.forEach(function(e){
 if(!e.isIntersecting)return;io.unobserve(e.target);
 var el=e.target,t=el.textContent.trim(),m=t.match(/^(\d+)(\D*)$/);if(!m)return;
 var end=+m[1],suf=m[2],t0=performance.now(),d=1100;
 (function f(n){var k=Math.min(1,(n-t0)/d);k=1-Math.pow(1-k,3);el.textContent=Math.round(end*k)+suf;if(k<1)requestAnimationFrame(f);else el.textContent=t})(t0);
})},{threshold:.6});
nums.forEach(function(n){io.observe(n)});
}
// section "Pourquoi Orléans" : barres, points, anneaux et compteurs à l'entrée dans l'écran
var oxg=document.querySelector('.ox-grid');
if(oxg&&'IntersectionObserver' in window){
 var oxc=oxg.querySelectorAll('.ox-count');oxc.forEach(function(c){c.textContent='0'});
 oxg.classList.add('ox-ready');
 var oxo=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return;oxo.unobserve(e.target);
  var card=e.target;card.classList.add('ox-in');
  var del=(+card.style.getPropertyValue('--i')||0)*120+250;
  card.querySelectorAll('.ox-count').forEach(function(el){
   var end=+el.getAttribute('data-to'),t0=performance.now()+del,d=1400;
   (function f(n){var k=Math.max(0,Math.min(1,(n-t0)/d));k=1-Math.pow(1-k,3);el.textContent=Math.round(end*k);if(k<1)requestAnimationFrame(f);else el.textContent=end})(performance.now());
  });
 })},{threshold:.3});
 oxg.querySelectorAll('.ox-card').forEach(function(c){oxo.observe(c)});
}
})();
