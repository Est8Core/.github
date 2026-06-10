// ── TAILWIND CLASS CONSTANTS ───────────────────────────────────
var NI='flex items-center gap-2 px-2.5 py-2 rounded-lg text-mut font-semibold text-[13px] transition-all w-full text-right hover:text-ink hover:bg-sf2 cursor-pointer';
var NI_ON='flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#06121f] font-extrabold transition-all w-full text-right bg-gradient-to-br from-br to-b2 cursor-pointer';
var NI_BX='text-[9.5px] font-extrabold bg-sf2 text-mut px-[6px] py-px rounded-xl min-w-[18px] text-center';
var NI_BX_ON='text-[9.5px] font-extrabold text-[#06121f] px-[6px] py-px rounded-xl min-w-[18px] text-center bg-black/25';
var BTN='inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg text-[13px] font-bold border border-ln bg-sf2 text-ink transition-all whitespace-nowrap cursor-pointer hover:bg-[#1d2740] hover:border-[#2c3a5a]';
var BTN_PRI='inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg text-[13px] font-bold border-transparent text-[#06121f] bg-gradient-to-r from-br to-b2 whitespace-nowrap cursor-pointer hover:opacity-90';
var BTN_SM='inline-flex items-center gap-1 px-[11px] py-[5px] rounded-lg text-xs font-bold border border-ln bg-sf2 text-ink transition-all whitespace-nowrap cursor-pointer hover:bg-[#1d2740]';
var BTN_PRI_SM='inline-flex items-center gap-1 px-[11px] py-[5px] rounded-lg text-xs font-bold border-transparent text-[#06121f] bg-gradient-to-r from-br to-b2 whitespace-nowrap cursor-pointer hover:opacity-90';
var BTN_DANGER='inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg text-[13px] font-bold bg-rd/10 border border-rd/30 text-rd transition-all whitespace-nowrap cursor-pointer hover:bg-rd/20';
var BTN_DANGER_SM='inline-flex items-center gap-1 px-[11px] py-[5px] rounded-lg text-xs font-bold bg-rd/10 border border-rd/30 text-rd transition-all whitespace-nowrap cursor-pointer hover:bg-rd/20';
var BTN_WA='inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg text-[13px] font-bold bg-wa/10 border border-wa/25 text-green-400 transition-all whitespace-nowrap cursor-pointer hover:bg-wa/20';
var BTN_WA_SM='inline-flex items-center gap-1 px-[11px] py-[5px] rounded-lg text-xs font-bold bg-wa/10 border border-wa/25 text-green-400 transition-all whitespace-nowrap cursor-pointer hover:bg-wa/20';
var BTN_XS='inline-flex items-center gap-0.5 px-2 py-[3px] rounded-[7px] text-[11.5px] font-bold border border-ln bg-sf2 text-ink transition-all whitespace-nowrap cursor-pointer hover:bg-[#1d2740]';
var BTN_XS_PRI='inline-flex items-center gap-0.5 px-2 py-[3px] rounded-[7px] text-[11.5px] font-bold border-transparent text-[#06121f] bg-gradient-to-r from-br to-b2 whitespace-nowrap cursor-pointer hover:opacity-90';
var IBTN='w-7 h-7 rounded-[7px] bg-sf2 border border-ln grid place-items-center transition-all cursor-pointer flex-shrink-0 hover:bg-[#1d2740]';
var IBTN_DEL='w-7 h-7 rounded-[7px] bg-sf2 border border-ln grid place-items-center transition-all cursor-pointer flex-shrink-0 hover:bg-rd/15 hover:border-rd/30 hover:text-rd';
var PANEL='bg-sf border border-ln rounded-xl p-3.5';
var PANEL_SM='bg-sf border border-ln rounded-xl p-2.5';
var TBLW='bg-sf border border-ln rounded-xl overflow-hidden';
var TBL='w-full border-collapse text-[13px]';
var TH='bg-sf2 text-[10px] font-extrabold text-mut uppercase tracking-[.4px] py-2.5 px-3 border-b border-ln text-right';
var TD='py-2.5 px-3 border-b border-ln';
var TR_CLK='cursor-pointer transition-all hover:bg-sf2';
var TR_LAST='cursor-pointer transition-all';
var AVA='w-[34px] h-[34px] rounded-full grid place-items-center font-black text-[13px] flex-shrink-0';
var AVA_SM='w-7 h-7 rounded-full grid place-items-center font-black text-[11px] flex-shrink-0';
var AVA_LG='w-12 h-12 rounded-full grid place-items-center font-black text-[18px] flex-shrink-0';
var AVA_XL='w-16 h-16 rounded-full grid place-items-center font-black text-[24px] flex-shrink-0';
var TAG='inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-[5px] whitespace-nowrap gap-1';
var TOK=TAG+' bg-gr/10 text-gr border border-gr/20';
var THOT=TAG+' bg-rd/10 text-rd border border-rd/20';
var TWRM=TAG+' bg-am/10 text-yellow-300 border border-am/20';
var TMUT=TAG+' bg-sf2 text-mut border border-ln';
var TWA=TAG+' bg-wa/10 text-green-400 border border-wa/20';
var TVIO=TAG+' bg-vi/10 text-vi border border-vi/20';
var TBR=TAG+' bg-br/10 text-br border border-br/20';
var TB2=TAG+' bg-b2/10 text-b2 border border-b2/20';
var IPT='w-full bg-bg2 border border-ln rounded-lg px-[11px] py-2 text-ink text-[13px] outline-none transition-all focus:border-br';
var FLD='mb-3';
var FLD_LABEL='block text-[11.5px] font-bold text-mut mb-1';
var FR2='grid grid-cols-2 gap-2.5';
var FR3='grid grid-cols-3 gap-2.5';
var DKV='flex justify-between text-[12.5px] py-[5px] border-b border-dashed border-ln last:border-0';
var FC='px-3 py-[5px] rounded-full text-xs font-bold border border-ln bg-sf2 text-mut cursor-pointer transition-all hover:border-br hover:text-br';
var FC_ON='px-3 py-[5px] rounded-full text-xs font-bold border border-br bg-br/15 text-br cursor-pointer transition-all';
var KPI='bg-sf border border-ln rounded-xl p-3.5 relative overflow-hidden cursor-pointer transition-all hover:border-[#2c3a5a] kpi-stripe';
var PBAR='h-[5px] bg-sf2 rounded-full overflow-hidden mt-1';
var PB='h-full rounded-full transition-all duration-500';
var KC='bg-sf border border-ln rounded-lg p-[9px] cursor-pointer transition-all hover:border-br';
var PLANC='bg-sf border border-ln rounded-xl p-4 transition-all cursor-pointer';
var PLANC_ON='bg-sf border-2 border-br rounded-xl p-4 transition-all cursor-pointer shadow-[0_0_0_3px_rgba(79,140,255,.12)]';
var STN='flex items-center gap-2 px-2.5 py-2 rounded-lg text-mut font-bold text-[12.5px] cursor-pointer transition-all w-full hover:bg-sf2 hover:text-ink';
var STN_ON='flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#06121f] font-bold text-[12.5px] cursor-pointer transition-all w-full bg-gradient-to-r from-br to-b2';
var NOTIF_ROW='flex items-start gap-2.5 px-[13px] py-2.5 border-b border-ln transition-all cursor-pointer hover:bg-sf2';
var NOTIF_UNREAD='flex items-start gap-2.5 px-[13px] py-2.5 border-b border-ln bg-br/5 border-r-[3px] border-r-br transition-all cursor-pointer hover:bg-sf2/80';
var CV='px-[13px] py-2.5 cursor-pointer border-b border-ln transition-all hover:bg-sf2';
var CV_ON='px-[13px] py-2.5 cursor-pointer border-b border-ln bg-br/10 border-r-[3px] border-r-br transition-all';
var PROPCARD='bg-sf border border-ln rounded-xl overflow-hidden cursor-pointer transition-all hover:border-[#2c3a5a] hover:shadow-[0_4px_20px_rgba(0,0,0,.3)]';
var CONTCARD='bg-sf border border-ln rounded-xl p-3.5 cursor-pointer transition-all hover:border-[#2c3a5a]';
var LEADCARD='bg-sf border border-ln rounded-xl p-3 cursor-pointer transition-all hover:border-br';
var DZONE='border-2 border-dashed border-ln rounded-xl p-[34px] text-center cursor-pointer transition-all hover:border-br hover:bg-br/5';
var PCELL='w-[26px] h-[26px] rounded-[6px] border border-ln bg-bg2 grid place-items-center cursor-pointer transition-all mx-auto';
var PCELL_ON='w-[26px] h-[26px] rounded-[6px] border border-gr/35 bg-gr/15 grid place-items-center cursor-pointer transition-all mx-auto';
var TOAST_BASE='flex items-center gap-2 px-3.5 py-2.5 bg-sf border border-ln rounded-xl text-[13px] font-bold pointer-events-auto min-w-[220px] shadow-[0_12px_35px_rgba(0,0,0,.4)]';
var TOAST_OK=TOAST_BASE+' border-gr/35 bg-gr/10';
var TOAST_ERR=TOAST_BASE+' border-rd/35 bg-rd/10';
var TOAST_INFO=TOAST_BASE+' border-br/35 bg-br/10';
var KBAN_COL='min-w-[200px] max-w-[220px] flex-shrink-0';
var KBAN_HEAD='flex items-center justify-between px-2.5 py-[7px] bg-sf2 border border-ln rounded-t-lg text-[11.5px] font-extrabold';
var KBAN_BODY='bg-bg2 border border-ln border-t-0 rounded-b-lg p-1.5 flex flex-col gap-1.5 min-h-[100px]';
var TL_ITEM='relative pr-9 pb-5 tl-line last:pb-0 last:tl-line-none';
var MSG_IN='max-w-[72%] px-3 py-2 rounded-xl rounded-tl-sm text-[12.5px] bg-sf2 text-ink';
var MSG_OUT='max-w-[72%] px-3 py-2 rounded-xl rounded-tr-sm text-[12.5px] bg-br/20 text-ink border border-br/15';
var MSG_TMPL='max-w-[80%] px-3 py-2 rounded-xl text-[12.5px] bg-b2/10 text-ink border border-b2/20';

