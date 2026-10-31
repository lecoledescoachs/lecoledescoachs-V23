/* Animations Prépa TEP. Aucune action si l'utilisateur demande moins de mouvement. */
(function(){
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var d=document,root=d.documentElement;root.classList.add('pm-on');
function $(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}

/* 1. Barre de progression */
var bar=d.createElement('div');bar.className='pm-progress';d.body.appendChild(bar);

/* 2. Hero : lueurs, projecteur, titre mot par mot */
var hero=d.querySelector('.hero');
if(hero){
  ['o1','o2'].forEach(function(c){var o=d.createElement('div');o.className='pm-orb '+c;hero.insertBefore(o,hero.firstChild)});
  var sp=d.createElement('div');sp.className='pm-spot-hero';hero.insertBefore(sp,hero.firstChild);
  hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();hero.style.setProperty('--mx',(e.clientX-r.left)+'px');hero.style.setProperty('--my',(e.clientY-r.top)+'px')});
  var t=hero.querySelector('.hero-title');
  if(t){
    var i=0;
    (function walk(n){
      Array.prototype.slice.call(n.childNodes).forEach(function(c){
        if(c.nodeType===3){
          var parts=c.textContent.replace(/^[ \n\t]+|[ \n\t]+$/g,function(m){return m.length&&n===t?'':' '}).split(/([ \n\t]+)/),f=d.createDocumentFragment();
          parts.forEach(function(p){
            if(!p)return;
            if(/^[ \n\t]+$/.test(p)){f.appendChild(d.createTextNode(' '));return}
            var w=d.createElement('span');w.className='pm-w';var wi=d.createElement('span');wi.className='pm-wi';wi.style.setProperty('--i',i++);wi.textContent=p;w.appendChild(wi);f.appendChild(w);
          });
          n.replaceChild(f,c);
        }else if(c.nodeType===1&&c.tagName!=='BR'&&c.tagName!=='SUP'){walk(c)}
      });
    })(t);
  }
  var badge=hero.querySelector('div[style*="Garantie"],div[style*="rgba(110,231,183"]');if(badge)badge.classList.add('pm-badge');
  /* cadre de droite : liste en cascade */
  $('.price-feature',hero).forEach(function(el,k){el.classList.add('pm-st','pm-r');el.style.setProperty('--pm-d',(900+k*110)+'ms');requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add('pm-in')})})});
}

/* 3. Titres de section */
$('.section-title,.tep-gains-title').forEach(function(el){el.classList.add('pm-title')});

/* 4. Cascades */
var groups=[
 ['.echec-grid','.echec-card',''],
 ['.tep-exercises','.tep-ex',''],
 ['.tep-offres-grid','.tep-offer-card',''],
 ['.programme-list','.programme-item','pm-l'],
 ['.tep-gains-list','li',''],
 ['.chiffres-grid','.chiffre-cell',''],
 ['.process-row','',''],
];
var targets=[];
$('.programme-list .programme-item').forEach(function(el,k){el.classList.add('pm-st',k%2?'pm-r':'pm-l');el.style.setProperty('--pm-d','0ms');targets.push(el)});
$('.echec-grid .echec-card').forEach(function(el,k){el.classList.add('pm-st');el.style.setProperty('--pm-d',(k%2)*140+'ms');targets.push(el)});
$('.tep-exercises .tep-ex').forEach(function(el,k){el.classList.add('pm-st');el.style.setProperty('--pm-d',(k%3)*110+'ms');targets.push(el)});
$('.tep-offres-grid .tep-offer-card').forEach(function(el,k){el.classList.add('pm-st');el.style.setProperty('--pm-d',k*130+'ms');targets.push(el)});
$('.tep-gains-list li').forEach(function(el,k){el.classList.add('pm-st','pm-l');el.style.setProperty('--pm-d',k*110+'ms');targets.push(el)});
$('.process-row').forEach(function(el,k){el.classList.add('pm-st');el.style.setProperty('--pm-d','0ms');targets.push(el)});
$('.chiffre-cell').forEach(function(el,k){el.classList.add('pm-st');el.style.setProperty('--pm-d',k*140+'ms');targets.push(el)});
$('.echec-keys>div').forEach(function(el,k){el.classList.add('pm-st');el.style.setProperty('--pm-d',k*110+'ms');targets.push(el)});
$('.geo-dl>div').forEach(function(el,k){el.classList.add('pm-st');el.style.setProperty('--pm-d',(k%2)*120+'ms');targets.push(el)});
$('.faq-item').slice(0,8).forEach(function(el,k){el.classList.add('pm-st');el.style.setProperty('--pm-d',k*60+'ms');targets.push(el)});

/* Projecteur sur les cartes */
$('.echec-card,.tep-offer-card,.tep-ex,.programme-item').forEach(function(el){
  el.classList.add('pm-spot');
  el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px')});
});

/* 5. Compteurs */
function countUp(el){
  var txt=el.textContent.trim(),m=txt.match(/^(\d+)(.*)$/);if(!m)return;
  var end=parseInt(m[1],10),suf=m[2],t0=null,dur=1300;
  function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(end*e)+suf;if(p<1)requestAnimationFrame(step);else el.textContent=txt}
  el.textContent='0'+suf;requestAnimationFrame(step);
}
var counters=$('.tep-offer-price .amount,.chiffre-val');
var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){cio.unobserve(e.target);setTimeout(function(){countUp(e.target)},200)}})},{threshold:.6});
counters.forEach(function(el){cio.observe(el)});

/* 6. Observation générale */
var io=new IntersectionObserver(function(es){es.forEach(function(e){
  if(e.isIntersecting){var el=e.target;el.classList.add('pm-in');io.unobserve(el);
    if(el.classList.contains('pm-st'))setTimeout(function(){el.classList.add('pm-done')},1600);}
})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
targets.forEach(function(el){io.observe(el)});
$('.pm-title').forEach(function(el){io.observe(el)});

/* 7. Boutons : reflet + magnétisme */
$('.btn,.tep-offer-btn,.tep-triage-btn').forEach(function(b){
  b.classList.add('pm-btn');
  b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/r.width,y=(e.clientY-r.top-r.height/2)/r.height;b.style.transform='translate('+(x*8).toFixed(1)+'px,'+(y*6).toFixed(1)+'px)'});
  b.addEventListener('pointerleave',function(){b.style.transform=''});
});

/* 8. Défilement : progression + léger parallaxe du hero */
var tick=false;
function onScroll(){
  if(tick)return;tick=true;
  requestAnimationFrame(function(){
    var h=d.documentElement.scrollHeight-innerHeight,y=window.scrollY||0;
    bar.style.transform='scaleX('+(h>0?Math.min(y/h,1):0).toFixed(4)+')';
    if(hero){var c=hero.querySelector('.hero-title');if(c&&y<innerHeight){c.style.translate='0 '+(y*.12).toFixed(1)+'px'}}
    tick=false;
  });
}
addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
