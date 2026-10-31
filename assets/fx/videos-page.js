/* Section vidéos de la page Actualités : filtres par catégorie. Liens directs : #videos (toutes), #videos-podcast, #videos-conferences, #videos-evenements, #videos-apres-cqp-if, #videos-conseils, #videos-ecole. */
(function(){
'use strict';
var chips=[].slice.call(document.querySelectorAll('.hv-chip')),cards=[].slice.call(document.querySelectorAll('#hvpGrid .hv-card')),count=document.getElementById('hvCount');
if(!chips.length||!cards.length)return;
function slugFromHash(){var h=(location.hash||'').replace('#','');return h.indexOf('videos-')===0?h.slice(7):''}
function apply(slug,push){
 var chip=chips.filter(function(c){return (c.getAttribute('data-slug')||'')===slug})[0]||chips[0];
 var f=chip.getAttribute('data-f'),n=0;
 chips.forEach(function(c){c.classList.toggle('on',c===chip)});
 cards.forEach(function(c){var ok=f==='all'||c.getAttribute('data-cat')===f;c.hidden=!ok;if(ok)n++});
 if(count)count.textContent=n+(n>1?' vidéos':' vidéo');
 if(push&&history.replaceState)history.replaceState(null,'',slug?'#videos-'+slug:'#videos');
}
chips.forEach(function(c){c.addEventListener('click',function(){apply(c.getAttribute('data-slug')||'',true)})});
apply(slugFromHash(),false);
window.addEventListener('hashchange',function(){apply(slugFromHash(),false);var s=document.getElementById('videos');if(s&&(location.hash||'').indexOf('#videos')===0)s.scrollIntoView()});
if((location.hash||'').indexOf('#videos-')===0){setTimeout(function(){var s=document.getElementById('videos');if(s)s.scrollIntoView()},400)}
})();
