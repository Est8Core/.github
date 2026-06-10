// ── LEAD ACTIONS ──────────────────────────────────────────────
function openAddLead(){
  showModal('إضافة عميل محتمل جديد',
    '<div class="flex flex-col gap-0">'+
      fld('الاسم الكامل','al_name','text','')+
      fld('رقم الجوال','al_phone','tel','')+
      fld('البريد الإلكتروني','al_email','email','')+
      '<div class="'+FR2+'">'+
        fld('المصدر','al_source','select','',[['موقع إلكتروني','موقع إلكتروني'],['إعلان إنستغرام','إعلان إنستغرام'],['إعلان تويتر','إعلان تويتر'],['إحالة من عميل','إحالة من عميل'],['معرض عقاري','معرض عقاري']].map(function(o){return{v:o[0],l:o[1]};}))+
        fld('الحالة','al_status','select','ساخن',[{v:'ساخن',l:'ساخن'},{v:'دافئ',l:'دافئ'},{v:'بارد',l:'بارد'}])+
      '</div>'+
      '<div class="'+FR2+'">'+
        fld('الميزانية (حد أدنى)','al_bmin','number','')+
        fld('الميزانية (حد أقصى)','al_bmax','number','')+
      '</div>'+
      fld('ملاحظات','al_notes','textarea','')+
    '</div>',
    '<button class="'+BTN_PRI+'" onclick="doAddLead()"><i data-lucide="user-plus" class="w-3.5 h-3.5"></i> إضافة</button>'+
    '<button class="'+BTN+'" onclick="closeModal()">إلغاء</button>'
  );
}
function doAddLead(){
  var name=fldVal('al_name');if(!name.trim()){toast('الاسم مطلوب','err');return;}
  var newL={id:'L'+(S.leads.length+100),name:name.trim(),phone:fldVal('al_phone'),email:fldVal('al_email'),
    source:fldVal('al_source')||'موقع إلكتروني',stage:'جديد',status:fldVal('al_status')||'دافئ',score:50,
    assignedTo:S.users[0].id,branchId:'B1',teamId:'T1',createdAt:'2026-06-09',lastActivity:'2026-06-09',
    req:{budgetMin:Number(fldVal('al_bmin'))||0,budgetMax:Number(fldVal('al_bmax'))||0,types:[],areas:[],bedrooms:[]},
    notes:fldVal('al_notes'),activities:[]};
  S.leads.push(newL);
  closeModal(); toast('تم إضافة العميل المحتمل بنجاح','ok');
  renderApp();
}

function delLead(id){
  var l=S.leads.find(function(x){return x.id===id;});if(!l)return;
  confirmDel('حذف العميل','هل أنت متأكد من حذف '+l.name+'? لا يمكن التراجع عن هذه العملية.','_doDelLead_'+id);
  window['_doDelLead_'+id]=function(){
    S.leads=S.leads.filter(function(x){return x.id!==id;});
    toast('تم الحذف','ok'); switchView('leads');
  };
}

function saveLeadNotes(id){
  var l=S.leads.find(function(x){return x.id===id;});if(!l)return;
  l.notes=fldVal('prof_notes')||document.querySelector('#mainContent textarea')&&document.querySelector('#mainContent textarea').value||l.notes;
  toast('تم حفظ الملاحظات','ok');
}

function openConvertLead(leadId){
  showModal('تحويل العميل المحتمل إلى جهة اتصال',
    '<div class="flex flex-col items-center gap-3 py-2">'+
      '<div class="w-12 h-12 rounded-full bg-gr/15 border border-gr/30 grid place-items-center"><i data-lucide="user-check" class="w-5 h-5 text-gr"></i></div>'+
      '<p class="text-[13px] text-mut text-center">سيتم إنشاء جهة اتصال جديدة بنفس بيانات العميل المحتمل، مع الاحتفاظ بكل سجلات النشاطات.</p>'+
    '</div>',
    '<button class="'+BTN_PRI+'" onclick="doConvertLead(\''+leadId+'\')"><i data-lucide="user-check" class="w-3.5 h-3.5"></i> تحويل</button>'+
    '<button class="'+BTN+'" onclick="closeModal()">إلغاء</button>'
  );
}
function doConvertLead(leadId){
  var l=S.leads.find(function(x){return x.id===leadId;});if(!l)return;
  var exists=S.contacts.find(function(c){return c.phones.some(function(p){return p.number===l.phone;});});
  if(exists){toast('جهة الاتصال موجودة بالفعل','err');closeModal();return;}
  var newC={id:'C'+(S.contacts.length+100),name:l.name,phones:[{label:'جوال',number:l.phone}],emails:[{label:'شخصي',email:l.email}],type:'مشتري',company:'',address:'',birthday:'',tags:[],linkedLeads:[l.id],linkedDeals:[],notes:l.notes,source:l.source,createdAt:'2026-06-09'};
  S.contacts.push(newC);
  closeModal(); toast('تم تحويل العميل إلى جهة اتصال بنجاح','ok');
}

