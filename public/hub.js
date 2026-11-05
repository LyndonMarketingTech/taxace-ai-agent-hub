
(function(){
  'use strict';
  var root=document.documentElement;
  root.classList.remove('no-js'); root.classList.add('js');
  var allowed=['dashboard','margine','newella','vidora','webtrix'];
  var titles={dashboard:'TaxAce AI Agent Hub',margine:'MarGine User Guide',newella:'Newella User Guide',vidora:'Vidora User Guide',webtrix:'Webtrix User Guide'};
  var views=Array.prototype.slice.call(document.querySelectorAll('[data-view]'));
  var navs=Array.prototype.slice.call(document.querySelectorAll('.nav-link[data-route]'));
  var live=document.getElementById('view-live');
  var deliberate=false;

  function routeFromHash(){
    var key=location.hash.replace(/^#/,'').toLowerCase();
    if(allowed.indexOf(key)===-1){
      key='dashboard';
      if(location.hash!=='#dashboard') history.replaceState(null,'','#dashboard');
    }
    return key;
  }

  function activate(key,opts){
    opts=opts||{};
    views.forEach(function(section){ section.hidden=section.getAttribute('data-view')!==key; });
    navs.forEach(function(link){
      var active=link.getAttribute('data-route')===key;
      if(active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
    });
    document.title=titles[key]+' | TaxAce';
    if(live) live.textContent=titles[key]+' view active';
    var activeView=document.querySelector('[data-view="'+key+'"]');
    var heading=activeView ? activeView.querySelector('h1') : null;
    if(opts.scrollTop){ window.scrollTo({top:0,left:0,behavior:'auto'}); }
    if(opts.focus && heading){
      window.setTimeout(function(){ try{ heading.focus({preventScroll:!opts.scrollTop}); }catch(e){ heading.focus(); } },0);
    }
  }

  document.addEventListener('click',function(event){
    var link=event.target.closest('a[data-route]');
    if(!link) return;
    var key=link.getAttribute('data-route');
    if(allowed.indexOf(key)===-1) return;
    event.preventDefault();
    deliberate=true;
    var next='#'+key;
    if(location.hash===next){ activate(key,{scrollTop:true,focus:true}); deliberate=false; }
    else location.hash=next;
  });

  window.addEventListener('hashchange',function(){
    var wasDeliberate=deliberate;
    deliberate=false;
    activate(routeFromHash(),{scrollTop:wasDeliberate,focus:true});
  });

  activate(routeFromHash(),{scrollTop:false,focus:false});
})();
