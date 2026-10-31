/* Lecteur vidéo en fenêtre : s'ouvre au clic sur n'importe quelle carte .hv-card (youtube-nocookie, chargé uniquement au clic). */
(function(){
'use strict';
var modal=document.getElementById('hvModal');if(!modal)return;
var frame=document.getElementById('hvFrame'),mt=document.getElementById('hvModalTitle'),ml=document.getElementById('hvModalLink'),cl=document.getElementById('hvClose'),last=null;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function openV(card){
 last=card;var id=card.getAttribute('data-vid');
 frame.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1" title="'+card.getAttribute('data-title').replace(/"/g,'&quot;')+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
 mt.textContent=card.getAttribute('data-title');ml.href='https://youtu.be/'+id;
 modal.hidden=false;document.body.classList.add('hv-lock');requestAnimationFrame(function(){modal.classList.add('open')});cl.focus();
}
function closeV(){
 modal.classList.remove('open');document.body.classList.remove('hv-lock');
 setTimeout(function(){modal.hidden=true;frame.innerHTML=''},reduce?0:250);
 if(last&&document.contains(last))last.focus();
}
document.addEventListener('click',function(e){var c=e.target.closest&&e.target.closest('.hv-card[data-vid]');if(!c)return;if(e.metaKey||e.ctrlKey||e.shiftKey||e.button===1)return;e.preventDefault();openV(c)});
cl.addEventListener('click',closeV);
modal.addEventListener('click',function(e){if(e.target===modal)closeV()});
document.addEventListener('keydown',function(e){if(modal.hidden)return;if(e.key==='Escape')closeV();if(e.key==='Tab'){var f=[cl,ml];var i=f.indexOf(document.activeElement);e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus()}});
})();