// ── CONTACT ACTIONS ───────────────────────────────────────────
function openAddContact(){
  showModal('إضافة جهة اتصال',
    '<div class="flex flex-col gap-0">'+
      fld('الاسم الكامل','ac_name','text','')+
      '<div class="'+FR2+'">'+
        fld('رقم الجوال الرئيسي','ac_phone','tel','')+
        fld('تصنيف الرقم','ac_plabel','select','جوال',[{v:'جوال',l:'جوال'},{v:'عمل',l:'عمل'},{v:'منزل',l:'منزل'}])+
      '</div>'+
      '<div class="'+FR2+'">'+
        fld('البريد الإلكتروني','ac_email','email','')+
        fld('نوع العميل','ac_type','select','مشتري',[{v:'مشتري',l:'مشتري'},{v:'بائع',l:'بائع'},{v:'مستأجر',l:'مستأجر'},{v:'مستثمر',l:'مستثمر'}])+
      '</div>'+
      fld('الشركة','ac_company','text','')+
      fld('العنوان','ac_address','text','')+
    '</div>',
    '<button class="'+BTN_PRI+'" onclick="doAddContact()"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة</button>'+
    '<button class="'+BTN+'" onclick="closeModal()">إلغاء</button>'
  );
}
function doAddContact(){
  var name=fldVal('ac_name');if(!name.trim()){toast('الاسم مطلوب','err');return;}
  var newC={id:'C'+(S.contacts.length+100),name:name.trim(),phones:[{label:fldVal('ac_plabel')||'جوال',number:fldVal('ac_phone')}],emails:[{label:'شخصي',email:fldVal('ac_email')}],type:fldVal('ac_type')||'مشتري',company:fldVal('ac_company'),address:fldVal('ac_address'),birthday:'',tags:[],linkedLeads:[],linkedDeals:[],notes:'',source:'إضافة يدوية',createdAt:'2026-06-09'};
  S.contacts.push(newC);
  closeModal(); toast('تم إضافة جهة الاتصال بنجاح','ok'); renderApp();
}

function openAddPhone(contactId){
  showModal('إضافة رقم هاتف',
    '<div class="'+FR2+'">'+fld('التصنيف','ap_label','select','جوال',[{v:'جوال',l:'جوال'},{v:'عمل',l:'عمل'},{v:'منزل',l:'منزل'},{v:'جوال 2',l:'جوال 2'}])+fld('رقم الهاتف','ap_num','tel','')+'</div>',
    '<button class="'+BTN_PRI+'" onclick="doAddPhone(\''+contactId+'\')"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة</button>'+
    '<button class="'+BTN+'" onclick="closeModal()">إلغاء</button>'
  );
}
function doAddPhone(contactId){
  var num=fldVal('ap_num');if(!num.trim()){toast('الرقم مطلوب','err');return;}
  var c=S.contacts.find(function(x){return x.id===contactId;});if(!c)return;
  c.phones.push({label:fldVal('ap_label')||'جوال',number:num.trim()});
  closeModal(); toast('تم إضافة الرقم بنجاح','ok'); renderMain();
}

function openAddEmail(contactId){
  showModal('إضافة بريد إلكتروني',
    '<div class="'+FR2+'">'+fld('التصنيف','ae_label','select','شخصي',[{v:'شخصي',l:'شخصي'},{v:'عمل',l:'عمل'}])+fld('البريد الإلكتروني','ae_email','email','')+'</div>',
    '<button class="'+BTN_PRI+'" onclick="doAddEmail(\''+contactId+'\')"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة</button>'+
    '<button class="'+BTN+'" onclick="closeModal()">إلغاء</button>'
  );
}
function doAddEmail(contactId){
  var em=fldVal('ae_email');if(!em.trim()){toast('البريد مطلوب','err');return;}
  var c=S.contacts.find(function(x){return x.id===contactId;});if(!c)return;
  c.emails.push({label:fldVal('ae_label')||'شخصي',email:em.trim()});
  closeModal(); toast('تم إضافة البريد بنجاح','ok'); renderMain();
}

