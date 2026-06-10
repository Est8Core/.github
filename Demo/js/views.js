// ── VIEWS OBJECT ──────────────────────────────────────────────
var VIEWS={};

// ── HELPERS ────────────────────────────────────────────────────
function hdr(title,actions){
  return'<div class="flex items-center justify-between mb-4 gap-3"><h2 class="text-[15px] font-extrabold text-ink">'+esc(title)+'</h2><div class="flex items-center gap-2">'+( actions||'')+'</div></div>';
}
function empty(msg,ico){
  return'<div class="flex flex-col items-center justify-center h-44 gap-2.5 text-mut"><i data-lucide="'+(ico||'inbox')+'" class="w-10 h-10 opacity-30"></i><p class="text-[13px] font-semibold">'+esc(msg)+'</p></div>';
}
function kpiCard(label,val,sub,color,icon,pct2){
  var c=color||'#4f8cff';
  return'<div class="'+KPI+'" style="--ac:'+c+'"><div class="flex items-start justify-between"><div><p class="text-[11px] font-bold text-mut mb-1">'+esc(label)+'</p><div class="kv-color" style="--ac:'+c+'">'+esc(val)+'</div>'+(sub?'<p class="text-[11.5px] text-mut mt-0.5">'+esc(sub)+'</p>':'')+'</div><div class="w-9 h-9 rounded-lg grid place-items-center" style="background:'+c+'20;border:1px solid '+c+'30"><i data-lucide="'+icon+'" class="w-4 h-4" style="color:'+c+'"></i></div></div>'+(pct2!==undefined?'<div class="'+PBAR+' mt-2"><div class="'+PB+'" style="width:'+pct2+'%;background:'+c+'"></div></div>':'')+'</div>';
}
function propPhotoBox(p){
  var cnt=p.photos||0;
  return'<div class="aspect-[16/9] bg-gradient-to-br from-sf2 to-bg rounded-xl overflow-hidden relative flex items-center justify-center mb-3"><div class="flex flex-col items-center gap-1 text-mut"><i data-lucide="image" class="w-8 h-8 opacity-40"></i><p class="text-[11.5px] font-bold opacity-60">'+cnt+' صورة</p></div>'+(p.status==='مباع'?'<div class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-gr text-[#06121f]">مباع</div>':p.status==='محجوز'?'<div class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-am text-[#06121f]">محجوز</div>':'')+'</div>';
}
function pageTabs(tabs,active,onclick){
  return'<div class="flex gap-0.5 bg-sf2 p-1 rounded-xl mb-4 overflow-x-auto">'+tabs.map(function(t){var on=t.id===active;return'<button class="flex-shrink-0 px-3 py-1.5 rounded-[9px] text-[12.5px] font-bold transition-all '+(on?'bg-sf text-ink shadow':'text-mut hover:text-ink')+'" onclick="'+onclick+'(\''+t.id+'\')">'+t.label+'</button>';}).join('')+'</div>';
}
function backBtn(){
  return'<button class="'+BTN_SM+' mb-4" onclick="goBack()"><i data-lucide="arrow-right" class="w-3.5 h-3.5"></i> رجوع</button>';
}
function scoreBar(n){
  var c=n>=80?'#34d399':n>=60?'#fbbf24':n>=40?'#22d3ee':'#f87171';
  return'<div class="flex items-center gap-2"><div class="flex-1 h-1.5 bg-sf2 rounded-full overflow-hidden"><div class="h-full rounded-full transition-all" style="width:'+n+'%;background:'+c+'"></div></div><span class="text-[11.5px] font-extrabold '+scoreCls(n)+'">'+n+'</span></div>';
}
function userAva(uid2,size){
  var u=S.users.find(function(x){return x.id===uid2;});if(!u)return'<div class="'+(size||AVA)+' bg-sf2 border border-ln">?</div>';
  var colors=['bg-br/20 text-br','bg-vi/20 text-vi','bg-gr/20 text-gr','bg-am/20 text-yellow-300'];
  var c=colors[S.users.indexOf(u)%colors.length];
  return'<div class="'+(size||AVA)+' '+c+'">'+initials(u.name)+'</div>';
}
function propSpecRow(beds,baths,parking,area){
  return'<div class="flex items-center gap-3 text-[11.5px] text-mut flex-wrap">'+
    (beds?'<span class="flex items-center gap-1"><i data-lucide="bed" class="w-3 h-3"></i>'+beds+' غرف</span>':'')+
    (baths?'<span class="flex items-center gap-1"><i data-lucide="bath" class="w-3 h-3"></i>'+baths+' حمام</span>':'')+
    (parking?'<span class="flex items-center gap-1"><i data-lucide="car" class="w-3 h-3"></i>'+parking+' موقف</span>':'')+
    (area?'<span class="flex items-center gap-1"><i data-lucide="maximize-2" class="w-3 h-3"></i>'+area+' م²</span>':'')+
  '</div>';
}
function stageChip(s){return'<span class="'+TAG+' bg-sf2 border '+stageColor(s).replace('text-','border-')+'/20 '+stageColor(s)+'">'+esc(s)+'</span>';}

// ── DASHBOARD ─────────────────────────────────────────────────
VIEWS.dash=function(){
  var totalDeals=S.deals.length; var activeDeals=S.deals.filter(function(d){return d.stage!=='مكتمل'&&d.stage!=='خسارة';}).length;
  var totalRev=S.deals.filter(function(d){return d.stage==='مكتمل';}).reduce(function(s,d){return s+d.value*(d.commission/100);},0);
  var hotLeads=S.leads.filter(function(l){return l.score>=80;}).length;
  var overdue=S.activities.filter(function(a){return a.status==='متأخر';}).length;
  var unreadMsgs=S.conversations.reduce(function(s,c){return s+c.unread;},0);
  var pipelineVal=S.deals.filter(function(d){return d.stage!=='مكتمل'&&d.stage!=='خسارة';}).reduce(function(s,d){return s+d.value;},0);
  var todayActs=S.activities.filter(function(a){return a.status==='اليوم';});
  var t1=S.targets.find(function(t){return t.scope==='branch'&&t.scopeId==='B1';});
  var revTarget=t1?t1.metrics.find(function(m){return m.type==='revenue';}):null;

  // Pipeline funnel data
  var funnel=[
    {label:'جديد',count:S.leads.filter(function(l){return l.stage==='جديد';}).length,color:'#4f8cff'},
    {label:'تأهيل',count:S.leads.filter(function(l){return l.stage==='تأهيل';}).length,color:'#22d3ee'},
    {label:'عرض',count:S.leads.filter(function(l){return l.stage==='عرض';}).length,color:'#a78bfa'},
    {label:'تفاوض',count:S.leads.filter(function(l){return l.stage==='تفاوض';}).length,color:'#fbbf24'},
    {label:'إغلاق',count:S.leads.filter(function(l){return l.stage==='إغلاق';}).length,color:'#34d399'},
  ];
  var funnelMax=Math.max.apply(null,funnel.map(function(f){return f.count;}));

  return'<div class="flex flex-col gap-4">'+
    // KPI row
    '<div class="grid grid-cols-2 xl:grid-cols-4 gap-3">'+
      kpiCard('العملاء المحتملون',S.leads.length,'إجمالي','#4f8cff','users')+
      kpiCard('صفقات نشطة',activeDeals,'من '+totalDeals+' إجمالي','#a78bfa','trending-up')+
      kpiCard('قيمة خط الأنابيب',fmtMoney(pipelineVal),'إجمالي العقارات المتفاوض عليها','#fbbf24','dollar-sign')+
      kpiCard('عمولات محققة',fmtMoney(totalRev)+'ر.س','من الصفقات المكتملة','#34d399','check-circle')+
    '</div>'+
    // second KPI row
    '<div class="grid grid-cols-2 xl:grid-cols-4 gap-3">'+
      kpiCard('عملاء ساخنون جداً',hotLeads,'score ≥ 80','#f87171','flame')+
      kpiCard('مهام متأخرة',overdue,'تحتاج متابعة عاجلة','#fbbf24','alert-circle')+
      kpiCard('رسائل واتساب',unreadMsgs,'غير مقروءة','#25d366','message-circle')+
      kpiCard('إجمالي العقارات',S.props.length,'في الكتالوج','#22d3ee','building')+
    '</div>'+
    // Pipeline funnel + recent activity
    '<div class="grid grid-cols-1 xl:grid-cols-3 gap-4">'+
      '<div class="'+PANEL+' xl:col-span-2">'+
        '<p class="text-[12.5px] font-extrabold text-ink mb-3">قمع خط الأنابيب (Sales Funnel)</p>'+
        funnel.map(function(f){var w=funnelMax?Math.round(f.count/funnelMax*100):0;return'<div class="flex items-center gap-3 mb-2"><span class="text-[11.5px] text-mut w-14 text-left flex-shrink-0">'+f.label+'</span><div class="flex-1 h-7 bg-sf2 rounded-lg overflow-hidden relative cursor-pointer hover:opacity-90" onclick="switchView(\'leads\')" title="'+f.count+' عميل"><div class="h-full rounded-lg transition-all duration-700 flex items-center pr-3" style="width:'+Math.max(w,3)+'%;background:'+f.color+'20;border:1px solid '+f.color+'30"><span class="text-[11px] font-extrabold" style="color:'+f.color+'">'+f.count+'</span></div></div></div>';}).join('')+
        (revTarget?'<div class="mt-4 pt-3 border-t border-ln"><p class="text-[11.5px] text-mut mb-1.5">هدف الإيرادات الشهري</p>'+scoreBar(pct(revTarget.achieved,revTarget.target))+'<p class="text-[11px] text-mut mt-1">'+fmtMoney(revTarget.achieved)+' من '+fmtMoney(revTarget.target)+' ر.س</p></div>':'')+
      '</div>'+
      '<div class="'+PANEL+'">'+
        '<p class="text-[12.5px] font-extrabold text-ink mb-3">نشاطات اليوم</p>'+
        (todayActs.length?todayActs.map(function(a){return'<div class="flex items-start gap-2 mb-2.5 cursor-pointer hover:bg-sf2 -mx-1.5 px-1.5 py-1 rounded-lg transition-all" onclick="switchView(\'activities\')"><div class="w-7 h-7 rounded-full '+actBg(a.type)+' grid place-items-center flex-shrink-0 mt-0.5"><i data-lucide="'+actIcon(a.type)+'" class="w-3.5 h-3.5 '+actColor(a.type)+'"></i></div><div class="min-w-0 flex-1"><p class="text-[12px] font-bold text-ink truncate">'+esc(a.title)+'</p><p class="text-[11px] text-mut">'+esc(a.time||'')+'</p></div></div>';}).join(''):empty('لا نشاطات اليوم','calendar-check'))+
      '</div>'+
    '</div>'+
    // Recent leads
    '<div class="'+PANEL+'">'+
      '<div class="flex items-center justify-between mb-3"><p class="text-[12.5px] font-extrabold text-ink">آخر العملاء المحتملين</p><button class="'+BTN_XS+'" onclick="switchView(\'leads\')">عرض الكل</button></div>'+
      '<div class="overflow-x-auto"><table class="'+TBL+'">'+
        '<thead><tr><th class="'+TH+'">العميل</th><th class="'+TH+'">المصدر</th><th class="'+TH+'">المرحلة</th><th class="'+TH+'">النقاط</th><th class="'+TH+'">الوكيل</th><th class="'+TH+'">الإجراء</th></tr></thead>'+
        '<tbody>'+S.leads.slice(0,5).map(function(l,i){var u=S.users.find(function(x){return x.id===l.assignedTo;});var last=i===4;return'<tr class="'+(last?TR_LAST:TR_CLK)+'" onclick="switchView(\'leadDetail\',\''+l.id+'\')">'+'<td class="'+TD+'"><div class="flex items-center gap-2">'+userAva(l.assignedTo,AVA_SM)+'<span class="font-bold text-ink text-[12.5px]">'+esc(l.name)+'</span></div></td>'+'<td class="'+TD+'"><span class="text-[12px] text-mut">'+esc(l.source)+'</span></td>'+'<td class="'+TD+'">'+stageChip(l.stage)+'</td>'+'<td class="'+TD+'"><span class="text-[12.5px] font-extrabold '+scoreCls(l.score)+' '+scoreBg(l.score)+' border rounded-lg px-1.5 py-0.5">'+l.score+'</span></td>'+'<td class="'+TD+'"><span class="text-[12px] text-mut">'+esc(u?u.name:'—')+'</span></td>'+'<td class="'+TD+'" onclick="event.stopPropagation()"><div class="flex gap-1"><button class="'+IBTN+'" title="اتصال"><i data-lucide="phone" class="w-3.5 h-3.5 text-br"></i></button><button class="'+IBTN+'" title="واتساب" onclick="switchView(\'inbox\')"><i data-lucide="message-circle" class="w-3.5 h-3.5 text-green-400"></i></button></div></td>'+'</tr>';}).join('')+
        '</tbody></table></div>'+
    '</div>'+
  '</div>';
};

