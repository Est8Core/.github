// ── UTILITIES ──────────────────────────────────────────────────
var _uid=0; function uid(){return 'id'+(++_uid);}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function fmt(n){return Number(n||0).toLocaleString('ar-SA');}
function fmtMoney(n){var v=Number(n||0);return v>=1000000?(v/1000000).toFixed(1)+'م':v>=1000?(v/1000).toFixed(0)+'ألف':fmt(v);}
function fmtDate(d){if(!d)return'—';var p=d.split('-');if(p.length<3)return d;var ms=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];return p[2]+' '+ms[parseInt(p[1])-1]+' '+p[0];}
function fmtPhone(p){return String(p||'').replace(/(\d{3})(\d{3})(\d{4})/,'$1 $2 $3');}
function initials(n){var w=(n||'').trim().split(/\s+/);return w.length>=2?w[0][0]+w[1][0]:w[0]?w[0][0]:'?';}
function pct(a,b){return b?Math.min(100,Math.round(a/b*100)):0;}
function clamPct(n){return Math.min(100,Math.max(0,n));}

// Score helpers
function scoreCls(n){return n>=80?'text-gr':n>=60?'text-am':n>=40?'text-b2':'text-rd';}
function scoreBg(n){return n>=80?'bg-gr/15 border-gr/30':n>=60?'bg-am/10 border-am/25':n>=40?'bg-b2/10 border-b2/25':'bg-rd/10 border-rd/25';}
function scoreLabel(n){return n>=80?'ساخن جداً':n>=60?'دافئ':n>=40?'متوسط':'بارد';}
function scoreDot(n){return n>=80?'bg-gr':n>=60?'bg-am':n>=40?'bg-b2':'bg-rd';}

// Activity helpers
function actIcon(t){var m={call:'phone',viewing:'home',meeting:'users',email:'mail',task:'check-square',note:'file-text',whatsapp:'message-circle'};return m[t]||'circle';}
function actColor(t){var m={call:'text-br',viewing:'text-vi',meeting:'text-am',email:'text-b2',task:'text-gr',note:'text-mut',whatsapp:'text-green-400'};return m[t]||'text-mut';}
function actBg(t){var m={call:'bg-br/15',viewing:'bg-vi/15',meeting:'bg-am/15',email:'bg-b2/15',task:'bg-gr/15',note:'bg-sf2',whatsapp:'bg-wa/15'};return m[t]||'bg-sf2';}
function actLabel(t){var m={call:'اتصال',viewing:'معاينة',meeting:'اجتماع',email:'بريد إلكتروني',task:'مهمة',note:'ملاحظة',whatsapp:'واتساب'};return m[t]||t;}

// Role helpers
function roleLabel(r){var m={owner:'مالك / مدير عام',branch_manager:'مدير فرع',team_leader:'قائد فريق',sales_agent:'وكيل مبيعات'};return m[r]||r;}
function roleCls(r){var m={owner:'bg-vi/10 text-vi border-vi/20',branch_manager:'bg-am/10 text-yellow-300 border-am/20',team_leader:'bg-b2/10 text-b2 border-b2/20',sales_agent:'bg-gr/10 text-gr border-gr/20'};return TAG+' '+(m[r]||'bg-sf2 text-mut border-ln');}

// Stage helpers
function stageColor(s){var hot=['تفاوض','توقيع عقد','إغلاق'];var ok=['مكتمل'];var bad=['خسارة'];
  return ok.includes(s)?'text-gr':bad.includes(s)?'text-rd':hot.includes(s)?'text-am':'text-br';}
function stageKanbanCols(){return['جديد','تأهيل','عرض','تفاوض','توقيع عقد','إغلاق','مكتمل'];}

// Lead stage order
var LEAD_STAGES=['جديد','تأهيل','عرض','تفاوض','إغلاق','خسارة'];

// ── TOAST ──────────────────────────────────────────────────────
function toast(msg,type){
  var el=document.getElementById('toastZone');if(!el)return;
  var cls=type==='ok'?TOAST_OK:type==='err'?TOAST_ERR:TOAST_INFO;
  var ico=type==='ok'?'check-circle':type==='err'?'x-circle':'info';
  var id='t'+uid();
  var d=document.createElement('div');
  d.id=id; d.className=cls+' transition-all duration-300';
  d.style.cssText='animation:toastIn .25s ease;';
  d.innerHTML='<i data-lucide="'+ico+'" class="w-4 h-4 flex-shrink-0"></i><span>'+esc(msg)+'</span>';
  el.appendChild(d); lucide.createIcons();
  setTimeout(function(){d.style.opacity='0';d.style.transform='translateY(10px)';setTimeout(function(){d.remove();},300);},3200);
}