// ── PROPERTY ACTIONS ──────────────────────────────────────────
function openAddProp(){
  showModal('إضافة عقار جديد',
    '<div class="flex flex-col gap-0">'+
      fld('اسم / وصف العقار','ap2_name','text','')+
      '<div class="'+FR2+'">'+
        fld('النوع','ap2_type','select','شقة',[{v:'شقة',l:'شقة'},{v:'فيلا',l:'فيلا'},{v:'أرض',l:'أرض'},{v:'مكتب',l:'مكتب'},{v:'تاون هاوس',l:'تاون هاوس'}])+
        fld('السعر (ر.س)','ap2_price','number','')+
      '</div>'+
      '<div class="'+FR2+'">'+
        fld('المدينة','ap2_city','text','')+
        fld('الحي','ap2_district','text','')+
      '</div>'+
      '<div class="'+FR3+'">'+
        fld('غرف','ap2_beds','number','')+
        fld('حمامات','ap2_baths','number','')+
        fld('المساحة م²','ap2_area','number','')+
      '</div>'+
      fld('نوع السعر','ap2_ptype','select','بيع',[{v:'بيع',l:'بيع'},{v:'إيجار سنوي',l:'إيجار سنوي'},{v:'إيجار شهري',l:'إيجار شهري'}])+
    '</div>',
    '<button class="'+BTN_PRI+'" onclick="doAddProp()"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة</button>'+
    '<button class="'+BTN+'" onclick="closeModal()">إلغاء</button>'
  );
}
function doAddProp(){
  var name=fldVal('ap2_name');if(!name.trim()){toast('الاسم مطلوب','err');return;}
  var newP={id:'P'+(S.props.length+100),name:name.trim(),type:fldVal('ap2_type')||'شقة',
    bedrooms:Number(fldVal('ap2_beds'))||0,bathrooms:Number(fldVal('ap2_baths'))||0,parking:0,floor:0,totalFloors:0,
    area:Number(fldVal('ap2_area'))||0,buildingAge:0,price:Number(fldVal('ap2_price'))||0,
    priceType:fldVal('ap2_ptype')||'بيع',location:fldVal('ap2_city')+' - '+fldVal('ap2_district'),
    district:fldVal('ap2_district'),city:fldVal('ap2_city'),
    status:'متاح',published:false,publishedPortals:[],photos:0,amenities:[],description:'',
    documents:[],priceHistory:[{price:Number(fldVal('ap2_price'))||0,date:'2026-06-09',reason:'سعر البداية'}],
    viewings:0,linkedDeals:[]};
  S.props.push(newP);
  closeModal(); toast('تم إضافة العقار بنجاح','ok'); renderApp();
}

// ── DEAL ACTIONS ──────────────────────────────────────────────
function openAddDeal(propId){
  showModal('إضافة صفقة جديدة',
    '<div class="flex flex-col gap-0">'+
      fld('اسم الصفقة','ad_name','text','')+
      '<div class="'+FR2+'">'+
        fld('قيمة الصفقة (ر.س)','ad_value','number','')+
        fld('نسبة العمولة %','ad_comm','number','2.5')+
      '</div>'+
      fld('الوكيل المسؤول','ad_agent','select','',[{v:'',l:'اختر وكيلاً...'}].concat(S.users.map(function(u){return{v:u.id,l:u.name};})))+
      fld('تاريخ الإغلاق المتوقع','ad_close','text','2026-07-15')+
      fld('ملاحظات','ad_notes','textarea','')+
    '</div>',
    '<button class="'+BTN_PRI+'" onclick="doAddDeal(\''+propId+'\')"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة</button>'+
    '<button class="'+BTN+'" onclick="closeModal()">إلغاء</button>'
  );
}
function doAddDeal(propId){
  var name=fldVal('ad_name');if(!name.trim()){toast('اسم الصفقة مطلوب','err');return;}
  var newD={id:'D'+(S.deals.length+100),name:name.trim(),leadId:'',contactId:'',propId:propId||'',
    stage:'تواصل أولي',value:Number(fldVal('ad_value'))||0,commission:Number(fldVal('ad_comm'))||2.5,
    commissionSplit:{agent:40,office:50,referral:10},branchId:'B1',
    assignedTo:fldVal('ad_agent')||S.users[0].id,teamId:'T1',
    expectedCloseDate:fldVal('ad_close')||'2026-07-31',createdAt:'2026-06-09',
    stageHistory:[{stage:'تواصل أولي',date:'2026-06-09',user:S.users[0].name}],
    documents:[],notes:fldVal('ad_notes')};
  S.deals.push(newD);
  closeModal(); toast('تم إضافة الصفقة بنجاح','ok'); renderApp();
}