// ── LEADS ─────────────────────────────────────────────────────
VIEWS.leads=function(){
  var stageF=getFilter('leadStage');var statusF=getFilter('leadStatus');
  var list=S.leads.filter(function(l){
    return(!stageF||l.stage===stageF)&&(!statusF||l.status===statusF);
  });
  var stages=['جديد','تأهيل','عرض','تفاوض','إغلاق','خسارة'];
  var statuses=['ساخن','دافئ','بارد'];
  return'<div class="flex flex-col gap-3">'+
    '<div class="flex flex-wrap items-center gap-2">'+
      '<div class="flex gap-1.5 flex-wrap">'+
        '<button class="'+(stageF===''?FC_ON:FC)+'" onclick="setFilter(\'leadStage\',\'\')">الكل</button>'+
        stages.map(function(s){return'<button class="'+(stageF===s?FC_ON:FC)+'" onclick="setFilter(\'leadStage\',\''+s+'\')">'+s+'</button>';}).join('')+
      '</div>'+
      '<div class="h-4 w-px bg-ln hidden xl:block"></div>'+
      '<div class="flex gap-1.5 flex-wrap">'+
        statuses.map(function(s){return'<button class="'+(statusF===s?FC_ON:FC)+'" onclick="setFilter(\'leadStatus\',\''+s+'\')">'+s+'</button>';}).join('')+
      '</div>'+
      '<div class="mr-auto"><button class="'+BTN_PRI+'" onclick="openAddLead()"><i data-lucide="user-plus" class="w-3.5 h-3.5"></i> إضافة عميل</button></div>'+
    '</div>'+
    '<div class="'+TBLW+'"><table class="'+TBL+'">'+
      '<thead><tr>'+
        '<th class="'+TH+'">العميل المحتمل</th>'+
        '<th class="'+TH+'">المصدر</th>'+
        '<th class="'+TH+'">المتطلبات</th>'+
        '<th class="'+TH+'">النقاط</th>'+
        '<th class="'+TH+'">المرحلة</th>'+
        '<th class="'+TH+'">الوكيل</th>'+
        '<th class="'+TH+'">آخر نشاط</th>'+
        '<th class="'+TH+'">الإجراءات</th>'+
      '</tr></thead>'+
      '<tbody>'+list.map(function(l,i){
        var u=S.users.find(function(x){return x.id===l.assignedTo;});
        var last=i===list.length-1;
        var reqStr=(l.req.budgetMax?fmtMoney(l.req.budgetMax)+' ر.س':'')+(l.req.types&&l.req.types.length?' · '+l.req.types.join('/'):'');
        return'<tr class="'+(last?TR_LAST:TR_CLK)+'" onclick="switchView(\'leadDetail\',\''+l.id+'\')">' +
          '<td class="'+TD+'"><div class="flex items-center gap-2.5"><div class="w-9 h-9 rounded-full bg-br/15 text-br font-black text-[13px] flex-shrink-0 grid place-items-center">'+initials(l.name)+'</div><div><p class="text-[12.5px] font-bold text-ink">'+esc(l.name)+'</p><p class="text-[11px] text-mut">'+fmtPhone(l.phone)+'</p></div></div></td>'+
          '<td class="'+TD+'"><span class="text-[12px] text-mut">'+esc(l.source)+'</span></td>'+
          '<td class="'+TD+'"><span class="text-[11.5px] text-fnt">'+esc(reqStr||'—')+'</span></td>'+
          '<td class="'+TD+'"><div class="flex flex-col gap-1 min-w-[60px]">'+scoreBar(l.score)+'<span class="text-[10.5px] '+scoreCls(l.score)+'">'+scoreLabel(l.score)+'</span></div></td>'+
          '<td class="'+TD+'">'+stageChip(l.stage)+'</td>'+
          '<td class="'+TD+'"><span class="text-[12px] text-mut">'+esc(u?u.name:'—')+'</span></td>'+
          '<td class="'+TD+'"><span class="text-[11.5px] text-fnt">'+esc(l.lastActivity)+'</span></td>'+
          '<td class="'+TD+'" onclick="event.stopPropagation()">'+
            '<div class="flex gap-1">'+
              '<button class="'+IBTN+'" title="اتصال" onclick="toast(\'جارٍ الاتصال بـ '+l.name+'...\',\'info\')"><i data-lucide="phone" class="w-3.5 h-3.5 text-br"></i></button>'+
              '<button class="'+IBTN+'" title="واتساب" onclick="switchView(\'inbox\')"><i data-lucide="message-circle" class="w-3.5 h-3.5 text-green-400"></i></button>'+
              '<button class="'+IBTN+'" title="جدولة نشاط" onclick="openScheduleActivity(\''+l.id+'\')"><i data-lucide="calendar-plus" class="w-3.5 h-3.5 text-vi"></i></button>'+
              '<button class="'+IBTN_DEL+'" title="حذف" onclick="delLead(\''+l.id+'\')"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>'+
            '</div>'+
          '</td>'+
        '</tr>';
      }).join('')+
      '</tbody></table></div>'+
    (list.length===0?empty('لا يوجد عملاء بهذا الفلتر','users'):'')+
  '</div>';
};

// ── LEAD DETAIL ────────────────────────────────────────────────
VIEWS.leadDetail=function(id){
  var l=S.leads.find(function(x){return x.id===id;});if(!l)return empty('العميل غير موجود','alert-circle');
  var u=S.users.find(function(x){return x.id===l.assignedTo;});
  var tab=getFilter('leadTab')||'overview';
  var matchProps=S.props.filter(function(p){return p.status==='متاح'&&(!l.req.types||!l.req.types.length||l.req.types.some(function(t){return p.type.includes(t)||t.includes(p.type);}));}).slice(0,3);

  return backBtn()+
  '<div class="flex flex-col xl:flex-row gap-4">'+
    // LEFT: Profile
    '<div class="flex flex-col gap-3 xl:w-[280px] flex-shrink-0">'+
      '<div class="'+PANEL+' flex flex-col items-center text-center gap-2">'+
        '<div class="'+AVA_XL+' bg-br/15 text-br">'+initials(l.name)+'</div>'+
        '<div>'+
          '<h2 class="text-[15px] font-extrabold text-ink">'+esc(l.name)+'</h2>'+
          '<p class="text-[12px] text-mut">'+esc(l.phone)+'</p>'+
          '<p class="text-[12px] text-mut">'+esc(l.email)+'</p>'+
        '</div>'+
        '<div class="flex gap-2"><span class="'+TAG+' '+scoreBg(l.score)+' border '+scoreCls(l.score)+'"><span class="'+scoreDot(l.score)+' w-1.5 h-1.5 rounded-full inline-block"></span> Score: '+l.score+'</span></div>'+
        '<div class="w-full flex gap-2 mt-1">'+
          '<button class="flex-1 '+BTN_PRI_SM+'" onclick="toast(\'جارٍ الاتصال...\',\'info\')"><i data-lucide="phone" class="w-3.5 h-3.5"></i> اتصال</button>'+
          '<button class="flex-1 '+BTN_WA_SM+'" onclick="switchView(\'inbox\')"><i data-lucide="message-circle" class="w-3.5 h-3.5"></i> واتساب</button>'+
        '</div>'+
      '</div>'+
      '<div class="'+PANEL+'">'+
        '<p class="text-[11.5px] font-extrabold text-mut mb-2 uppercase tracking-wide">تفاصيل</p>'+
        '<div class="'+DKV+'"><span class="text-mut">المصدر</span><span class="text-ink font-bold">'+esc(l.source)+'</span></div>'+
        '<div class="'+DKV+'"><span class="text-mut">المرحلة</span>'+stageChip(l.stage)+'</div>'+
        '<div class="'+DKV+'"><span class="text-mut">الحالة</span><span class="text-ink font-bold">'+esc(l.status)+'</span></div>'+
        '<div class="'+DKV+'"><span class="text-mut">الوكيل</span><span class="text-ink font-bold">'+esc(u?u.name:'—')+'</span></div>'+
        '<div class="'+DKV+'"><span class="text-mut">تاريخ الإضافة</span><span class="text-fnt">'+fmtDate(l.createdAt)+'</span></div>'+
      '</div>'+
      '<div class="'+PANEL+'">'+
        '<p class="text-[11.5px] font-extrabold text-mut mb-2 uppercase tracking-wide">المتطلبات</p>'+
        '<div class="'+DKV+'"><span class="text-mut">الميزانية</span><span class="text-ink font-bold">'+fmtMoney(l.req.budgetMin)+' - '+fmtMoney(l.req.budgetMax)+'</span></div>'+
        '<div class="'+DKV+'"><span class="text-mut">النوع</span><span class="text-ink">'+esc((l.req.types||[]).join(', ')||'—')+'</span></div>'+
        '<div class="'+DKV+'"><span class="text-mut">المنطقة</span><span class="text-ink">'+esc((l.req.areas||[]).join(', ')||'—')+'</span></div>'+
        '<div class="'+DKV+'"><span class="text-mut">الغرف</span><span class="text-ink">'+esc((l.req.bedrooms||[]).join(', ')||'—')+'</span></div>'+
      '</div>'+
      '<div class="flex gap-2">'+
        '<button class="flex-1 '+BTN_SM+'" onclick="openConvertLead(\''+l.id+'\')"><i data-lucide="user-check" class="w-3.5 h-3.5"></i> تحويل لجهة اتصال</button>'+
        '<button class="'+BTN_SM+'" onclick="openScheduleActivity(\''+l.id+'\')"><i data-lucide="calendar-plus" class="w-3.5 h-3.5"></i></button>'+
      '</div>'+
    '</div>'+
    // RIGHT: Tabs
    '<div class="flex-1 min-w-0">'+
      pageTabs([{id:'overview',label:'نظرة عامة'},{id:'activities',label:'النشاطات ('+l.activities.length+')'},{id:'notes',label:'الملاحظات'},{id:'matchprops',label:'عقارات مطابقة ('+matchProps.length+')'}],tab,'function(t){setFilter(\'leadTab\',t);}')+
      (tab==='overview'?
        '<div class="'+PANEL+'">'+
          '<p class="text-[11.5px] font-extrabold text-mut mb-2 uppercase tracking-wide">مقياس تقدم المرحلة</p>'+
          '<div class="flex gap-1 mb-4">'+LEAD_STAGES.map(function(s){var done=LEAD_STAGES.indexOf(s)<=LEAD_STAGES.indexOf(l.stage);return'<div class="flex-1 h-2 rounded-full '+(done?'bg-br':'bg-sf2')+'"></div>';}).join('')+'</div>'+
          LEAD_STAGES.map(function(s,i){return'<div class="flex items-center gap-2 mb-1"><div class="w-2 h-2 rounded-full '+(LEAD_STAGES.indexOf(s)<=LEAD_STAGES.indexOf(l.stage)?'bg-br':'bg-sf2')+'"></div><span class="text-[12px] '+(s===l.stage?'text-ink font-bold':'text-mut')+'">'+s+'</span>'+(s===l.stage?'<span class="'+TBR+'">الحالي</span>':'')+'</div>';}).join('')+
        '</div>'+
        (l.notes?'<div class="'+PANEL+' mt-3"><p class="text-[11.5px] font-extrabold text-mut mb-1.5 uppercase tracking-wide">ملاحظات</p><p class="text-[13px] text-fnt leading-relaxed">'+esc(l.notes)+'</p></div>':'')
      :'')+
      (tab==='activities'?
        '<div class="'+PANEL+'">'+
          '<div class="flex items-center justify-between mb-3"><p class="text-[12.5px] font-extrabold text-ink">سجل النشاطات</p><button class="'+BTN_SM+'" onclick="openScheduleActivity(\''+l.id+'\')"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة</button></div>'+
          (l.activities.length?
            l.activities.map(function(a){return'<div class="relative pr-9 pb-5 tl-line"><div class="tl-dot" style="--dc:'+({call:'#4f8cff',viewing:'#a78bfa',meeting:'#fbbf24',email:'#22d3ee',task:'#34d399'}[a.type]||'#4f8cff')+'"></div><p class="text-[12.5px] font-bold text-ink">'+esc(a.title)+'</p><p class="text-[11.5px] text-mut">'+fmtDate(a.date)+(a.notes?' · '+a.notes:'')+'</p></div>';}).join('')
          :empty('لا نشاطات مسجلة','calendar'))+
        '</div>'
      :'')+
      (tab==='notes'?
        '<div class="'+PANEL+'">'+
          '<p class="text-[12.5px] font-extrabold text-ink mb-3">ملاحظات العميل</p>'+
          '<textarea class="'+IPT+' resize-none" rows="5" placeholder="اكتب ملاحظاتك هنا...">'+esc(l.notes)+'</textarea>'+
          '<div class="flex justify-end mt-2"><button class="'+BTN_PRI_SM+'" onclick="saveLeadNotes(\''+l.id+'\')"><i data-lucide="save" class="w-3.5 h-3.5"></i> حفظ</button></div>'+
        '</div>'
      :'')+
      (tab==='matchprops'?
        '<div class="grid grid-cols-1 xl:grid-cols-2 gap-3">'+
          (matchProps.length?matchProps.map(function(p){return'<div class="'+PROPCARD+'" onclick="switchView(\'propDetail\',\''+p.id+'\')">'+propPhotoBox(p)+'<div class="p-3"><p class="text-[12.5px] font-extrabold text-ink mb-1">'+esc(p.name)+'</p>'+propSpecRow(p.bedrooms,p.bathrooms,p.parking,p.area)+'<p class="text-[13px] font-extrabold text-br mt-1.5">'+fmtMoney(p.price)+' ر.س</p></div></div>';}).join(''):empty('لا عقارات مطابقة لمتطلبات العميل','building'))+
        '</div>'
      :'')+
    '</div>'+
  '</div>';
};