// ── MODAL ──────────────────────────────────────────────────────
function openModal(id){
  var m=document.getElementById(id||'globalModal');if(!m)return;
  m.style.opacity='1'; m.style.visibility='visible';
  var box=m.querySelector('[data-mbox]');
  if(box){box.style.transform='scale(1)';box.style.opacity='1';}
}
function closeModal(id){
  var m=document.getElementById(id||'globalModal');if(!m)return;
  m.style.opacity='0'; m.style.visibility='hidden';
  var box=m.querySelector('[data-mbox]');
  if(box){box.style.transform='scale(.95)';box.style.opacity='0';}
}
function showModal(title,body,footerHtml){
  var m=document.getElementById('globalModal');if(!m)return;
  var t=m.querySelector('#modalTitle');var b=m.querySelector('#modalBody');var f=m.querySelector('#modalFooter');
  if(t)t.textContent=title||'';
  if(b)b.innerHTML=body||'';
  if(f)f.innerHTML=footerHtml||'';
  lucide.createIcons();
  openModal('globalModal');
}
function confirmDel(title,msg,onOkId){
  showModal(title,
    '<div class="flex flex-col items-center gap-3 py-2"><div class="w-12 h-12 rounded-full bg-rd/15 border border-rd/30 grid place-items-center"><i data-lucide="trash-2" class="w-5 h-5 text-rd"></i></div><p class="text-[13.5px] text-mut text-center">'+esc(msg)+'</p></div>',
    '<button class="'+BTN_DANGER+'" onclick="window[\'_confirmOk_\']()">تأكيد الحذف</button><button class="'+BTN+'" onclick="closeModal()">إلغاء</button>'
  );
  window['_confirmOk_']=function(){onOkId&&window[onOkId]&&window[onOkId]();closeModal();};
}

// ── DRAWER ─────────────────────────────────────────────────────
var _drOpen=false;
function _syncOv(){
  var ov=document.getElementById('overlay');
  if(ov){ov.style.opacity=_drOpen?'1':'0';ov.style.visibility=_drOpen?'visible':'hidden';}
}
function openDrawer(title,html){
  var dr=document.getElementById('sideDrawer');if(!dr)return;
  var t=dr.querySelector('#drawerTitle');var b=dr.querySelector('#drawerBody');
  if(t)t.textContent=title||'';
  if(b){b.innerHTML=html||'';lucide.createIcons();}
  dr.style.transform='translateX(0)'; dr.style.pointerEvents='auto'; _drOpen=true; _syncOv();
}
function closeDrawer(){
  var dr=document.getElementById('sideDrawer');if(!dr)return;
  dr.style.transform='translateX(-110%)'; dr.style.pointerEvents='none'; _drOpen=false; _syncOv();
}

// ── NOTIFICATIONS DROPDOWN ─────────────────────────────────────
var _ndOpen=false;
function toggleNDrop(){_ndOpen=!_ndOpen;renderNDrop();}
function closeNDrop(){_ndOpen=false;var d=document.getElementById('nDrop');if(d){d.style.opacity='0';d.style.visibility='hidden';}}
function markAllRead(){S.notifs.forEach(function(n){n.read=true;});renderNDrop();updateBadges();}
function renderNDropList(){
  return S.notifs.slice(0,6).map(function(n){
    var ic=n.type==='lead'?'user-plus':n.type==='activity'?'calendar':n.type==='deal'?'trending-up':n.type==='msg'?'message-circle':n.type==='billing'?'credit-card':'bell';
    var cls=n.read?NOTIF_ROW:NOTIF_UNREAD;
    return '<div class="'+cls+'"><div class="w-7 h-7 rounded-full '+(n.read?'bg-sf2':'bg-br/15')+' border border-ln grid place-items-center flex-shrink-0"><i data-lucide="'+ic+'" class="w-3.5 h-3.5 '+(n.read?'text-mut':'text-br')+'"></i></div><div class="flex-1 min-w-0"><p class="text-[12px] font-bold text-ink leading-snug truncate">'+esc(n.title)+'</p><p class="text-[11px] text-mut truncate">'+esc(n.body)+'</p><p class="text-[10.5px] text-fnt mt-[2px]">'+esc(n.time)+'</p></div></div>';
  }).join('');
}
function renderNDrop(){
  var d=document.getElementById('nDrop');if(!d)return;
  var unread=S.notifs.filter(function(n){return!n.read;}).length;
  d.innerHTML='<div class="flex items-center justify-between px-3 py-2.5 border-b border-ln"><p class="text-[12.5px] font-extrabold text-ink">الإشعارات</p>'+(unread?'<button class="text-[11px] text-br hover:underline font-bold" onclick="markAllRead()">تحديد الكل مقروء</button>':'')+'</div>'+renderNDropList()+'<div class="px-3 py-2.5 border-t border-ln text-center"><button class="text-[11.5px] text-br hover:underline font-semibold" onclick="closeNDrop();switchView(\'notifs\')">عرض كل الإشعارات</button></div>';
  lucide.createIcons();
  if(_ndOpen){d.style.opacity='1';d.style.visibility='visible';}else{d.style.opacity='0';d.style.visibility='hidden';}
}