// ── ACTIVITY ACTIONS ──────────────────────────────────────────
function openAddActivity(){
  showModal('إضافة نشاط جديد',
    '<div class="flex flex-col gap-0">'+
      fld('نوع النشاط','act_type','select','call',[{v:'call',l:'اتصال'},{v:'viewing',l:'معاينة'},{v:'meeting',l:'اجتماع'},{v:'email',l:'بريد إلكتروني'},{v:'task',l:'مهمة'},{v:'note',l:'ملاحظة'}])+
      fld('العنوان','act_title','text','')+
      '<div class="'+FR2+'">'+
        fld('التاريخ','act_date','text','2026-06-10')+
        fld('الوقت','act_time','text','10:00')+
      '</div>'+
      fld('العميل المرتبط','act_lead','select','',[{v:'',l:'— اختياري —'}].concat(S.leads.map(function(l){return{v:l.id,l:l.name};})))+
      fld('الوكيل المسؤول','act_agent','select','',[{v:'',l:'اختر وكيلاً...'}].concat(S.users.map(function(u){return{v:u.id,l:u.name};})))+
      fld('ملاحظات','act_notes','textarea','')+
    '</div>',
    '<button class="'+BTN_PRI+'" onclick="doAddActivity()"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة</button>'+
    '<button class="'+BTN+'" onclick="closeModal()">إلغاء</button>'
  );
}
function doAddActivity(){
  var title=fldVal('act_title');if(!title.trim()){toast('العنوان مطلوب','err');return;}
  var newA={id:'ACT'+(S.activities.length+100),type:fldVal('act_type')||'call',title:title.trim(),
    leadId:fldVal('act_lead')||'',contactId:'',dealId:'',propId:'',
    date:fldVal('act_date')||'2026-06-10',time:fldVal('act_time')||'',duration:0,
    status:'قادم',assignedTo:fldVal('act_agent')||S.users[0].id,notes:fldVal('act_notes')};
  S.activities.push(newA);
  closeModal(); toast('تم إضافة النشاط بنجاح','ok'); renderApp();
}

function openScheduleActivity(leadId){
  showModal('جدولة نشاط',
    '<div class="flex flex-col gap-0">'+
      fld('نوع النشاط','sact_type','select','call',[{v:'call',l:'اتصال'},{v:'viewing',l:'معاينة'},{v:'meeting',l:'اجتماع'},{v:'task',l:'مهمة'}])+
      fld('العنوان','sact_title','text','')+
      '<div class="'+FR2+'">'+
        fld('التاريخ','sact_date','text','2026-06-11')+
        fld('الوقت','sact_time','text','10:00')+
      '</div>'+
      fld('ملاحظات','sact_notes','textarea','')+
    '</div>',
    '<button class="'+BTN_PRI+'" onclick="doScheduleActivity(\''+leadId+'\')"><i data-lucide="calendar-plus" class="w-3.5 h-3.5"></i> جدولة</button>'+
    '<button class="'+BTN+'" onclick="closeModal()">إلغاء</button>'
  );
}
function doScheduleActivity(leadId){
  var title=fldVal('sact_title');if(!title.trim()){toast('العنوان مطلوب','err');return;}
  var newA={id:'ACT'+(S.activities.length+100),type:fldVal('sact_type')||'call',title:title.trim(),
    leadId:leadId,contactId:'',dealId:'',propId:'',date:fldVal('sact_date'),time:fldVal('sact_time'),
    duration:0,status:'قادم',assignedTo:S.users[0].id,notes:fldVal('sact_notes')};
  S.activities.push(newA);
  closeModal(); toast('تم جدولة النشاط بنجاح','ok'); updateBadges();
}