// ── CONTACTS ──────────────────────────────────────────────────
VIEWS.contacts=function(){
  return'<div class="flex flex-col gap-4">'+
    '<div class="flex items-center gap-3">'+
      '<input class="'+IPT+' max-w-xs" placeholder="ابحث في جهات الاتصال..." id="contactSearch" oninput="renderMain()">'+
      '<div class="mr-auto"><button class="'+BTN_PRI+'" onclick="openAddContact()"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة جهة اتصال</button></div>'+
    '</div>'+
    '<div class="grid grid-cols-1 xl:grid-cols-2 gap-3">'+
      S.contacts.map(function(c){return'<div class="'+CONTCARD+'" onclick="switchView(\'contactDetail\',\''+c.id+'\')">'+
        '<div class="flex items-start gap-3">'+
          '<div class="'+AVA_LG+' bg-vi/15 text-vi flex-shrink-0">'+initials(c.name)+'</div>'+
          '<div class="flex-1 min-w-0">'+
            '<div class="flex items-start justify-between gap-2">'+
              '<div><h3 class="text-[13.5px] font-extrabold text-ink">'+esc(c.name)+'</h3>'+
              (c.company?'<p class="text-[11.5px] text-mut">'+esc(c.company)+'</p>':'')+
              '</div><span class="'+TMUT+' flex-shrink-0">'+esc(c.type)+'</span>'+
            '</div>'+
            '<div class="mt-2 flex flex-col gap-1">'+
              c.phones.map(function(ph){return'<div class="flex items-center gap-1.5 text-[12px] text-fnt"><i data-lucide="phone" class="w-3 h-3 text-br flex-shrink-0"></i><span class="text-mut text-[11px]">'+esc(ph.label)+':</span><span>'+esc(fmtPhone(ph.number))+'</span></div>';}).join('')+
              c.emails.map(function(em){return'<div class="flex items-center gap-1.5 text-[12px] text-fnt"><i data-lucide="mail" class="w-3 h-3 text-vi flex-shrink-0"></i><span class="text-mut text-[11px]">'+esc(em.label)+':</span><span class="truncate">'+esc(em.email)+'</span></div>';}).join('')+
            '</div>'+
            (c.tags&&c.tags.length?'<div class="flex flex-wrap gap-1 mt-2">'+c.tags.map(function(t){return'<span class="'+TMUT+'">'+esc(t)+'</span>';}).join('')+'</div>':'')+
          '</div>'+
        '</div>'+
        '<div class="flex gap-2 mt-3 pt-2.5 border-t border-ln" onclick="event.stopPropagation()">'+
          '<button class="'+BTN_SM+'" onclick="toast(\'جارٍ الاتصال...\',\'info\')"><i data-lucide="phone" class="w-3.5 h-3.5"></i></button>'+
          '<button class="'+BTN_WA_SM+'" onclick="switchView(\'inbox\')"><i data-lucide="message-circle" class="w-3.5 h-3.5"></i></button>'+
          '<button class="'+BTN_SM+'" onclick="openAddPhone(\''+c.id+'\')"><i data-lucide="phone-plus" class="w-3.5 h-3.5"></i> إضافة هاتف</button>'+
        '</div>'+
      '</div>';}).join('')+
    '</div>'+
  '</div>';
};

// ── CONTACT DETAIL ────────────────────────────────────────────
VIEWS.contactDetail=function(id){
  var c=S.contacts.find(function(x){return x.id===id;});if(!c)return empty('جهة الاتصال غير موجودة','alert-circle');
  var linkedDeals=S.deals.filter(function(d){return c.linkedDeals&&c.linkedDeals.includes(d.id);});
  var linkedLeads=S.leads.filter(function(l){return c.linkedLeads&&c.linkedLeads.includes(l.id);});

  return backBtn()+
  '<div class="flex flex-col xl:flex-row gap-4">'+
    '<div class="flex flex-col gap-3 xl:w-[280px] flex-shrink-0">'+
      '<div class="'+PANEL+' flex flex-col items-center text-center gap-3">'+
        '<div class="'+AVA_XL+' bg-vi/15 text-vi">'+initials(c.name)+'</div>'+
        '<div><h2 class="text-[15px] font-extrabold text-ink">'+esc(c.name)+'</h2>'+(c.company?'<p class="text-[12px] text-mut">'+esc(c.company)+'</p>':'')+
        '<p class="text-[11.5px] text-mut mt-0.5">'+esc(c.address||'—')+'</p></div>'+
        '<span class="'+TMUT+'">'+esc(c.type)+'</span>'+
        '<div class="w-full flex gap-2">'+
          '<button class="flex-1 '+BTN_PRI_SM+'" onclick="toast(\'جارٍ الاتصال...\',\'info\')"><i data-lucide="phone" class="w-3.5 h-3.5"></i> اتصال</button>'+
          '<button class="flex-1 '+BTN_WA_SM+'" onclick="switchView(\'inbox\')"><i data-lucide="message-circle" class="w-3.5 h-3.5"></i> واتساب</button>'+
        '</div>'+
      '</div>'+
      '<div class="'+PANEL+'">'+
        '<div class="flex items-center justify-between mb-2"><p class="text-[11.5px] font-extrabold text-mut uppercase tracking-wide">أرقام الجوال</p><button class="'+BTN_XS+'" onclick="openAddPhone(\''+c.id+'\')"><i data-lucide="plus" class="w-3 h-3"></i></button></div>'+
        c.phones.map(function(ph){return'<div class="flex items-center justify-between py-1.5 border-b border-ln/50 last:border-0"><div><span class="text-[10.5px] text-mut block">'+esc(ph.label)+'</span><span class="text-[13px] font-bold text-ink">'+esc(fmtPhone(ph.number))+'</span></div><div class="flex gap-1"><button class="'+IBTN+'" onclick="toast(\'جارٍ الاتصال...\',\'info\')"><i data-lucide="phone" class="w-3.5 h-3.5 text-br"></i></button><button class="'+IBTN+'" onclick="switchView(\'inbox\')"><i data-lucide="message-circle" class="w-3.5 h-3.5 text-green-400"></i></button></div></div>';}).join('')+
      '</div>'+
      '<div class="'+PANEL+'">'+
        '<div class="flex items-center justify-between mb-2"><p class="text-[11.5px] font-extrabold text-mut uppercase tracking-wide">البريد الإلكتروني</p><button class="'+BTN_XS+'" onclick="openAddEmail(\''+c.id+'\')"><i data-lucide="plus" class="w-3 h-3"></i></button></div>'+
        c.emails.map(function(em){return'<div class="flex items-center justify-between py-1.5 border-b border-ln/50 last:border-0"><div class="min-w-0 flex-1"><span class="text-[10.5px] text-mut block">'+esc(em.label)+'</span><span class="text-[12px] text-ink truncate block">'+esc(em.email)+'</span></div><button class="'+IBTN+' ml-2" onclick="toast(\'تم نسخ البريد\',\'ok\')"><i data-lucide="copy" class="w-3.5 h-3.5 text-mut"></i></button></div>';}).join('')+
      '</div>'+
    '</div>'+
    '<div class="flex-1 min-w-0 flex flex-col gap-4">'+
      (c.tags&&c.tags.length?'<div class="'+PANEL+'"><p class="text-[11.5px] font-extrabold text-mut mb-2 uppercase tracking-wide">التصنيفات</p><div class="flex flex-wrap gap-1.5">'+c.tags.map(function(t){return'<span class="'+TMUT+'">'+esc(t)+'</span>';}).join('')+'</div></div>':'')+
      '<div class="'+PANEL+'"><p class="text-[12.5px] font-extrabold text-ink mb-2.5">العملاء المحتملون المرتبطون</p>'+(linkedLeads.length?linkedLeads.map(function(l){return'<div class="flex items-center justify-between py-2 border-b border-ln/50 last:border-0 cursor-pointer hover:bg-sf2 -mx-1 px-1 rounded-lg" onclick="switchView(\'leadDetail\',\''+l.id+'\')"><div><p class="text-[12.5px] font-bold text-ink">'+esc(l.name)+'</p><p class="text-[11.5px] text-mut">'+esc(l.source)+'</p></div>'+stageChip(l.stage)+'</div>';}).join(''):empty('لا عملاء مرتبطون','users'))+'</div>'+
      '<div class="'+PANEL+'"><p class="text-[12.5px] font-extrabold text-ink mb-2.5">الصفقات المرتبطة</p>'+(linkedDeals.length?linkedDeals.map(function(d){return'<div class="flex items-center justify-between py-2 border-b border-ln/50 last:border-0 cursor-pointer hover:bg-sf2 -mx-1 px-1 rounded-lg" onclick="switchView(\'dealDetail\',\''+d.id+'\')"><div><p class="text-[12.5px] font-bold text-ink">'+esc(d.name)+'</p><p class="text-[11.5px] text-mut">'+fmtMoney(d.value)+' ر.س</p></div>'+stageChip(d.stage)+'</div>';}).join(''):empty('لا صفقات مرتبطة','trending-up'))+'</div>'+
      (c.notes?'<div class="'+PANEL+'"><p class="text-[12.5px] font-extrabold text-ink mb-2">ملاحظات</p><p class="text-[13px] text-fnt leading-relaxed">'+esc(c.notes)+'</p></div>':'')+
    '</div>'+
  '</div>';
};

// ── PROPERTIES ────────────────────────────────────────────────
VIEWS.props=function(){
  var types=['شقة','فيلا','أرض','مكتب','تاون هاوس','شقة مفروشة'];
  var tf=getFilter('propType');var sf2=getFilter('propStatus');
  var list=S.props.filter(function(p){return(!tf||p.type===tf)&&(!sf2||p.status===sf2);});
  return'<div class="flex flex-col gap-3">'+
    '<div class="flex flex-wrap items-center gap-2">'+
      '<div class="flex gap-1.5 flex-wrap">'+
        '<button class="'+(tf===''?FC_ON:FC)+'" onclick="setFilter(\'propType\',\'\')">الكل</button>'+
        types.map(function(t){return'<button class="'+(tf===t?FC_ON:FC)+'" onclick="setFilter(\'propType\',\''+t+'\')">'+t+'</button>';}).join('')+
      '</div>'+
      '<div class="h-4 w-px bg-ln hidden xl:block"></div>'+
      '<div class="flex gap-1.5">'+
        ['متاح','محجوز','مباع'].map(function(s){return'<button class="'+(sf2===s?FC_ON:FC)+'" onclick="setFilter(\'propStatus\',\''+s+'\')">'+s+'</button>';}).join('')+
      '</div>'+
      '<div class="mr-auto"><button class="'+BTN_PRI+'" onclick="openAddProp()"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة عقار</button></div>'+
    '</div>'+
    '<div class="grid grid-cols-1 xl:grid-cols-3 gap-4">'+
      list.map(function(p){
        return'<div class="'+PROPCARD+'" onclick="switchView(\'propDetail\',\''+p.id+'\')">' +
          propPhotoBox(p)+
          '<div class="p-3">'+
            '<div class="flex items-start justify-between gap-2 mb-1">'+
              '<h3 class="text-[12.5px] font-extrabold text-ink leading-tight">'+esc(p.name)+'</h3>'+
              '<span class="'+TAG+' bg-br/10 text-br border border-br/20 flex-shrink-0 text-[10px]">'+esc(p.type)+'</span>'+
            '</div>'+
            '<p class="text-[11.5px] text-mut mb-2"><i class="inline-block w-3 h-3 mr-0.5" data-lucide="map-pin" style="display:inline-block;vertical-align:middle"></i>'+esc(p.location)+'</p>'+
            propSpecRow(p.bedrooms,p.bathrooms,p.parking,p.area)+
            '<div class="flex items-center justify-between mt-2.5 pt-2 border-t border-ln">'+
              '<div><p class="text-[14px] font-extrabold text-br">'+fmtMoney(p.price)+' ر.س</p><p class="text-[10.5px] text-mut">'+esc(p.priceType)+'</p></div>'+
              '<div class="flex gap-1">'+
                '<span class="'+TMUT+' text-[10.5px]"><i data-lucide="eye" class="w-3 h-3 inline"></i> '+p.viewings+'</span>'+
                (p.published?'<span class="'+TOK+' text-[10.5px]">منشور</span>':'<span class="'+TWRM+' text-[10.5px]">غير منشور</span>')+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>';
      }).join('')+
    '</div>'+
    (list.length===0?empty('لا عقارات بهذا الفلتر','building'):'')+
  '</div>';
};