// ── NAV DEFINITION ─────────────────────────────────────────────
var NAV_DEF=[
  {id:'dash',label:'لوحة التحكم',icon:'layout-dashboard',badge:''},
  {id:'leads',label:'العملاء المحتملون',icon:'users',badge:'leads'},
  {id:'contacts',label:'جهات الاتصال',icon:'contact-2',badge:''},
  {id:'props',label:'العقارات',icon:'building',badge:''},
  {id:'deals',label:'الصفقات',icon:'trending-up',badge:'deals'},
  {sep:true},
  {id:'activities',label:'النشاطات والمهام',icon:'calendar-check',badge:'activities'},
  {id:'inbox',label:'الرسائل (واتساب)',icon:'message-circle',badge:'msgs'},
  {sep:true},
  {id:'branches',label:'الفروع',icon:'git-branch',badge:''},
  {id:'team',label:'الفريق',icon:'users-round',badge:''},
  {id:'users',label:'المستخدمون',icon:'user-cog',badge:''},
  {id:'roles',label:'الصلاحيات',icon:'shield-check',badge:''},
  {id:'targets',label:'الأهداف والمستهدفات',icon:'target',badge:''},
  {sep:true},
  {id:'notifs',label:'الإشعارات',icon:'bell',badge:'notifs'},
  {sep:true},
  {id:'dataio',label:'الاستيراد/التصدير',icon:'database',badge:''},
  {id:'reports',label:'التقارير',icon:'bar-chart-2',badge:''},
  {id:'billing',label:'الفوترة',icon:'credit-card',badge:''},
  {id:'settings',label:'الإعدادات',icon:'settings',badge:''},
];

// ── TITLES ────────────────────────────────────────────────────
var TITLES={
  dash:'لوحة التحكم',leads:'العملاء المحتملون',contacts:'جهات الاتصال',
  props:'العقارات',deals:'الصفقات (Kanban)',
  activities:'النشاطات والمهام',inbox:'الرسائل - واتساب',
  branches:'الفروع',team:'الفريق',users:'المستخدمون',
  roles:'الأدوار والصلاحيات',targets:'الأهداف والمستهدفات',
  notifs:'الإشعارات',dataio:'الاستيراد والتصدير',
  reports:'التقارير',billing:'الفوترة',settings:'الإعدادات',
  leadDetail:'تفاصيل العميل المحتمل',propDetail:'تفاصيل العقار',
  contactDetail:'ملف جهة الاتصال',dealDetail:'تفاصيل الصفقة',
};