function completeActivity(id){
  var a=S.activities.find(function(x){return x.id===id;});if(!a)return;
  a.status='مكتمل';
  toast('تم تحديد النشاط كمكتمل','ok'); renderMain();
}

// ── BRANCH ACTIONS ────────────────────────────────────────────
function openAddBranch(){
  showModal('إضافة فرع جديد',
    '<div class="flex flex-col gap-0">'+
      fld('اسم الفرع','ab_name','text','')+
      fld('المدير','ab_mgr','select','',[{v:'',l:'اختر مديراً...'}].concat(S.users.filter(function(u){return u.role==='owner'||u.role==='branch_manager';}).map(function(u){return{v:u.id,l:u.name};})))+
      fld('الهاتف','ab_phone','tel','')+
      fld('العنوان','ab_addr','text','')+
    '</div>',
    '<button class="'+BTN_PRI+'" onclick="doAddBranch()"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة</button>'+
    '<button class="'+BTN+'" onclick="closeModal()">إلغاء</button>'
  );
}
function doAddBranch(){
  var name=fldVal('ab_name');if(!name.trim()){toast('الاسم مطلوب','err');return;}
  S.branches.push({id:'B'+(S.branches.length+100),name:name.trim(),manager:fldVal('ab_mgr'),phone:fldVal('ab_phone'),address:fldVal('ab_addr'),agents:0,leads:0,deals:0,revenue:0,active:true});
  closeModal(); toast('تم إضافة الفرع بنجاح','ok'); renderApp();
}

// ── TEAM ACTIONS ──────────────────────────────────────────────
function openAddTeam(){
  showModal('إضافة فريق جديد',
    '<div class="flex flex-col gap-0">'+
      fld('اسم الفريق','at_name','text','')+
      fld('الفرع','at_branch','select','',[{v:'',l:'اختر فرعاً...'}].concat(S.branches.map(function(b){return{v:b.id,l:b.name};})))+
      fld('قائد الفريق','at_leader','select','',[{v:'',l:'اختر قائداً...'}].concat(S.users.map(function(u){return{v:u.id,l:u.name};})))+
      fld('الهدف الشهري (ر.س)','at_target','number','')+
    '</div>',
    '<button class="'+BTN_PRI+'" onclick="doAddTeam()"><i data-lucide="plus" class="w-3.5 h-3.5"></i> إضافة</button>'+
    '<button class="'+BTN+'" onclick="closeModal()">إلغاء</button>'
  );
}
function doAddTeam(){
  var name=fldVal('at_name');if(!name.trim()){toast('الاسم مطلوب','err');return;}
  S.teams.push({id:'T'+(S.teams.length+100),name:name.trim(),branchId:fldVal('at_branch'),leader:fldVal('at_leader'),members:[fldVal('at_leader')],target:Number(fldVal('at_target'))||0});
  closeModal(); toast('تم إضافة الفريق بنجاح','ok'); renderApp();
}

// ── USER ACTIONS ──────────────────────────────────────────────
function openAddUser(){
  showModal('إضافة مستخدم جديد',
    '<div class="flex flex-col gap-0">'+
      fld('الاسم الكامل','au_name','text','')+
      fld('البريد الإلكتروني','au_email','email','')+
      '<div class="'+FR2+'">'+
        fld('رقم الجوال','au_phone','tel','')+
        fld('الدور','au_role','select','sales_agent',[{v:'owner',l:'مالك'},{v:'branch_manager',l:'مدير فرع'},{v:'team_leader',l:'قائد فريق'},{v:'sales_agent',l:'وكيل مبيعات'}])+
      '</div>'+
      fld('الفرع','au_branch','select','',[{v:'',l:'اختر فرعاً...'}].concat(S.branches.map(function(b){return{v:b.id,l:b.name};})))+
    '</div>',
    '<button class="'+BTN_PRI+'" onclick="doAddUser()"><i data-lucide="user-plus" class="w-3.5 h-3.5"></i> إضافة</button>'+
    '<button class="'+BTN+'" onclick="closeModal()">إلغاء</button>'
  );
}
function doAddUser(){
  var name=fldVal('au_name');if(!name.trim()){toast('الاسم مطلوب','err');return;}
  S.users.push({id:'U'+(S.users.length+100),name:name.trim(),email:fldVal('au_email'),phone:fldVal('au_phone'),role:fldVal('au_role')||'sales_agent',branch:fldVal('au_branch'),team:'',status:'نشط',avatar:initials(name),joinDate:'2026-06-09',deals:0,leads:0,revenue:0});
  closeModal(); toast('تم إضافة المستخدم بنجاح','ok'); renderApp();
}