// ── PROPERTY DETAIL ───────────────────────────────────────────
VIEWS.propDetail=function(id){
  var p=S.props.find(function(x){return x.id===id;});if(!p)return empty('العقار غير موجود','alert-circle');
  var tab=getFilter('propTab')||'details';
  var linkedDeals=S.deals.filter(function(d){return p.linkedDeals&&p.linkedDeals.includes(d.id);});

  return backBtn()+
  '<div class="flex flex-col xl:flex-row gap-4">'+
    '<div class="flex-1 min-w-0">'+
      pageTabs([{id:'details',label:'التفاصيل'},{id:'docs',label:'الملفات ('+p.documents.length+')'},{id:'history',label:'تاريخ الأسعار'},{id:'deals',label:'الصفقات ('+linkedDeals.length+')'}],tab,'function(t){setFilter(\'propTab\',t);}')+
      (tab==='details'?
        '<div class="flex flex-col gap-4">'+
          // Photo gallery placeholder
          '<div class="'+PANEL+'">'+
            '<div class="grid grid-cols-3 gap-2">'+
              '<div class="col-span-2 aspect-[16/9] bg-gradient-to-br from-sf2 to-bg rounded-xl flex flex-col items-center justify-center gap-2 text-mut cursor-pointer hover:opacity-80 transition-all"><i data-lucide="image" class="w-8 h-8 opacity-40"></i><p class="text-[11.5px]">صورة رئيسية</p></div>'+
              '<div class="flex flex-col gap-2">'+
                '<div class="aspect-square bg-sf2 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 text-mut text-[11px]">صورة 2</div>'+
                '<div class="aspect-square bg-sf2 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 text-mut text-[11px]">'+(p.photos>2?'+'+(p.photos-2)+' صور أخرى':'صورة 3')+'</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
          // Specs
          '<div class="'+PANEL+'">'+
            '<p class="text-[12.5px] font-extrabold text-ink mb-3">مواصفات العقار</p>'+
            '<div class="grid grid-cols-2 xl:grid-cols-4 gap-2 mb-4">'+
              (p.bedrooms?'<div class="'+PANEL_SM+' text-center"><i data-lucide="bed" class="w-4 h-4 text-br mx-auto mb-1"></i><p class="text-[15px] font-extrabold text-ink">'+p.bedrooms+'</p><p class="text-[11px] text-mut">غرف نوم</p></div>':'')+
              (p.bathrooms?'<div class="'+PANEL_SM+' text-center"><i data-lucide="bath" class="w-4 h-4 text-vi mx-auto mb-1"></i><p class="text-[15px] font-extrabold text-ink">'+p.bathrooms+'</p><p class="text-[11px] text-mut">حمامات</p></div>':'')+
              (p.parking?'<div class="'+PANEL_SM+' text-center"><i data-lucide="car" class="w-4 h-4 text-am mx-auto mb-1"></i><p class="text-[15px] font-extrabold text-ink">'+p.parking+'</p><p class="text-[11px] text-mut">مواقف</p></div>':'')+
              '<div class="'+PANEL_SM+' text-center"><i data-lucide="maximize-2" class="w-4 h-4 text-gr mx-auto mb-1"></i><p class="text-[15px] font-extrabold text-ink">'+p.area+'</p><p class="text-[11px] text-mut">م²</p></div>'+
            '</div>'+
            '<div class="grid grid-cols-2 gap-x-4">'+
              '<div class="'+DKV+'"><span class="text-mut">النوع</span><span class="text-ink font-bold">'+esc(p.type)+'</span></div>'+
              '<div class="'+DKV+'"><span class="text-mut">المدينة</span><span class="text-ink font-bold">'+esc(p.city)+'</span></div>'+
              '<div class="'+DKV+'"><span class="text-mut">الحي</span><span class="text-ink font-bold">'+esc(p.district)+'</span></div>'+
              (p.floor?'<div class="'+DKV+'"><span class="text-mut">الطابق</span><span class="text-ink font-bold">'+p.floor+' / '+p.totalFloors+'</span></div>':'')+
              '<div class="'+DKV+'"><span class="text-mut">عمر البناء</span><span class="text-ink font-bold">'+(p.buildingAge||'—')+' سنة</span></div>'+
              '<div class="'+DKV+'"><span class="text-mut">الحالة</span>'+stageChip(p.status)+'</div>'+
            '</div>'+
          '</div>'+
          // Amenities
          (p.amenities&&p.amenities.length?'<div class="'+PANEL+'"><p class="text-[12.5px] font-extrabold text-ink mb-3">المرافق والمميزات</p><div class="grid grid-cols-2 xl:grid-cols-3 gap-2">'+p.amenities.map(function(a){return'<div class="flex items-center gap-2 bg-sf2 rounded-lg px-3 py-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-gr flex-shrink-0"></i><span class="text-[12px] text-ink">'+esc(a)+'</span></div>';}).join('')+'</div></div>':'')+
          (p.description?'<div class="'+PANEL+'"><p class="text-[12.5px] font-extrabold text-ink mb-2">وصف العقار</p><p class="text-[13px] text-fnt leading-relaxed">'+esc(p.description)+'</p></div>':'')+
        '</div>'
      :'')+
      (tab==='docs'?
        '<div class="'+PANEL+'">'+
          '<div class="flex items-center justify-between mb-3"><p class="text-[12.5px] font-extrabold text-ink">مستندات العقار</p><button class="'+BTN_SM+'" onclick="toast(\'رفع ملف...\',\'info\')"><i data-lucide="upload" class="w-3.5 h-3.5"></i> رفع ملف</button></div>'+
          (p.documents.length?
            p.documents.map(function(d){return'<div class="flex items-center justify-between py-2.5 border-b border-ln/50 last:border-0"><div class="flex items-center gap-2.5"><div class="w-8 h-8 rounded-lg bg-rd/10 border border-rd/20 grid place-items-center"><i data-lucide="file-text" class="w-4 h-4 text-rd"></i></div><p class="text-[12.5px] font-bold text-ink">'+esc(d.name)+'</p></div><div class="flex gap-1"><button class="'+IBTN+'" onclick="toast(\'جارٍ التحميل...\',\'info\')"><i data-lucide="download" class="w-3.5 h-3.5 text-br"></i></button><button class="'+IBTN_DEL+'" onclick="toast(\'تم الحذف\',\'err\')"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button></div></div>';}).join('')
          :empty('لا مستندات مرفوعة','file'))+
          '<div class="'+DZONE+' mt-3" onclick="toast(\'رفع ملف...\',\'info\')"><i data-lucide="upload-cloud" class="w-8 h-8 text-mut mx-auto mb-1.5 opacity-50"></i><p class="text-[12px] text-mut">اسحب وأفلت الملفات هنا أو انقر للرفع</p><p class="text-[11px] text-fnt mt-0.5">PDF, JPG, PNG مقبولة · حجم أقصى 50MB</p></div>'+
        '</div>'
      :'')+
      (tab==='history'?
        '<div class="'+PANEL+'">'+
          '<p class="text-[12.5px] font-extrabold text-ink mb-3">تاريخ تغييرات السعر</p>'+
          p.priceHistory.map(function(h,i){return'<div class="relative pr-9 pb-5 tl-line '+(i===p.priceHistory.length-1?'pb-0':'')+'"><div class="tl-dot" style="--dc:#4f8cff"></div><p class="text-[13px] font-extrabold text-br">'+fmtMoney(h.price)+' ر.س</p><p class="text-[11.5px] text-mut">'+fmtDate(h.date)+(h.reason?' · '+h.reason:'')+'</p></div>';}).join('')+
        '</div>'
      :'')+
      (tab==='deals'?
        '<div class="'+PANEL+'">'+
          '<p class="text-[12.5px] font-extrabold text-ink mb-3">صفقات مرتبطة بهذا العقار</p>'+
          (linkedDeals.length?linkedDeals.map(function(d){return'<div class="flex items-center justify-between py-2.5 border-b border-ln/50 last:border-0 cursor-pointer hover:bg-sf2 -mx-1 px-1 rounded-lg" onclick="switchView(\'dealDetail\',\''+d.id+'\')"><div><p class="text-[12.5px] font-bold text-ink">'+esc(d.name)+'</p><p class="text-[11.5px] text-mut">'+fmtMoney(d.value)+' ر.س</p></div>'+stageChip(d.stage)+'</div>';}).join(''):empty('لا صفقات','trending-up'))+
        '</div>'
      :'')+
    '</div>'+
    // RIGHT sidebar
    '<div class="flex flex-col gap-3 xl:w-[240px] flex-shrink-0">'+
      '<div class="'+PANEL+'">'+
        '<p class="text-[19px] font-extrabold text-br">'+fmtMoney(p.price)+' ر.س</p>'+
        '<p class="text-[12px] text-mut mb-3">'+esc(p.priceType)+'</p>'+
        '<button class="'+BTN_PRI+' w-full mb-2" onclick="openAddDeal(\''+p.id+'\')"><i data-lucide="trending-up" class="w-3.5 h-3.5"></i> إنشاء صفقة</button>'+
        '<button class="'+BTN+' w-full" onclick="toast(\'جارٍ فتح البروشور...\',\'info\')"><i data-lucide="file-text" class="w-3.5 h-3.5"></i> البروشور</button>'+
      '</div>'+
      '<div class="'+PANEL+'">'+
        '<p class="text-[11.5px] font-extrabold text-mut mb-2 uppercase tracking-wide">الإحصائيات</p>'+
        '<div class="'+DKV+'"><span class="text-mut">المشاهدات</span><span class="text-ink font-bold">'+p.viewings+'</span></div>'+
        '<div class="'+DKV+'"><span class="text-mut">النشر</span>'+(p.published?'<span class="'+TOK+'">منشور</span>':'<span class="'+TWRM+'">غير منشور</span>')+'</div>'+
        (p.publishedPortals&&p.publishedPortals.length?'<div class="'+DKV+' items-start"><span class="text-mut">البوابات</span><div class="flex flex-col gap-0.5 text-left">'+p.publishedPortals.map(function(po){return'<span class="text-[11px] text-ink">'+esc(po)+'</span>';}).join('')+'</div></div>':'')+
      '</div>'+
    '</div>'+
  '</div>';
};

// ── DEALS (KANBAN) ────────────────────────────────────────────
VIEWS.deals=function(){
  var cols=stageKanbanCols();
  var pipelineVal=S.deals.reduce(function(s,d){return s+(d.stage!=='مكتمل'&&d.stage!=='خسارة'?d.value:0);},0);
  var wonVal=S.deals.filter(function(d){return d.stage==='مكتمل';}).reduce(function(s,d){return s+d.value;},0);

  return'<div class="flex flex-col gap-4">'+
    '<div class="grid grid-cols-3 xl:grid-cols-5 gap-3 mb-2">'+
      kpiCard('قيمة خط الأنابيب',fmtMoney(pipelineVal)+' ر.س','جميع الصفقات النشطة','#4f8cff','dollar-sign')+
      kpiCard('إجمالي الصفقات',S.deals.length,'','#a78bfa','trending-up')+
      kpiCard('صفقات مكتملة',wonVal?fmtMoney(wonVal)+' ر.س':'0','قيمة إجمالية','#34d399','check-circle')+
    '</div>'+
    '<div class="flex gap-3 overflow-x-auto pb-2">'+
      cols.map(function(col){
        var colDeals=S.deals.filter(function(d){return d.stage===col;});
        var colVal=colDeals.reduce(function(s,d){return s+d.value;},0);
        var headColor=col==='مكتمل'?'border-b-2 border-gr':col==='خسارة'?'border-b-2 border-rd':col==='تفاوض'?'border-b-2 border-am':'border-b-2 border-br';
        return'<div class="'+KBAN_COL+'">'+
          '<div class="'+KBAN_HEAD+' '+headColor+'">'+
            '<span>'+esc(col)+'</span>'+
            '<span class="'+TMUT+'">'+colDeals.length+'</span>'+
          '</div>'+
          '<div class="'+KBAN_BODY+'">'+
            (colDeals.length?colDeals.map(function(d){
              return'<div class="'+LEADCARD+'" onclick="switchView(\'dealDetail\',\''+d.id+'\')">'+
                '<p class="text-[12px] font-extrabold text-ink leading-snug mb-1">'+esc(d.name)+'</p>'+
                '<p class="text-[13px] font-extrabold text-br mb-1.5">'+fmtMoney(d.value)+' ر.س</p>'+
                '<div class="flex items-center justify-between">'+
                  '<span class="text-[11px] text-mut">عمولة: '+d.commission+'%</span>'+
                  userAva(d.assignedTo,AVA_SM)+
                '</div>'+
              '</div>';
            }).join(''):
            '<div class="text-center py-4 text-[11.5px] text-fnt opacity-60">لا صفقات</div>')+
          '</div>'+
        '</div>';
      }).join('')+
    '</div>'+
    '<div class="flex justify-end"><button class="'+BTN_PRI+'" onclick="openAddDeal(\'\')"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة صفقة</button></div>'+
  '</div>';
};