// ── VIEW ENGINE ────────────────────────────────────────────────
var CUR_VIEW='dash';
var PREV_VIEW='dash';
var VIEW_PARAM=null;

function switchView(v,param){
  if(v!==CUR_VIEW)PREV_VIEW=CUR_VIEW;
  CUR_VIEW=v; VIEW_PARAM=param||null;
  renderApp(); closeNDrop();
}
function goBack(){switchView(PREV_VIEW);}

function updateBadges(){
  var unread=S.notifs.filter(function(n){return!n.read;}).length;
  var overdue=S.activities.filter(function(a){return a.status==='متأخر';}).length;
  var unreadMsgs=S.conversations.reduce(function(s,c){return s+c.unread;},0);
  NAV_DEF.forEach(function(ni){
    if(!ni.id)return;
    var el=document.getElementById('badge_'+ni.id);if(!el)return;
    var val=ni.badge==='notifs'?unread:ni.badge==='leads'?S.leads.length:ni.badge==='deals'?S.deals.length:ni.badge==='activities'?overdue:ni.badge==='msgs'?unreadMsgs:0;
    if(val>0){el.textContent=val>99?'99+':val;el.style.display='';}else{el.style.display='none';}
  });
  var nb=document.getElementById('navNotifBubble');
  if(nb){nb.textContent=unread;nb.style.display=unread?'':'none';}
}

// ── NAV BUILD ──────────────────────────────────────────────────
function buildNav(){
  return NAV_DEF.map(function(ni){
    if(ni.sep)return'<div class="h-px bg-ln/50 mx-2 my-1"></div>';
    var on=CUR_VIEW===ni.id||CUR_VIEW===(ni.id+'Detail');
    var cls=on?NI_ON:NI;
    var badgeCls=on?NI_BX_ON:NI_BX;
    return'<button class="'+cls+'" onclick="switchView(\''+ni.id+'\')"><i data-lucide="'+ni.icon+'" class="w-[15px] h-[15px] flex-shrink-0"></i><span class="flex-1">'+ni.label+'</span>'+(ni.badge?'<span id="badge_'+ni.id+'" class="'+badgeCls+'" style="display:none">0</span>':'')+'</button>';
  }).join('');
}

// ── FORM HELPERS ───────────────────────────────────────────────
function fld(label,id,type,val,opts){
  var extra='';
  if(type==='select'){
    extra='<select id="'+id+'" class="'+IPT+'" onchange="window._fldChange&&_fldChange(\''+id+'\',this.value)">';
    (opts||[]).forEach(function(o){var v=typeof o==='object'?o.v:o;var l=typeof o==='object'?o.l:o;extra+='<option value="'+esc(v)+'"'+(v==val?' selected':'')+'>'+esc(l)+'</option>';});
    extra+='</select>';
  }else if(type==='textarea'){
    extra='<textarea id="'+id+'" rows="3" class="'+IPT+' resize-none" placeholder="'+(opts&&opts.ph||'')+'">'+esc(val||'')+'</textarea>';
  }else{
    extra='<input id="'+id+'" type="'+(type||'text')+'" class="'+IPT+'" value="'+esc(val||'')+'" placeholder="'+(opts&&opts.ph||'')+'">';
  }
  return'<div class="'+FLD+'"><label class="'+FLD_LABEL+'">'+esc(label)+'</label>'+extra+'</div>';
}
function fldVal(id){var el=document.getElementById(id);return el?el.value:'';}
function fldSet(id,v){var el=document.getElementById(id);if(el)el.value=v;}

// ── SEARCH / FILTER ────────────────────────────────────────────
var _filters={};
function setFilter(key,val){_filters[key]=val;renderMain();}
function getFilter(key){return _filters[key]||'';}

// ── RENDER ENGINE ──────────────────────────────────────────────
function renderMain(){
  var el=document.getElementById('mainContent');if(!el)return;
  var fn=VIEWS[CUR_VIEW]||(VIEWS[CUR_VIEW.replace('Detail','Detail')]);
  if(fn){el.innerHTML=fn(VIEW_PARAM);lucide.createIcons();}
  else{el.innerHTML='<div class="flex flex-col items-center justify-center h-60 gap-2 text-mut"><i data-lucide="construction" class="w-10 h-10 opacity-40"></i><p class="text-[13px]">قيد الإنشاء</p></div>';lucide.createIcons();}
}

function renderApp(){
  // Update nav
  var navEl=document.getElementById('navItems');
  if(navEl){navEl.innerHTML=buildNav();lucide.createIcons();}
  // Update title
  var titleEl=document.getElementById('pageTitle');
  if(titleEl){titleEl.textContent=TITLES[CUR_VIEW]||CUR_VIEW;}
  // Render main
  renderMain();
  updateBadges();
}