// ── TARGET ACTIONS ────────────────────────────────────────────
function openSetTarget(scope, scopeId){
  var isAgent=scope==='agent';
  showModal('تحديد هدف شهري',
    '<div class="flex flex-col gap-0">'+
      (isAgent?fld('الوكيل','tgt_agent','select',scopeId||'',[{v:'',l:'اختر وكيلاً...'}].concat(S.users.map(function(u){return{v:u.id,l:u.name};}))):'<p class="text-[12px] text-mut mb-3">الفرع: <strong class="text-ink">'+(S.branches.find(function(b){return b.id===scopeId;})||{name:scopeId}).name+'</strong></p>')+
      fld('الفترة','tgt_period','text','2026-06')+
      '<div class="'+FR2+'">'+
        fld('هدف العملاء','tgt_leads','number','10')+
        fld('هدف الصفقات','tgt_deals','number','3')+
      '</div>'+
      '<div class="'+FR2+'">'+
        fld('هدف الإيرادات','tgt_rev','number','1500000')+
        fld('هدف المعاينات','tgt_view','number','20')+
      '</div>'+
    '</div>',
    '<button class="'+BTN_PRI+'" onclick="doSetTarget(\''+scope+'\',\''+scopeId+'\')"><i data-lucide="target" class="w-3.5 h-3.5"></i> حفظ الهدف</button>'+
    '<button class="'+BTN+'" onclick="closeModal()">إلغاء</button>'
  );
}
function doSetTarget(scope, scopeId){
  var sid=(scope==='agent'?fldVal('tgt_agent'):scopeId)||scopeId;
  if(!sid){toast('يرجى اختيار الوكيل','err');return;}
  var period=fldVal('tgt_period')||'2026-06';var pp=period.split('-');
  var existing=S.targets.find(function(t){return t.scope===scope&&t.scopeId===sid&&t.period==='monthly'&&t.year===Number(pp[0])&&t.month===Number(pp[1]);});
  var metrics=[{type:'leads',target:Number(fldVal('tgt_leads'))||10,achieved:0},{type:'deals',target:Number(fldVal('tgt_deals'))||3,achieved:0},{type:'revenue',target:Number(fldVal('tgt_rev'))||1500000,achieved:0},{type:'viewings',target:Number(fldVal('tgt_view'))||20,achieved:0}];
  if(existing){existing.metrics=metrics;}else{S.targets.push({id:'TG'+(S.targets.length+100),scope:scope,scopeId:sid,period:'monthly',year:Number(pp[0]),month:Number(pp[1]),metrics:metrics});}
  closeModal(); toast('تم حفظ الهدف بنجاح','ok'); switchView('targets');
}

// ── INBOX ACTIONS ─────────────────────────────────────────────
function sendMsg(){
  var inp=document.getElementById('msgInput');if(!inp)return;
  var txt=inp.value.trim();if(!txt)return;
  var conv=S.CUR_CONV;if(!S.messages[conv])S.messages[conv]=[];
  S.messages[conv].push({id:'m'+Date.now(),dir:'out',type:'text',text:txt,time:'الآن',status:'sent'});
  inp.value='';
  var cv=S.conversations.find(function(c){return c.id===conv;});if(cv){cv.lastMsg=txt;cv.lastTime='الآن';}
  renderMain();
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',function(){
  // Overlay click → close drawer
  var ov=document.getElementById('overlay');
  if(ov)ov.addEventListener('click',closeDrawer);
  // Close modal on backdrop click
  var gm=document.getElementById('globalModal');
  if(gm)gm.addEventListener('click',function(e){if(e.target===gm)closeModal();});
  // Close ndrop when clicking outside
  document.addEventListener('click',function(e){
    var nd=document.getElementById('nDrop');var nb=document.getElementById('nBell');
    if(nd&&nb&&!nd.contains(e.target)&&!nb.contains(e.target)){closeNDrop();}
  });
  // Initial render
  renderApp();
  // Welcome toast
  setTimeout(function(){toast('مرحباً بك في Est8Core CRM 👋','ok');},500);
});