// ── DEAL DETAIL ───────────────────────────────────────────────
VIEWS.dealDetail=function(id){
  var d=S.deals.find(function(x){return x.id===id;});if(!d)return empty('الصفقة غير موجودة','alert-circle');
  var p=S.props.find(function(x){return x.id===d.propId;});
  var u=S.users.find(function(x){return x.id===d.assignedTo;});
  var allStages=['تواصل أولي','تأهيل','عرض','تفاوض','توقيع عقد','إغلاق','مكتمل'];
  var curIdx=allStages.indexOf(d.stage);

  return backBtn()+
  '<div class="flex flex-col xl:flex-row gap-4">'+
    '<div class="flex flex-col gap-3 xl:w-[260px] flex-shrink-0">'+
      '<div class="'+PANEL+'">'+
        '<p class="text-[15px] font-extrabold text-ink mb-1">'+esc(d.name)+'</p>'+
        '<p class="text-[22px] font-extrabold text-br mb-1">'+fmtMoney(d.value)+' ر.س</p>'+
        '<p class="text-[11.5px] text-mut mb-3">قيمة العمولة الإجمالية: '+fmtMoney(d.value*d.commission/100)+' ر.س</p>'+
        stageChip(d.stage)+
      '</div>'+
      '<div class="'+PANEL+'">'+
        '<p class="text-[11.5px] font-extrabold text-mut mb-2 uppercase tracking-wide">توزيع العمولة</p>'+
        '<div class="'+DKV+'"><span class="text-mut">نسبة الوكيل</span><span class="text-ink font-bold">'+d.commissionSplit.agent+'%</span></div>'+
        '<div class="'+DKV+'"><span class="text-mut">نسبة المكتب</span><span class="text-ink font-bold">'+d.commissionSplit.office+'%</span></div>'+
        '<div class="'+DKV+'"><span class="text-mut">إحالة</span><span class="text-ink font-bold">'+d.commissionSplit.referral+'%</span></div>'+
        '<div class="mt-3 flex h-3 rounded-full overflow-hidden">'+
          '<div class="bg-br transition-all" style="width:'+d.commissionSplit.agent+'%"></div>'+
          '<div class="bg-vi transition-all" style="width:'+d.commissionSplit.office+'%"></div>'+
          '<div class="bg-am transition-all" style="width:'+d.commissionSplit.referral+'%"></div>'+
        '</div>'+
      '</div>'+
      '<div class="'+PANEL+'">'+
        '<p class="text-[11.5px] font-extrabold text-mut mb-2 uppercase tracking-wide">تفاصيل</p>'+
        '<div class="'+DKV+'"><span class="text-mut">الوكيل</span><span class="text-ink font-bold">'+esc(u?u.name:'—')+'</span></div>'+
        (p?'<div class="'+DKV+'"><span class="text-mut">العقار</span><span class="text-ink font-bold cursor-pointer hover:text-br" onclick="switchView(\'propDetail\',\''+p.id+'\')">'+esc(p.name)+'</span></div>':'')+
        '<div class="'+DKV+'"><span class="text-mut">الإغلاق المتوقع</span><span class="text-fnt">'+fmtDate(d.expectedCloseDate)+'</span></div>'+
      '</div>'+
    '</div>'+
    '<div class="flex-1 min-w-0 flex flex-col gap-4">'+
      // Stage stepper
      '<div class="'+PANEL+'">'+
        '<p class="text-[12.5px] font-extrabold text-ink mb-4">مراحل الصفقة</p>'+
        '<div class="flex items-center gap-0 overflow-x-auto pb-2">'+
          allStages.map(function(s,i){
            var done=i<=curIdx; var cur=i===curIdx;
            return'<div class="flex items-center gap-0 flex-shrink-0">'+
              '<div class="flex flex-col items-center gap-1">'+
                '<div class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold border-2 transition-all '+(cur?'bg-br border-br text-[#06121f]':done?'bg-br/20 border-br text-br':'bg-sf2 border-ln text-mut')+'">'+
                  (done&&!cur?'<i data-lucide="check" class="w-3 h-3"></i>':(i+1))+
                '</div>'+
                '<span class="text-[10px] font-bold '+(cur?'text-br':done?'text-ink':'text-mut')+' whitespace-nowrap">'+esc(s)+'</span>'+
              '</div>'+
              (i<allStages.length-1?'<div class="w-8 h-[2px] mb-4 flex-shrink-0 '+(i<curIdx?'bg-br':'bg-ln')+'"></div>':'')+
            '</div>';
          }).join('')+
        '</div>'+
      '</div>'+
      // Stage history
      '<div class="'+PANEL+'">'+
        '<p class="text-[12.5px] font-extrabold text-ink mb-3">سجل تغييرات المرحلة</p>'+
        d.stageHistory.map(function(h,i){return'<div class="relative pr-9 pb-5 tl-line '+(i===d.stageHistory.length-1?'pb-0':'')+'"><div class="tl-dot" style="--dc:#4f8cff"></div><p class="text-[12.5px] font-bold text-ink">'+esc(h.stage)+'</p><p class="text-[11.5px] text-mut">'+fmtDate(h.date)+' · '+esc(h.user)+'</p></div>';}).join('')+
      '</div>'+
      // Documents
      '<div class="'+PANEL+'">'+
        '<div class="flex items-center justify-between mb-3"><p class="text-[12.5px] font-extrabold text-ink">مستندات الصفقة</p><button class="'+BTN_SM+'" onclick="toast(\'رفع ملف...\',\'info\')"><i data-lucide="upload" class="w-3.5 h-3.5"></i> رفع</button></div>'+
        (d.documents&&d.documents.length?
          d.documents.map(function(doc){return'<div class="flex items-center justify-between py-2 border-b border-ln/50 last:border-0"><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-rd/10 border border-rd/20 grid place-items-center"><i data-lucide="file-text" class="w-3.5 h-3.5 text-rd"></i></div><span class="text-[12.5px] text-ink font-bold">'+esc(doc.name)+'</span></div><button class="'+IBTN+'" onclick="toast(\'جارٍ التحميل...\',\'info\')"><i data-lucide="download" class="w-3.5 h-3.5 text-br"></i></button></div>';}).join('')
        :empty('لا مستندات','file'))+
      '</div>'+
      (d.notes?'<div class="'+PANEL+'"><p class="text-[12.5px] font-extrabold text-ink mb-2">ملاحظات</p><p class="text-[13px] text-fnt leading-relaxed">'+esc(d.notes)+'</p></div>':'')+
    '</div>'+
  '</div>';
};

// ── ACTIVITIES ────────────────────────────────────────────────
VIEWS.activities=function(){
  var typeF=getFilter('actType');
  var list=S.activities.filter(function(a){return!typeF||a.type===typeF;});
  var groups=[{key:'متأخر',label:'متأخرة',color:'text-rd'},{key:'اليوم',label:'اليوم',color:'text-am'},{key:'قادم',label:'قادمة',color:'text-br'},{key:'مكتمل',label:'مكتملة',color:'text-gr'}];
  var types=['call','viewing','meeting','email','task','note'];

  return'<div class="flex flex-col gap-4">'+
    '<div class="flex flex-wrap items-center gap-2">'+
      '<div class="flex gap-1.5 flex-wrap">'+
        '<button class="'+(typeF===''?FC_ON:FC)+'" onclick="setFilter(\'actType\',\'\')">الكل</button>'+
        types.map(function(t){return'<button class="'+(typeF===t?FC_ON:FC)+' flex items-center gap-1" onclick="setFilter(\'actType\',\''+t+'\')"><i data-lucide="'+actIcon(t)+'" class="w-3 h-3"></i>'+actLabel(t)+'</button>';}).join('')+
      '</div>'+
      '<div class="mr-auto"><button class="'+BTN_PRI+'" onclick="openAddActivity()"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة نشاط</button></div>'+
    '</div>'+
    groups.map(function(g){
      var items=list.filter(function(a){return a.status===g.key;});
      if(!items.length)return'';
      return'<div class="'+PANEL+'">'+
        '<p class="text-[12.5px] font-extrabold '+g.color+' mb-3 flex items-center gap-2">'+
          (g.key==='متأخر'?'<i data-lucide="alert-circle" class="w-4 h-4"></i>':g.key==='اليوم'?'<i data-lucide="clock" class="w-4 h-4"></i>':g.key==='قادم'?'<i data-lucide="calendar" class="w-4 h-4"></i>':'<i data-lucide="check-circle" class="w-4 h-4"></i>')+
          g.label+' ('+items.length+')'+
        '</p>'+
        items.map(function(a){
          var lead=S.leads.find(function(l){return l.id===a.leadId;});
          var u=S.users.find(function(x){return x.id===a.assignedTo;});
          return'<div class="flex items-start gap-3 py-2.5 border-b border-ln/50 last:border-0 cursor-pointer hover:bg-sf2 -mx-1 px-1 rounded-lg transition-all">'+
            '<div class="w-8 h-8 rounded-full '+actBg(a.type)+' grid place-items-center flex-shrink-0 mt-0.5"><i data-lucide="'+actIcon(a.type)+'" class="w-4 h-4 '+actColor(a.type)+'"></i></div>'+
            '<div class="flex-1 min-w-0">'+
              '<p class="text-[12.5px] font-bold text-ink">'+esc(a.title)+'</p>'+
              '<div class="flex flex-wrap items-center gap-3 mt-0.5">'+
                (a.time?'<span class="text-[11.5px] text-mut flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i>'+esc(a.date)+' '+esc(a.time)+'</span>':'')+
                (lead?'<span class="text-[11.5px] text-br flex items-center gap-1"><i data-lucide="user" class="w-3 h-3"></i>'+esc(lead.name)+'</span>':'')+
                (a.duration?'<span class="text-[11.5px] text-mut">'+a.duration+' دقيقة</span>':'')+
              '</div>'+
              (a.notes?'<p class="text-[11.5px] text-fnt mt-0.5">'+esc(a.notes)+'</p>':'')+
            '</div>'+
            '<div class="flex items-center gap-2">'+
              userAva(a.assignedTo,AVA_SM)+
              (a.status!=='مكتمل'?'<button class="'+BTN_XS_PRI+'" onclick="completeActivity(\''+a.id+'\')"><i data-lucide="check" class="w-3 h-3"></i></button>':'')+
            '</div>'+
          '</div>';
        }).join('')+
      '</div>';
    }).join('')+
  '</div>';
};

// ── INBOX (WhatsApp) ──────────────────────────────────────────
VIEWS.inbox=function(){
  var cur=S.CUR_CONV;
  var curConv=S.conversations.find(function(c){return c.id===cur;});
  var msgs=S.messages[cur]||[];

  function renderMsg(m){
    var isOut=m.dir==='out'; var cls=isOut?MSG_OUT:MSG_IN;
    var wrapper='flex '+(isOut?'justify-start':'justify-end')+' mb-2';
    var body='';
    if(m.type==='text') body='<p>'+esc(m.text)+'</p>';
    else if(m.type==='image') body='<div><div class="w-[160px] h-[110px] rounded-lg bg-gradient-to-br from-sf2 to-bg flex items-center justify-center mb-1 cursor-pointer"><i data-lucide="image" class="w-7 h-7 text-mut opacity-60"></i></div><p class="text-[11px] text-mut">'+esc(m.mediaName||'')+'</p>'+(m.text?'<p class="mt-1">'+esc(m.text)+'</p>':'')+'</div>';
    else if(m.type==='voice') body='<div class="flex items-center gap-2 min-w-[160px]"><button class="w-7 h-7 rounded-full bg-br/20 border border-br/30 grid place-items-center flex-shrink-0" onclick="toast(\'تشغيل مقطع صوتي...\',\'info\')"><i data-lucide="play" class="w-3 h-3 text-br"></i></button><div class="flex-1 flex items-end gap-px h-6">'+Array.from({length:18},function(x,i){var h=Math.random()*0.7+0.15;return'<div class="flex-1 rounded-sm bg-br/40" style="height:'+(h*100)+'%"></div>';}).join('')+'</div><span class="text-[11px] text-mut">'+esc(m.duration||'')+'</span></div>';
    else if(m.type==='document') body='<div class="flex items-center gap-2 min-w-[180px] cursor-pointer" onclick="toast(\'جارٍ فتح المستند...\',\'info\')"><div class="w-9 h-9 rounded-lg bg-rd/10 border border-rd/20 grid place-items-center flex-shrink-0"><i data-lucide="file-text" class="w-4 h-4 text-rd"></i></div><div><p class="text-[12px] font-bold leading-snug">'+esc(m.mediaName||'')+'</p><p class="text-[10.5px] text-mut">'+esc(m.mediaSize||'')+'</p></div></div>';
    else if(m.type==='location') body='<div class="cursor-pointer" onclick="toast(\'فتح الموقع...\',\'info\')"><div class="w-full h-[80px] rounded-lg bg-gradient-to-br from-sf2 to-bg flex items-center justify-center mb-1"><i data-lucide="map-pin" class="w-8 h-8 text-br opacity-70"></i></div><p class="text-[11.5px] text-br flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i>'+esc(m.text||'الموقع')+'</p></div>';
    else if(m.type==='template') body='<div><div class="text-[10.5px] text-b2 font-bold mb-1.5 flex items-center gap-1"><i data-lucide="layout-template" class="w-3 h-3"></i>قالب: '+esc(m.templateName||'')+'</div><p class="text-[12.5px] whitespace-pre-line leading-relaxed">'+esc(m.text)+'</p><div class="mt-2 pt-2 border-t border-b2/20"><button class="'+BTN_XS+' w-full" onclick="toast(\'رد سريع...\',\'info\')"><i data-lucide="reply" class="w-3 h-3"></i> رد</button></div></div>';
    var statusIco=m.status==='read'?'<span class="text-[10px] text-b2">✓✓</span>':m.status==='delivered'?'<span class="text-[10px] text-mut">✓✓</span>':'<span class="text-[10px] text-mut">✓</span>';
    return'<div class="'+wrapper+'"><div class="'+cls+'">'+body+'<div class="flex items-center gap-1 mt-1 '+(isOut?'justify-start':'justify-end')+'"><span class="text-[10.5px] text-mut">'+esc(m.time)+'</span>'+(isOut?statusIco:'')+'</div></div></div>';
  }

  return'<div class="flex gap-0 h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-ln">'+
    // Conv list
    '<div class="w-[260px] flex-shrink-0 border-l border-ln flex flex-col bg-sf">'+
      '<div class="p-3 border-b border-ln"><input class="'+IPT+'" placeholder="بحث في المحادثات..."></div>'+
      '<div class="flex-1 overflow-y-auto">'+
        S.conversations.map(function(c){
          var on=c.id===cur;
          return'<div class="'+(on?CV_ON:CV)+'" onclick="S.CUR_CONV=\''+c.id+'\';renderMain()">'+
            '<div class="flex items-center gap-2.5">'+
              '<div class="relative"><div class="'+AVA+' bg-wa/15 text-green-400">'+initials(c.contactName)+'</div>'+(c.status==='online'?'<div class="absolute bottom-0 left-0 w-2.5 h-2.5 bg-gr border-2 border-sf rounded-full"></div>':'')+'</div>'+
              '<div class="flex-1 min-w-0">'+
                '<div class="flex items-center justify-between"><p class="text-[12.5px] font-bold text-ink truncate">'+esc(c.contactName)+'</p><span class="text-[10.5px] text-mut flex-shrink-0">'+esc(c.lastTime)+'</span></div>'+
                '<div class="flex items-center justify-between"><p class="text-[11.5px] text-mut truncate">'+esc(c.lastMsg)+'</p>'+(c.unread?'<span class="w-4 h-4 rounded-full bg-wa text-[#06121f] text-[10px] font-extrabold grid place-items-center flex-shrink-0">'+c.unread+'</span>':'')+'</div>'+
              '</div>'+
            '</div>'+
          '</div>';
        }).join('')+
      '</div>'+
    '</div>'+
    // Chat panel
    '<div class="flex-1 flex flex-col bg-bg2 min-w-0">'+
      (curConv?
        '<div class="flex items-center justify-between px-4 py-3 border-b border-ln bg-sf">'+
          '<div class="flex items-center gap-3">'+
            '<div class="'+AVA+' bg-wa/15 text-green-400">'+initials(curConv.contactName)+'</div>'+
            '<div><p class="text-[13px] font-extrabold text-ink">'+esc(curConv.contactName)+'</p><p class="text-[11.5px] text-mut">'+esc(curConv.contactPhone)+'</p></div>'+
          '</div>'+
          '<div class="flex gap-2">'+
            '<button class="'+IBTN+'" onclick="toast(\'جارٍ الاتصال...\',\'info\')"><i data-lucide="phone" class="w-3.5 h-3.5 text-br"></i></button>'+
            '<button class="'+IBTN+'" onclick="toast(\'فتح ملف جهة الاتصال...\',\'info\')"><i data-lucide="user" class="w-3.5 h-3.5 text-vi"></i></button>'+
          '</div>'+
        '</div>'+
        '<div class="flex-1 overflow-y-auto p-4 flex flex-col">'+msgs.map(renderMsg).join('')+'</div>'+
        '<div class="px-4 py-3 border-t border-ln bg-sf flex gap-2">'+
          '<button class="'+IBTN+'" onclick="toast(\'اختيار مرفق...\',\'info\')"><i data-lucide="paperclip" class="w-4 h-4 text-mut"></i></button>'+
          '<button class="'+IBTN+'" onclick="toast(\'إرسال قالب...\',\'info\')"><i data-lucide="layout-template" class="w-4 h-4 text-b2"></i></button>'+
          '<input class="'+IPT+' flex-1" id="msgInput" placeholder="اكتب رسالة..." onkeydown="if(event.key===\'Enter\')sendMsg()">'+
          '<button class="'+BTN_WA_SM+'" onclick="sendMsg()"><i data-lucide="send" class="w-3.5 h-3.5"></i> إرسال</button>'+
        '</div>'
      :empty('اختر محادثة','message-circle'))+
    '</div>'+
  '</div>';
};

// ── BRANCHES ──────────────────────────────────────────────────
VIEWS.branches=function(){
  return'<div class="flex flex-col gap-4">'+
    '<div class="flex justify-end"><button class="'+BTN_PRI+'" onclick="openAddBranch()"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة فرع</button></div>'+
    '<div class="grid grid-cols-1 xl:grid-cols-2 gap-4">'+
      S.branches.map(function(b){
        var mgr=S.users.find(function(u){return u.id===b.manager;});
        return'<div class="'+PANEL+'">'+
          '<div class="flex items-start justify-between mb-3">'+
            '<div class="flex items-center gap-3">'+
              '<div class="w-10 h-10 rounded-xl bg-br/15 border border-br/30 grid place-items-center"><i data-lucide="git-branch" class="w-5 h-5 text-br"></i></div>'+
              '<div><h3 class="text-[13.5px] font-extrabold text-ink">'+esc(b.name)+'</h3><p class="text-[11.5px] text-mut">'+esc(b.address)+'</p></div>'+
            '</div>'+
            (b.active?'<span class="'+TOK+'">نشط</span>':'<span class="'+TWRM+'">غير نشط</span>')+
          '</div>'+
          '<div class="grid grid-cols-3 gap-2 mb-3">'+
            '<div class="'+PANEL_SM+' text-center"><p class="text-[16px] font-extrabold text-br">'+b.agents+'</p><p class="text-[10.5px] text-mut">وكيل</p></div>'+
            '<div class="'+PANEL_SM+' text-center"><p class="text-[16px] font-extrabold text-vi">'+b.leads+'</p><p class="text-[10.5px] text-mut">عميل</p></div>'+
            '<div class="'+PANEL_SM+' text-center"><p class="text-[16px] font-extrabold text-gr">'+b.deals+'</p><p class="text-[10.5px] text-mut">صفقة</p></div>'+
          '</div>'+
          '<div class="'+DKV+'"><span class="text-mut">المدير</span><span class="text-ink font-bold">'+esc(mgr?mgr.name:'—')+'</span></div>'+
          '<div class="'+DKV+'"><span class="text-mut">الإيرادات</span><span class="text-br font-bold">'+fmtMoney(b.revenue)+' ر.س</span></div>'+
          '<div class="flex gap-2 mt-3"><button class="'+BTN_SM+'" onclick="toast(\'تعديل الفرع...\',\'info\')"><i data-lucide="edit-2" class="w-3.5 h-3.5"></i> تعديل</button></div>'+
        '</div>';
      }).join('')+
    '</div>'+
  '</div>';
};

// ── TEAM ──────────────────────────────────────────────────────
VIEWS.team=function(){
  return'<div class="flex flex-col gap-4">'+
    '<div class="flex justify-end"><button class="'+BTN_PRI+'" onclick="openAddTeam()"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة فريق</button></div>'+
    S.teams.map(function(t){
      var branch=S.branches.find(function(b){return b.id===t.branchId;});
      var leader=S.users.find(function(u){return u.id===t.leader;});
      var members=S.users.filter(function(u){return t.members.includes(u.id);});
      return'<div class="'+PANEL+'">'+
        '<div class="flex items-center justify-between mb-3">'+
          '<div class="flex items-center gap-3"><div class="w-9 h-9 rounded-xl bg-vi/15 border border-vi/30 grid place-items-center"><i data-lucide="users-round" class="w-4 h-4 text-vi"></i></div><div><h3 class="text-[13.5px] font-extrabold text-ink">'+esc(t.name)+'</h3><p class="text-[11.5px] text-mut">'+esc(branch?branch.name:'—')+'</p></div></div>'+
          '<span class="'+TMUT+' text-[11px]">هدف: '+fmtMoney(t.target)+' ر.س</span>'+
        '</div>'+
        '<div class="'+DKV+'"><span class="text-mut">قائد الفريق</span><span class="text-ink font-bold">'+esc(leader?leader.name:'—')+'</span></div>'+
        '<p class="text-[11.5px] font-bold text-mut mt-3 mb-2">الأعضاء</p>'+
        '<div class="flex flex-wrap gap-2">'+
          members.map(function(u){
            var colors=['bg-br/15 text-br','bg-vi/15 text-vi','bg-gr/15 text-gr','bg-am/15 text-yellow-300'];
            var c=colors[S.users.indexOf(u)%colors.length];
            return'<div class="flex items-center gap-2 bg-sf2 rounded-full pr-3 pl-1 py-1"><div class="'+AVA_SM+' '+c+'">'+initials(u.name)+'</div><span class="text-[12px] font-bold text-ink">'+esc(u.name)+'</span><span class="'+TMUT+' text-[10px]">'+esc(roleLabel(u.role))+'</span></div>';
          }).join('')+
        '</div>'+
      '</div>';
    }).join('')+
  '</div>';
};

// ── USERS ─────────────────────────────────────────────────────
VIEWS.users=function(){
  return'<div class="flex flex-col gap-3">'+
    '<div class="flex justify-end"><button class="'+BTN_PRI+'" onclick="openAddUser()"><i data-lucide="user-plus" class="w-3.5 h-3.5"></i> إضافة مستخدم</button></div>'+
    '<div class="'+TBLW+'"><table class="'+TBL+'">'+
      '<thead><tr>'+
        '<th class="'+TH+'">المستخدم</th>'+
        '<th class="'+TH+'">الدور</th>'+
        '<th class="'+TH+'">الفرع</th>'+
        '<th class="'+TH+'">الصفقات</th>'+
        '<th class="'+TH+'">الإيرادات</th>'+
        '<th class="'+TH+'">الحالة</th>'+
        '<th class="'+TH+'">الإجراءات</th>'+
      '</tr></thead>'+
      '<tbody>'+S.users.map(function(u,i){
        var branch=S.branches.find(function(b){return b.id===u.branch;});
        var last=i===S.users.length-1;
        var colors=['bg-br/15 text-br','bg-vi/15 text-vi','bg-gr/15 text-gr','bg-am/15 text-yellow-300'];
        var c=colors[i%colors.length];
        return'<tr class="'+(last?TR_LAST:TR_CLK)+'">'+
          '<td class="'+TD+'"><div class="flex items-center gap-2.5"><div class="'+AVA+' '+c+'">'+initials(u.name)+'</div><div><p class="text-[12.5px] font-bold text-ink">'+esc(u.name)+'</p><p class="text-[11px] text-mut">'+esc(u.email)+'</p></div></div></td>'+
          '<td class="'+TD+'"><span class="'+roleCls(u.role)+'">'+esc(roleLabel(u.role))+'</span></td>'+
          '<td class="'+TD+'"><span class="text-[12px] text-mut">'+esc(branch?branch.name:'—')+'</span></td>'+
          '<td class="'+TD+'"><span class="text-[12.5px] font-bold text-ink">'+u.deals+'</span></td>'+
          '<td class="'+TD+'"><span class="text-[12.5px] font-bold text-br">'+fmtMoney(u.revenue)+'</span></td>'+
          '<td class="'+TD+'"><span class="'+(u.status==='نشط'?TOK:TWRM)+'">'+esc(u.status)+'</span></td>'+
          '<td class="'+TD+'" onclick="event.stopPropagation()"><div class="flex gap-1"><button class="'+IBTN+'" onclick="toast(\'تعديل المستخدم...\',\'info\')"><i data-lucide="edit-2" class="w-3.5 h-3.5 text-br"></i></button><button class="'+IBTN_DEL+'" onclick="toast(\'تم إلغاء تفعيل الحساب\',\'ok\')"><i data-lucide="ban" class="w-3.5 h-3.5"></i></button></div></td>'+
        '</tr>';
      }).join('')+'</tbody></table></div>'+
  '</div>';
};

// ── ROLES ─────────────────────────────────────────────────────
VIEWS.roles=function(){
  var roles=[
    {id:'owner',name:'مالك / مدير عام',desc:'صلاحيات كاملة على المنصة',color:'bg-vi/10 text-vi border-vi/20',
     perms:[{label:'إدارة جميع البيانات',ok:true},{label:'إضافة وحذف المستخدمين',ok:true},{label:'إدارة الفروع',ok:true},{label:'الوصول للتقارير الكاملة',ok:true},{label:'إدارة الفوترة',ok:true}]},
    {id:'branch_manager',name:'مدير الفرع',desc:'إدارة الفرع والفريق والعملاء',color:'bg-am/10 text-yellow-300 border-am/20',
     perms:[{label:'إدارة بيانات الفرع',ok:true},{label:'إضافة وكلاء للفرع',ok:true},{label:'الوصول للتقارير',ok:true},{label:'تعديل صفقات الفرع',ok:true},{label:'إدارة الفروع الأخرى',ok:false}]},
    {id:'team_leader',name:'قائد الفريق',desc:'إدارة الفريق والعملاء',color:'bg-b2/10 text-b2 border-b2/20',
     perms:[{label:'رؤية عملاء الفريق',ok:true},{label:'إسناد المهام',ok:true},{label:'تقارير الفريق',ok:true},{label:'تعديل بيانات الفرع',ok:false},{label:'إدارة المستخدمين',ok:false}]},
    {id:'sales_agent',name:'وكيل المبيعات',desc:'إدارة عملائه المحتملين وصفقاته',color:'bg-gr/10 text-gr border-gr/20',
     perms:[{label:'إضافة وتعديل العملاء',ok:true},{label:'إضافة صفقات',ok:true},{label:'معرفة بيانات الآخرين',ok:false},{label:'تعديل صلاحيات',ok:false},{label:'الوصول للتقارير الكاملة',ok:false}]},
  ];

  return'<div class="grid grid-cols-1 xl:grid-cols-2 gap-4">'+
    roles.map(function(r){
      return'<div class="'+PANEL+'">'+
        '<div class="flex items-center gap-3 mb-3">'+
          '<div class="w-9 h-9 rounded-xl '+r.color+' border grid place-items-center"><i data-lucide="shield-check" class="w-4 h-4"></i></div>'+
          '<div><h3 class="text-[13.5px] font-extrabold text-ink">'+esc(r.name)+'</h3><p class="text-[11.5px] text-mut">'+esc(r.desc)+'</p></div>'+
        '</div>'+
        r.perms.map(function(p2){return'<div class="flex items-center gap-2 py-1.5 border-b border-ln/50 last:border-0"><i data-lucide="'+(p2.ok?'check':'x')+'" class="w-3.5 h-3.5 '+(p2.ok?'text-gr':'text-rd/50')+' flex-shrink-0"></i><span class="text-[12.5px] '+(p2.ok?'text-ink':'text-fnt')+'">'+esc(p2.label)+'</span></div>';}).join('')+
      '</div>';
    }).join('')+
  '</div>';
};

// ── TARGETS ───────────────────────────────────────────────────
VIEWS.targets=function(){
  var scopeF=getFilter('targetScope')||'agent';
  var metricColors={leads:'#4f8cff',deals:'#a78bfa',revenue:'#34d399',viewings:'#fbbf24'};
  var metricLabels={leads:'عملاء',deals:'صفقات',revenue:'إيرادات ر.س',viewings:'معاينات'};

  var agentTargets=S.targets.filter(function(t){return t.scope==='agent';});
  var branchTargets=S.targets.filter(function(t){return t.scope==='branch';});

  function renderTargetCard(t){
    var agent=S.users.find(function(u){return u.id===t.scopeId;});
    var branch=S.branches.find(function(b){return b.id===t.scopeId;});
    var label=agent?agent.name:branch?branch.name:t.scopeId;
    return'<div class="'+PANEL+'">'+
      '<div class="flex items-center justify-between mb-3">'+
        '<div class="flex items-center gap-2.5">'+
          (agent?'<div class="'+AVA+' bg-br/15 text-br">'+initials(agent.name)+'</div>':
                 '<div class="w-[34px] h-[34px] rounded-full bg-am/15 text-yellow-300 grid place-items-center"><i data-lucide="git-branch" class="w-4 h-4"></i></div>')+
          '<div><p class="text-[13px] font-extrabold text-ink">'+esc(label)+'</p><p class="text-[11.5px] text-mut">يونيو 2026</p></div>'+
        '</div>'+
        '<button class="'+BTN_SM+'" onclick="openSetTarget(\''+t.scope+'\',\''+t.scopeId+'\')"><i data-lucide="edit-2" class="w-3.5 h-3.5"></i> تعديل الهدف</button>'+
      '</div>'+
      '<div class="flex flex-col gap-3">'+
        t.metrics.map(function(m){
          var p2=pct(m.achieved,m.target);
          var c=metricColors[m.type]||'#4f8cff';
          var val=m.type==='revenue'?fmtMoney(m.achieved)+'/'+fmtMoney(m.target):m.achieved+'/'+m.target;
          return'<div>'+
            '<div class="flex items-center justify-between mb-1">'+
              '<span class="text-[11.5px] font-bold text-mut">'+esc(metricLabels[m.type]||m.type)+'</span>'+
              '<div class="flex items-center gap-2"><span class="text-[12px] font-extrabold" style="color:'+c+'">'+esc(val)+'</span><span class="text-[10.5px] text-mut">'+p2+'%</span></div>'+
            '</div>'+
            '<div class="'+PBAR+'"><div class="'+PB+'" style="width:'+p2+'%;background:'+c+'"></div></div>'+
          '</div>';
        }).join('')+
      '</div>'+
    '</div>';
  }

  return'<div class="flex flex-col gap-4">'+
    '<div class="flex items-center justify-between">'+
      '<div class="flex gap-1.5">'+
        '<button class="'+(scopeF==='agent'?FC_ON:FC)+'" onclick="setFilter(\'targetScope\',\'agent\')">بالوكيل</button>'+
        '<button class="'+(scopeF==='branch'?FC_ON:FC)+'" onclick="setFilter(\'targetScope\',\'branch\')">بالفرع</button>'+
      '</div>'+
      '<button class="'+BTN_PRI+'" onclick="openSetTarget(\'agent\',\'\')"><i data-lucide="target" class="w-3.5 h-3.5"></i> وضع هدف جديد</button>'+
    '</div>'+
    '<div class="grid grid-cols-1 xl:grid-cols-2 gap-4">'+
      (scopeF==='agent'?agentTargets:branchTargets).map(renderTargetCard).join('')+
    '</div>'+
  '</div>';
};

// ── NOTIFICATIONS ─────────────────────────────────────────────
VIEWS.notifs=function(){
  return'<div class="flex flex-col gap-3">'+
    '<div class="flex justify-end gap-2">'+
      '<button class="'+BTN_SM+'" onclick="markAllRead();renderMain()"><i data-lucide="check-check" class="w-3.5 h-3.5"></i> تحديد الكل مقروء</button>'+
    '</div>'+
    '<div class="'+TBLW+'">'+
      S.notifs.map(function(n){
        var ic=n.type==='lead'?'user-plus':n.type==='activity'?'calendar':n.type==='deal'?'trending-up':n.type==='msg'?'message-circle':n.type==='billing'?'credit-card':'bell';
        return'<div class="'+(n.read?NOTIF_ROW:NOTIF_UNREAD)+' cursor-pointer" onclick="n_'+n.id+'_read()">'+
          '<div class="w-9 h-9 rounded-full '+(n.read?'bg-sf2':'bg-br/15')+' border border-ln grid place-items-center flex-shrink-0"><i data-lucide="'+ic+'" class="w-4 h-4 '+(n.read?'text-mut':'text-br')+'"></i></div>'+
          '<div class="flex-1 min-w-0">'+
            '<p class="text-[12.5px] font-bold text-ink">'+esc(n.title)+'</p>'+
            '<p class="text-[12px] text-mut">'+esc(n.body)+'</p>'+
            '<p class="text-[11px] text-fnt mt-0.5">'+esc(n.time)+'</p>'+
          '</div>'+
          (!n.read?'<div class="w-2 h-2 rounded-full bg-br flex-shrink-0 mt-1.5"></div>':'')+
        '</div>';
      }).join('')+
    '</div>'+
  '</div>';
};

// ── REPORTS ───────────────────────────────────────────────────
VIEWS.reports=function(){
  var rf=getFilter('reportFilter')||'company';
  var scope=getFilter('reportScope')||'';
  var filterOpts=['company','branch','team','user'];
  var filterLabels={company:'الشركة',branch:'الفرع',team:'الفريق',user:'الموظف'};

  // Compute data
  var dealsByStage={};stageKanbanCols().forEach(function(s){dealsByStage[s]=S.deals.filter(function(d){return d.stage===s;}).length;});
  var leadsBySource={};S.leads.forEach(function(l){leadsBySource[l.source]=(leadsBySource[l.source]||0)+1;});
  var maxSource=Math.max.apply(null,Object.values(leadsBySource));

  return'<div class="flex flex-col gap-4">'+
    // Filter bar
    '<div class="'+PANEL+'">'+
      '<p class="text-[11.5px] font-extrabold text-mut mb-2 uppercase tracking-wide">فلترة التقارير</p>'+
      '<div class="flex flex-wrap gap-3 items-center">'+
        '<div class="flex gap-1.5">'+
          filterOpts.map(function(f){return'<button class="'+(rf===f?FC_ON:FC)+'" onclick="setFilter(\'reportFilter\',\''+f+'\');setFilter(\'reportScope\',\'\')">'+filterLabels[f]+'</button>';}).join('')+
        '</div>'+
        (rf==='branch'?'<select class="'+IPT+' max-w-[160px]" onchange="setFilter(\'reportScope\',this.value)"><option value="">كل الفروع</option>'+S.branches.map(function(b){return'<option value="'+b.id+'">'+esc(b.name)+'</option>';}).join('')+'</select>':'')+
        (rf==='user'?'<select class="'+IPT+' max-w-[160px]" onchange="setFilter(\'reportScope\',this.value)"><option value="">كل الموظفين</option>'+S.users.map(function(u){return'<option value="'+u.id+'">'+esc(u.name)+'</option>';}).join('')+'</select>':'')+
      '</div>'+
    '</div>'+
    // KPIs
    '<div class="grid grid-cols-2 xl:grid-cols-4 gap-3">'+
      kpiCard('إجمالي الصفقات',S.deals.length,'','#4f8cff','trending-up')+
      kpiCard('العملاء المحتملون',S.leads.length,'','#a78bfa','users')+
      kpiCard('معدل التحويل','24%','من leads → deals','#34d399','percent')+
      kpiCard('متوسط وقت الإغلاق','18 يوم','من تأهيل إلى توقيع','#fbbf24','clock')+
    '</div>'+
    '<div class="grid grid-cols-1 xl:grid-cols-2 gap-4">'+
      // Deals by stage
      '<div class="'+PANEL+'">'+
        '<p class="text-[12.5px] font-extrabold text-ink mb-3">الصفقات حسب المرحلة</p>'+
        Object.entries(dealsByStage).filter(function(e){return e[1]>0;}).map(function(e){
          var maxV=Math.max.apply(null,Object.values(dealsByStage));var w=maxV?Math.round(e[1]/maxV*100):0;
          return'<div class="flex items-center gap-3 mb-2"><span class="text-[11.5px] text-mut w-20 flex-shrink-0 text-left">'+esc(e[0])+'</span><div class="flex-1 h-6 bg-sf2 rounded-lg overflow-hidden"><div class="h-full rounded-lg bg-br/30 border border-br/20 flex items-center pr-2 transition-all duration-700" style="width:'+Math.max(w,5)+'%"><span class="text-[11px] font-bold text-br">'+e[1]+'</span></div></div></div>';
        }).join('')+
      '</div>'+
      // Leads by source
      '<div class="'+PANEL+'">'+
        '<p class="text-[12.5px] font-extrabold text-ink mb-3">العملاء حسب المصدر</p>'+
        Object.entries(leadsBySource).map(function(e){var w=maxSource?Math.round(e[1]/maxSource*100):0;return'<div class="flex items-center gap-3 mb-2"><span class="text-[11.5px] text-mut flex-shrink-0 text-left" style="min-width:100px">'+esc(e[0])+'</span><div class="flex-1 h-6 bg-sf2 rounded-lg overflow-hidden"><div class="h-full rounded-lg bg-vi/25 border border-vi/20 flex items-center pr-2 transition-all duration-700" style="width:'+Math.max(w,5)+'%"><span class="text-[11px] font-bold text-vi">'+e[1]+'</span></div></div></div>';}).join('')+
      '</div>'+
    '</div>'+
    // Performance table
    '<div class="'+TBLW+'"><p class="text-[12.5px] font-extrabold text-ink px-3 py-2.5 border-b border-ln">أداء الوكلاء</p><table class="'+TBL+'">'+
      '<thead><tr><th class="'+TH+'">الوكيل</th><th class="'+TH+'">العملاء</th><th class="'+TH+'">الصفقات</th><th class="'+TH+'">الإيرادات</th><th class="'+TH+'">معدل التحويل</th></tr></thead>'+
      '<tbody>'+S.users.filter(function(u){return u.role!=='owner';}).map(function(u,i){
        var uLeads=S.leads.filter(function(l){return l.assignedTo===u.id;}).length;
        var uDeals=S.deals.filter(function(d){return d.assignedTo===u.id;}).length;
        var uRev=S.deals.filter(function(d){return d.assignedTo===u.id;}).reduce(function(s,d){return s+d.value*(d.commission/100);},0);
        var conv=uLeads?Math.round(uDeals/uLeads*100):0;
        var last=i===S.users.length-2;
        return'<tr class="'+(last?TR_LAST:TR_CLK)+'"><td class="'+TD+'"><div class="flex items-center gap-2">'+userAva(u.id,AVA_SM)+'<span class="font-bold text-[12.5px] text-ink">'+esc(u.name)+'</span></div></td><td class="'+TD+'"><span class="font-bold text-br">'+uLeads+'</span></td><td class="'+TD+'"><span class="font-bold text-vi">'+uDeals+'</span></td><td class="'+TD+'"><span class="font-bold text-gr">'+fmtMoney(uRev)+'</span></td><td class="'+TD+'"><div class="flex items-center gap-2"><div class="w-16 '+PBAR+'"><div class="'+PB+'" style="width:'+conv+'%;background:#34d399"></div></div><span class="text-[12px] font-bold text-gr">'+conv+'%</span></div></td></tr>';
      }).join('')+'</tbody></table></div>'+
  '</div>';
};

// ── DATA I/O ──────────────────────────────────────────────────
VIEWS.dataio=function(){
  var items=[
    {label:'العملاء المحتملون',sub:'8 سجل',icon:'users',color:'text-br'},
    {label:'جهات الاتصال',sub:'6 سجل',icon:'contact-2',color:'text-vi'},
    {label:'العقارات',sub:'6 سجل',icon:'building',color:'text-am'},
    {label:'الصفقات',sub:'5 سجلات',icon:'trending-up',color:'text-gr'},
  ];
  return'<div class="grid grid-cols-1 xl:grid-cols-2 gap-4">'+
    '<div class="'+PANEL+'">'+
      '<p class="text-[12.5px] font-extrabold text-ink mb-4">استيراد البيانات</p>'+
      '<div class="'+DZONE+' mb-4" onclick="toast(\'اختيار ملف للاستيراد...\',\'info\')"><i data-lucide="upload-cloud" class="w-10 h-10 text-mut mx-auto mb-2 opacity-50"></i><p class="text-[12.5px] font-bold text-ink mb-1">اسحب ملف CSV أو Excel هنا</p><p class="text-[11.5px] text-mut">أو انقر للاختيار من جهازك</p></div>'+
      '<p class="text-[11.5px] font-bold text-mut mb-2">استيراد إلى:</p>'+
      '<div class="flex flex-col gap-2">'+
        items.map(function(it){return'<label class="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg hover:bg-sf2 transition-all"><input type="radio" name="importTo" class="accent-br"><i data-lucide="'+it.icon+'" class="w-4 h-4 '+it.color+'"></i><span class="text-[12.5px] text-ink font-bold">'+esc(it.label)+'</span></label>';}).join('')+
      '</div>'+
      '<button class="'+BTN_PRI+' mt-4" onclick="toast(\'جارٍ الاستيراد...\',\'ok\')"><i data-lucide="upload" class="w-3.5 h-3.5"></i> بدء الاستيراد</button>'+
    '</div>'+
    '<div class="'+PANEL+'">'+
      '<p class="text-[12.5px] font-extrabold text-ink mb-4">تصدير البيانات</p>'+
      '<div class="flex flex-col gap-3">'+
        items.map(function(it){return'<div class="flex items-center justify-between py-2.5 border-b border-ln/50 last:border-0"><div class="flex items-center gap-2.5"><div class="w-8 h-8 rounded-lg bg-sf2 border border-ln grid place-items-center"><i data-lucide="'+it.icon+'" class="w-4 h-4 '+it.color+'"></i></div><div><p class="text-[12.5px] font-bold text-ink">'+esc(it.label)+'</p><p class="text-[11px] text-mut">'+esc(it.sub)+'</p></div></div><div class="flex gap-2"><button class="'+BTN_SM+'" onclick="toast(\'جارٍ التصدير CSV...\',\'ok\')"><i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> CSV</button><button class="'+BTN_SM+'" onclick="toast(\'جارٍ التصدير Excel...\',\'ok\')"><i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Excel</button></div></div>';}).join('')+
      '</div>'+
    '</div>'+
  '</div>';
};

// ── BILLING ───────────────────────────────────────────────────
VIEWS.billing=function(){
  var b=S.billing;
  var plans=[
    {id:'starter',name:'Starter',price:'299 ر.س',period:'شهرياً',users:3,leads:50,storage:5,feats:['إدارة العملاء','العقارات','الصفقات','واتساب أساسي']},
    {id:'pro',name:'Pro',price:'899 ر.س',period:'شهرياً',users:10,leads:200,storage:20,feats:['كل ما في Starter','تقارير متقدمة','أهداف وتتبع','تصدير البيانات','واتساب متقدم','أولوية الدعم']},
    {id:'enterprise',name:'Enterprise',price:'مخصص',period:'',users:999,leads:999,storage:100,feats:['كل ما في Pro','نطاق مخصص','SLA مضمون','مدير حساب','API كامل','تكاملات مخصصة']},
  ];
  return'<div class="flex flex-col gap-4">'+
    // Current plan
    '<div class="'+PANEL+'">'+
      '<div class="flex items-center justify-between mb-3"><p class="text-[12.5px] font-extrabold text-ink">الخطة الحالية</p><span class="'+TOK+'">Pro · نشط</span></div>'+
      '<div class="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-3">'+
        ['users','leads','storage','whatsapp'].map(function(k){
          var labels={users:'المستخدمون',leads:'العملاء',storage:'التخزين (GB)',whatsapp:'رسائل واتساب'};
          var used=b[k].used,limit=b[k].limit,p2=pct(used,limit);
          var c=p2>80?'#f87171':p2>60?'#fbbf24':'#34d399';
          return'<div class="'+PANEL_SM+'"><p class="text-[11px] text-mut mb-1">'+labels[k]+'</p><p class="text-[14px] font-extrabold text-ink mb-1">'+used+' / '+limit+'</p><div class="'+PBAR+'"><div class="'+PB+'" style="width:'+p2+'%;background:'+c+'"></div></div></div>';
        }).join('')+
      '</div>'+
      '<p class="text-[11.5px] text-mut">تجديد الاشتراك: <span class="text-ink font-bold">'+fmtDate(b.renewal)+'</span></p>'+
    '</div>'+
    // Plans
    '<div class="grid grid-cols-1 xl:grid-cols-3 gap-4">'+
      plans.map(function(pl){var on=pl.id===b.plan;return'<div class="'+(on?PLANC_ON:PLANC)+'">'+
        (on?'<span class="'+TOK+' text-[10.5px] mb-2 inline-block">الخطة الحالية</span>':'')+
        '<h3 class="text-[15px] font-extrabold text-ink">'+esc(pl.name)+'</h3>'+
        '<p class="text-[22px] font-extrabold '+(on?'text-br':'text-ink')+' my-1">'+esc(pl.price)+'<span class="text-[12px] text-mut font-normal"> '+esc(pl.period)+'</span></p>'+
        '<p class="text-[11.5px] text-mut mb-3">مستخدمون: '+pl.users+(pl.users===999?'+':'')+' · عملاء: '+pl.leads+(pl.leads===999?'+':'')+'</p>'+
        '<div class="flex flex-col gap-1.5 mb-3">'+pl.feats.map(function(f){return'<div class="flex items-center gap-2"><i data-lucide="check" class="w-3.5 h-3.5 text-gr flex-shrink-0"></i><span class="text-[12px] text-ink">'+esc(f)+'</span></div>';}).join('')+'</div>'+
        (on?'<button class="'+BTN+' w-full" disabled><span class="text-mut">الخطة الحالية</span></button>':'<button class="'+BTN_PRI+' w-full" onclick="toast(\'جارٍ الترقية...\',\'ok\')">ترقية</button>')+
      '</div>';}).join('')+
    '</div>'+
    // Invoices
    '<div class="'+TBLW+'"><p class="text-[12.5px] font-extrabold text-ink px-3 py-2.5 border-b border-ln">الفواتير السابقة</p><table class="'+TBL+'">'+
      '<thead><tr><th class="'+TH+'">رقم الفاتورة</th><th class="'+TH+'">التاريخ</th><th class="'+TH+'">المبلغ</th><th class="'+TH+'">الحالة</th><th class="'+TH+'">التحميل</th></tr></thead>'+
      '<tbody>'+b.invoices.map(function(inv,i){var last=i===b.invoices.length-1;return'<tr class="'+(last?TR_LAST:TR_CLK)+'"><td class="'+TD+'"><span class="text-[12.5px] font-mono text-ink">'+esc(inv.id)+'</span></td><td class="'+TD+'"><span class="text-[12px] text-mut">'+fmtDate(inv.date)+'</span></td><td class="'+TD+'"><span class="text-[12.5px] font-bold text-br">'+fmt(inv.amount)+' ر.س</span></td><td class="'+TD+'"><span class="'+TOK+'">'+esc(inv.status)+'</span></td><td class="'+TD+'"><button class="'+BTN_XS+'" onclick="toast(\'جارٍ التحميل...\',\'ok\')"><i data-lucide="download" class="w-3 h-3"></i> PDF</button></td></tr>';}).join('')+
      '</tbody></table></div>'+
  '</div>';
};

// ── SETTINGS ──────────────────────────────────────────────────
VIEWS.settings=function(){
  var sec=getFilter('settingsSection')||'general';
  var secs=[{id:'general',label:'عام',icon:'settings'},{id:'profile',label:'الملف الشخصي',icon:'user'},{id:'targets',label:'الأهداف الافتراضية',icon:'target'},{id:'whatsapp',label:'واتساب',icon:'message-circle'},{id:'notif',label:'الإشعارات',icon:'bell'},{id:'integrations',label:'التكاملات',icon:'plug'}];

  return'<div class="flex flex-col xl:flex-row gap-4">'+
    // Settings sidebar
    '<div class="xl:w-[200px] flex-shrink-0">'+
      '<div class="'+PANEL+' p-2">'+
        secs.map(function(s){var on=s.id===sec;return'<button class="'+(on?STN_ON:STN)+'" onclick="setFilter(\'settingsSection\',\''+s.id+'\')"><i data-lucide="'+s.icon+'" class="w-4 h-4 flex-shrink-0"></i>'+esc(s.label)+'</button>';}).join('')+
      '</div>'+
    '</div>'+
    // Settings content
    '<div class="flex-1 min-w-0">'+
      (sec==='general'?
        '<div class="'+PANEL+' flex flex-col gap-3">'+
          '<p class="text-[12.5px] font-extrabold text-ink mb-1">إعدادات عامة</p>'+
          fld('اسم المكتب العقاري','set_name','text','مكتب Est8Core العقاري')+
          fld('رقم هاتف المكتب','set_phone','tel','0112223333')+
          fld('البريد الإلكتروني للمكتب','set_email','email','info@est8.com')+
          fld('العملة','set_cur','select','SAR',[{v:'SAR',l:'ريال سعودي'},{v:'AED',l:'درهم إماراتي'},{v:'USD',l:'دولار أمريكي'}])+
          fld('المنطقة الزمنية','set_tz','select','Asia/Riyadh',[{v:'Asia/Riyadh',l:'الرياض (UTC+3)'},{v:'Asia/Dubai',l:'دبي (UTC+4)'}])+
          '<div class="flex justify-end mt-2"><button class="'+BTN_PRI+'" onclick="toast(\'تم حفظ الإعدادات\',\'ok\')"><i data-lucide="save" class="w-3.5 h-3.5"></i> حفظ</button></div>'+
        '</div>'
      :'')+
      (sec==='profile'?
        '<div class="'+PANEL+' flex flex-col gap-3">'+
          '<p class="text-[12.5px] font-extrabold text-ink mb-1">الملف الشخصي</p>'+
          '<div class="flex items-center gap-3 mb-3"><div class="'+AVA_XL+' bg-br/15 text-br">م</div><button class="'+BTN_SM+'" onclick="toast(\'تغيير الصورة...\',\'info\')"><i data-lucide="camera" class="w-3.5 h-3.5"></i> تغيير الصورة</button></div>'+
          fld('الاسم الكامل','prof_name','text','محمد خالد الفيصل')+
          fld('البريد الإلكتروني','prof_email','email','mohammed@est8.com')+
          fld('رقم الجوال','prof_phone','tel','0501111111')+
          '<hr class="border-ln my-2">'+
          '<p class="text-[12px] font-bold text-mut mb-2">تغيير كلمة المرور</p>'+
          fld('كلمة المرور الحالية','prof_pass_old','password','')+
          fld('كلمة المرور الجديدة','prof_pass','password','')+
          '<div class="flex justify-end mt-2"><button class="'+BTN_PRI+'" onclick="toast(\'تم حفظ الملف الشخصي\',\'ok\')"><i data-lucide="save" class="w-3.5 h-3.5"></i> حفظ</button></div>'+
        '</div>'
      :'')+
      (sec==='targets'?
        '<div class="'+PANEL+' flex flex-col gap-3">'+
          '<p class="text-[12.5px] font-extrabold text-ink mb-1">الأهداف الافتراضية الشهرية (لكل وكيل)</p>'+
          '<p class="text-[12px] text-mut mb-3">هذه القيم ستُطبَّق على كل وكيل جديد تلقائياً عند الإضافة.</p>'+
          fld('هدف العملاء المحتملين','tg_leads','number','10')+
          fld('هدف الصفقات','tg_deals','number','3')+
          fld('هدف الإيرادات (ر.س)','tg_revenue','number','1500000')+
          fld('هدف المعاينات','tg_viewings','number','20')+
          '<hr class="border-ln my-2">'+
          '<p class="text-[12px] font-bold text-mut mb-2">إسناد هدف لوكيل محدد الآن</p>'+
          fld('الوكيل','tg_agent_sel','select','',[{v:'',l:'اختر وكيلاً...'}].concat(S.users.map(function(u){return{v:u.id,l:u.name};})))+
          fld('الشهر / السنة','tg_period','text','2026-06')+
          '<div class="flex justify-end mt-2"><button class="'+BTN_PRI+'" onclick="toast(\'تم حفظ الأهداف\',\'ok\')"><i data-lucide="target" class="w-3.5 h-3.5"></i> حفظ الأهداف</button></div>'+
        '</div>'
      :'')+
      (sec==='whatsapp'?
        '<div class="'+PANEL+' flex flex-col gap-3">'+
          '<p class="text-[12.5px] font-extrabold text-ink mb-1">إعدادات واتساب Business</p>'+
          '<div class="flex items-center gap-3 p-3 bg-wa/5 border border-wa/20 rounded-xl mb-2"><div class="w-9 h-9 rounded-full bg-wa grid place-items-center"><i data-lucide="message-circle" class="w-4 h-4 text-[#06121f]"></i></div><div><p class="text-[12.5px] font-bold text-ink">متصل بـ WhatsApp Business API</p><p class="text-[11.5px] text-mut">رقم: +966501111111</p></div><span class="'+TOK+' mr-auto">نشط</span></div>'+
          fld('رقم واتساب Business','wa_num','tel','+966501111111')+
          fld('رسالة الترحيب التلقائية','wa_greet','textarea','مرحباً! أهلاً بك في مكتب Est8Core العقاري. كيف يمكنني مساعدتك؟')+
          fld('ساعات الرد التلقائي','wa_hours','text','9:00 ص - 9:00 م')+
          '<div class="flex justify-end mt-2"><button class="'+BTN_PRI+'" onclick="toast(\'تم حفظ إعدادات واتساب\',\'ok\')"><i data-lucide="save" class="w-3.5 h-3.5"></i> حفظ</button></div>'+
        '</div>'
      :'')+
      (sec==='notif'?
        '<div class="'+PANEL+' flex flex-col gap-3">'+
          '<p class="text-[12.5px] font-extrabold text-ink mb-1">إعدادات الإشعارات</p>'+
          [['lead_new','عميل محتمل جديد'],['deal_progress','تقدم صفقة'],['activity_due','نشاط مستحق'],['msg_new','رسائل واتساب جديدة'],['target_miss','تحذير تخطي الهدف'],['billing_alert','تنبيهات الفوترة']].map(function(n2){
            return'<div class="flex items-center justify-between py-2.5 border-b border-ln/50 last:border-0"><span class="text-[12.5px] text-ink font-bold">'+esc(n2[1])+'</span><label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked class="sr-only peer"><div class="w-9 h-5 bg-sf2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 after:content-[\'\'] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-br border border-ln"></div></label></div>';
          }).join('')+
          '<div class="flex justify-end mt-2"><button class="'+BTN_PRI+'" onclick="toast(\'تم حفظ إعدادات الإشعارات\',\'ok\')"><i data-lucide="save" class="w-3.5 h-3.5"></i> حفظ</button></div>'+
        '</div>'
      :'')+
      (sec==='integrations'?
        '<div class="flex flex-col gap-3">'+
          [
            {name:'WhatsApp Business',desc:'ربط حساب واتساب للتواصل المباشر',icon:'message-circle',color:'text-green-400',connected:true},
            {name:'بوابة بيوت',desc:'نشر العقارات تلقائياً على بيوت',icon:'building',color:'text-br',connected:true},
            {name:'بوابة عقار',desc:'نشر العقارات تلقائياً على عقار',icon:'building-2',color:'text-vi',connected:false},
            {name:'بريد إلكتروني SMTP',desc:'إرسال الإشعارات والتقارير عبر البريد',icon:'mail',color:'text-am',connected:false},
            {name:'Zapier',desc:'أتمتة العمليات وربط التطبيقات',icon:'zap',color:'text-b2',connected:false},
          ].map(function(it){return'<div class="'+PANEL+' flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-sf2 border border-ln grid place-items-center"><i data-lucide="'+it.icon+'" class="w-5 h-5 '+it.color+'"></i></div><div><p class="text-[13px] font-extrabold text-ink">'+esc(it.name)+'</p><p class="text-[11.5px] text-mut">'+esc(it.desc)+'</p></div></div><div class="flex items-center gap-2">'+(it.connected?'<span class="'+TOK+'">متصل</span><button class="'+BTN_DANGER_SM+'" onclick="toast(\'تم قطع الاتصال\',\'ok\')">قطع</button>':'<button class="'+BTN_PRI_SM+'" onclick="toast(\'جارٍ الربط...\',\'info\')">ربط</button>')+'</div></div>';}).join('')+
        '</div>'
      :'')+
    '</div>'+
  '</div>';
};
