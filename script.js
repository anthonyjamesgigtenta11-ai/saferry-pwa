const appContent=document.getElementById("appContent");
const navItems=document.querySelectorAll(".nav-item");
const menuButton=document.getElementById("menuButton");
const menuClose=document.getElementById("menuClose");
const menuOverlay=document.getElementById("menuOverlay");
const sideMenu=document.getElementById("sideMenu");
let currentRoute="home";

const fallbackSchedule={
  "HAGNAYA → STA. FE":[
    {time:"2:00 AM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"},
    {time:"4:00 AM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"},
    {time:"7:00 AM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"},
    {time:"8:00 AM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"},
    {time:"10:30 AM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"},
    {time:"12:30 PM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"},
    {time:"2:30 PM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"},
    {time:"4:30 PM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"}
  ],
  "STA. FE → HAGNAYA":[
    {time:"4:00 AM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"},
    {time:"8:30 AM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"},
    {time:"10:30 AM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"},
    {time:"12:30 PM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"},
    {time:"2:30 PM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"},
    {time:"4:30 PM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"},
    {time:"6:30 PM",operator:"Super Shuttle Ferry",type:"Daily RORO trip",duration:"Est. travel: 1 hr 30 mins"}
  ]
};
const fallbackSea=[
 ["Plan Ahead","Know the trip schedule, buy a ticket early when possible, and arrive at the port early."],
 ["Board Authorized Vessels","Use registered/authorized passenger vessels and follow port and crew instructions."],
 ["Wear Your Life Jacket","Follow the vessel's life-jacket instructions and wear or keep it ready as directed by the crew."],
 ["Respect Passenger Capacity","Do not board an overcrowded vessel or a trip that exceeds its authorized passenger capacity."],
 ["Check Your Passenger Details","Make sure your ticket and passenger-manifest details are correct before boarding."],
 ["Follow Weather & Port Advisories","Do not rely only on Saferry. Follow current operator, port, Coast Guard, and weather advisories."]
];
const fallbackBeach=[
 ["Choose a Safe Area","Use designated or monitored swimming areas and check warning signs and local safety notices."],
 ["Look for Lifeguards","Prefer beaches with lifeguards and readily available life-saving equipment."],
 ["Stay With Others","Do not swim alone; adults should accompany children and vulnerable swimmers."],
 ["Avoid Hazard Areas","Stay away from marked danger areas and zones used by anchored or moving watercraft."],
 ["Do Not Swim Impaired","Avoid swimming when drunk or otherwise unable to respond safely to changing conditions."],
 ["Know the Local Emergency Number","Keep 911 and relevant local emergency contacts accessible before entering the water."]
];
const fallbackContacts=[
 ["National Emergency Hotline","911","rescue"],
 ["PNP Emergency Hotline","117","police"],
 ["Philippine Coast Guard","0917 724 3682","coast"],
 ["Bantayan District Hospital","0932 649 3307","hospital"],
 ["LGU Santa Fe","0919 340 4382","rescue"],
 ["LGU Bantayan","460-9063","rescue"],
 ["LGU Madridejos","439-7586","rescue"]
];

let scheduleDemo={...fallbackSchedule};
let scheduleMeta={status:"reference",lastChecked:"2026-10-06",note:"Operator-listed reference schedule; confirm with the operator before travel."};
let safetySea=[...fallbackSea];
let safetyBeach=[...fallbackBeach];
let contacts=[...fallbackContacts];
let contactMeta={status:"reference",lastChecked:"2026-10-06",note:"Use 911 for immediate emergencies; local contact details can change."};
let scheduleDirection="HAGNAYA → STA. FE";
let scheduleDate=new Date();
let safetyTab="sea";
let deferredInstallPrompt=null;
let remoteConfig={enabled:false,provider:"github-api",repository:"",branch:"main",manifestPath:"data-update-manifest.json",manifestUrl:"",refreshIntervalMinutes:60};
let syncMeta={status:"local",lastSync:null,version:null,message:"Using local reference data."};

const icons={
 home:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 10.5 8.5-7 8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M9.5 20v-6h5v6"/></svg>`,
 ferry:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13.5h16l-2.2 4H6.2Z"/><path d="M7 13.5V8.2h10v5.3M9 8.2V5.6h6v2.6M12 3v2.6"/><path d="M8 10.4h1M11.5 10.4h1M15 10.4h1"/><path d="M4 18.2c1 .8 2.1 1.2 3.4 1.2s2.4-.4 3.4-1.2c1 .8 2.1 1.2 3.4 1.2s2.4-.4 3.4-1.2c1 .8 2.1 1.2 3.4 1.2"/></svg>`,
 shield:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 4.4-2.8 8.5-7 10-4.2-1.5-7-5.6-7-10V6l7-3Z"/><path d="m9 12 2 2.1 4-4.2"/></svg>`,
 phone:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.7 4.8c.7-.7 1.8-.9 2.7-.4l1.8 1a2 2 0 0 1 .9 2.8l-1 1.6a15.2 15.2 0 0 0 3 3l1.6-1a2 2 0 0 1 2.8.9l1 1.8c.5.9.3 2-.4 2.7l-1 1c-.8.8-2 1.1-3.1.7A17.3 17.3 0 0 1 5.1 9.7c-.4-1.1-.1-2.3.7-3.1l.9-.9Z"/></svg>`,
 info:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7.2h.01"/></svg>`,
 calendar:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/></svg>`,
 cloudOff:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14"/><path d="M7 18h9.5a4.5 4.5 0 0 0 1.1-8.9A6 6 0 0 0 7.2 7.2"/><path d="M6 10.5A4.2 4.2 0 0 0 7 18"/></svg>`,
 alert:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8 15H4L12 4Z"/><path d="M12 9v4M12 16h.01"/></svg>`,
 plan:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="m14.8 9.2-2.6 5.8-5.8 2.6 2.6-5.8 5.8-2.6Z"/><circle cx="12.2" cy="11.8" r="1.1"/></svg>`,
 vessel:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14h16l-2 4H6l-2-4Z"/><path d="M7 14V8h10v6M9 8V6h6v2M12 4v2"/><path d="M4 19.5c1 .6 2 .9 3.2.9s2.2-.3 3.2-.9c1 .6 2 .9 3.2.9s2.2-.3 3.2-.9c1 .6 2 .9 3.2.9"/></svg>`,
 lifejacket:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.5 6 10v9.5h5V11h2v8.5h5V10l-2-5.5-4 3-4-3Z"/><path d="M11 8.2h2M7.3 12.5H11M13 12.5h3.7"/></svg>`,
 capacity:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="2"/><circle cx="16" cy="8" r="2"/><path d="M4.8 18c.2-2.8 1.4-4.3 3.2-4.3S11 15.2 11.2 18M12.8 18c.2-2.8 1.4-4.3 3.2-4.3s3 1.5 3.2 4.3"/><path d="M5 20h14"/></svg>`,
 ticket:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14v12H5z"/><path d="M9 6v12M11.8 9h4M11.8 12h3M11.8 15h2"/></svg>`,
 advisory:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 15.5c2-4 4.2-6 7-6s5 2 7 6"/><path d="M8 15.5c1.2-2.2 2.5-3.3 4-3.3s2.8 1.1 4 3.3"/><path d="M12 5v3M5.5 8l2.1 2.1M18.5 8l-2.1 2.1"/></svg>`,
 swim:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="15.5" cy="6.5" r="2"/><path d="M11.5 11.5c2.1 0 3.3 1.2 4.7 1.2 1.2 0 2.2-.5 3-1.2"/><path d="m10 12.5-2.4 2.1M12.5 12.5l-1 5.5M13.8 13.2l3.5 4"/><path d="M4 19.5c1 .6 2 .9 3.2.9s2.2-.3 3.2-.9c1 .6 2 .9 3.2.9s2.2-.3 3.2-.9c1 .6 2 .9 3.2.9"/></svg>`,
 lifeguard:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="6.5" r="2.2"/><path d="M7.5 19c.3-4.2 1.7-6.3 4.5-6.3s4.2 2.1 4.5 6.3"/><path d="M8 13h8M9 16h6"/></svg>`,
 buddy:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="2"/><circle cx="16" cy="8" r="2"/><path d="M4.5 18c.2-3 1.5-4.7 3.5-4.7s3.3 1.7 3.5 4.7M12.5 18c.2-3 1.5-4.7 3.5-4.7s3.3 1.7 3.5 4.7"/><path d="M9.5 11.5h5"/></svg>`,
 hazard:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8 15H4L12 4Z"/><path d="M12 9v4"/><path d="M12 16h.01"/><path d="M6 21h12"/></svg>`,
 noImpairment:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6v3H9z"/><path d="M10 7v4.5A4.5 4.5 0 0 0 14.5 16H16M7 20h10"/><path d="m5 5 14 14"/></svg>`,
 emergencyReady:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 20 7v5c0 4.5-3 8.2-8 10-5-1.8-8-5.5-8-10V7l8-3Z"/><path d="M12 8v5M12 16h.01"/></svg>`,
 policeBadge:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 18 6v4.8c0 4-2.4 7.3-6 8.8-3.6-1.5-6-4.8-6-8.8V6l6-3Z"/><path d="m12 7 1 2 2.2.2-1.7 1.5.5 2.1-2-1.1-2 1.1.5-2.1-1.7-1.5L11 9l1-2Z"/></svg>`,
 civic:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16"/><path d="m6 9 6-4 6 4"/><path d="M6 11v7M10 11v7M14 11v7M18 11v7"/><path d="M4 20h16"/></svg>`,
 coastGuard:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v10M8.5 7.5 12 4l3.5 3.5"/><path d="M5 14h14l-2 4H7l-2-4Z"/><path d="M3.5 19.5c1 .6 2 .9 3.2.9s2.2-.3 3.2-.9c1 .6 2 .9 3.2.9s2.2-.3 3.2-.9c1 .6 2 .9 3.2.9"/></svg>`,
 hospitalCross:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v16H6z"/><path d="M10 7h4v3h3v4h-3v3h-4v-3H7v-4h3V7Z"/></svg>`,
 localResponse:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M8.5 12h7M12 8.5v7"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2"/></svg>`,
 rescue:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="8.5"/></svg>`,
 hospital:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="1.5"/><path d="M10 8h4v3h3v4h-3v3h-4v-3H7v-4h3V8Z"/></svg>`,
 fire:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c4.2 0 7-3 7-7 0-4.5-3.2-6.3-4.9-9.1-.3 2-1.2 3.4-2.8 4.8C10.6 7.2 9.5 6 8.5 4.8 7.9 8 5 10.4 5 14c0 4 2.8 7 7 7Z"/><path d="M12 17.5c1.4 0 2.5-1.1 2.5-2.5 0-1-.5-1.8-1.2-2.5-.2.9-.6 1.5-1.3 2-.3-.8-.8-1.4-1.3-2.1-.2 1.6-.9 2.4-.9 3.1 0 1.1.9 2 2.2 2Z"/></svg>`,
  lifejacketNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6l2 5-2.2 8H9.2L7 9 9 4Z"/><path d="M9 8h6M10 12h4M10 16h4"/><path d="M8 5 5.5 9.5 8 14M16 5l2.5 4.5L16 14"/></svg>`,
  vesselNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h16l-2 4H6l-2-4Z"/><path d="M8 13V8h8v5M10 8V5h4v3M12 3v2"/><path d="M6 18c1.2.8 2.3 1.2 3.5 1.2S11.8 18.8 13 18c1.2.8 2.3 1.2 3.5 1.2S18.8 18.8 20 18"/></svg>`,
  weatherNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="9" r="3"/><path d="M9 2v2M9 14v2M2 9h2M14 9h2M4 4l1.5 1.5M12.5 12.5 14 14"/><path d="M12 17h6a3 3 0 0 0 0-6 4 4 0 0 0-7.5-1.7A3.5 3.5 0 0 0 9 17h3Z"/></svg>`,
  luggageNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="7" width="14" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M8 11h8M8 15h8M8 20v-3M16 20v-3"/></svg>`,
  crewNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 4.5-2.8 8.2-7 10-4.2-1.8-7-5.5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  sunNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/><path d="M6 19h12"/></svg>`,
  waterNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7c1.5 0 2.2.9 3.8.9S9.3 7 10.8 7s2.2.9 3.8.9S16.8 7 18.3 7 20.5 7.9 22 7.9"/><path d="M3 12c1.5 0 2.2.9 3.8.9s2.5-.9 4-.9 2.2.9 3.8.9 2.2-.9 3.7-.9 2.2.9 3.7.9"/><path d="M3 17c1.5 0 2.2.9 3.8.9s2.5-.9 4-.9 2.2.9 3.8.9 2.2-.9 3.7-.9 2.2.9 3.7.9"/></svg>`,
  bottleNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6v3l1.5 2.5V20a2 2 0 0 1-2 1h-5a2 2 0 0 1-2-1V8.5L9 6V3Z"/><path d="M9 10h6M9 14h6"/></svg>`,
  firstAidNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="6" width="14" height="14" rx="2"/><path d="M9 6V4h6v2M10 11h4v6h-4zM8 13h8"/></svg>`,
  flagNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V4"/><path d="M6 5c4-3 7 3 12 0v9c-5 3-8-3-12 0Z"/><path d="M4 21h5"/></svg>`,
  policeNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 18 6v5c0 4-2.4 7.3-6 8.8-3.6-1.5-6-4.8-6-8.8V6l6-3Z"/><path d="M12 7v5M9.5 10h5"/></svg>`,
  alertNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8 15H4L12 4Z"/><path d="M12 9v5M12 17h.01"/></svg>`,
  anchorNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2"/><path d="M12 7v12M8 11h8M5 14a7 7 0 0 0 14 0M5 19h14"/></svg>`,
  medicalNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="15" rx="2"/><path d="M10 5V3h4v2M10 10h4v4h-4zM8 12h8"/></svg>`,
  fireNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c4.3 0 7-3 7-7 0-4.5-3.1-6.3-5-9.2-.1 2.1-1.1 3.6-2.8 4.9-.7-2-1.8-3.3-3-4.5C7.5 8.5 5 11 5 14c0 4 2.7 7 7 7Z"/><path d="M12 18c1.3 0 2.3-1 2.3-2.3 0-.9-.4-1.6-1.1-2.2-.2.8-.6 1.3-1.1 1.8-.3-.7-.6-1.2-1-1.8-.2 1.4-.7 2-.7 2.6 0 1.1.7 1.9 1.6 1.9Z"/></svg>`,
  aboutApp:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/></svg>`,
  guideNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2V4Z"/><path d="M8 4v14M10 8h5M10 12h5M10 16h3"/></svg>`,
  dataNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"/></svg>`,
  disclaimerNew:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8 15H4L12 4Z"/><path d="M12 9v4M12 16h.01"/></svg>`
};

function setConnection(){
  const existing=document.querySelector(".offline-status");
  if(!existing)return;
  existing.innerHTML=navigator.onLine
    ? `<span class="status-dot"></span><span>ONLINE</span>`
    : `${icons.cloudOff}<span>OFFLINE MODE</span>`;
  existing.classList.toggle("is-offline",!navigator.onLine);
}

function activeNav(route){const key=route==="safety-detail"?"safety":route==="about-detail"?"about":route;navItems.forEach(n=>n.classList.toggle("active",n.dataset.route===key));}
function go(route){currentRoute=route;closeMenu();render();window.scrollTo(0,0);}

function openMenu(){
  if(!sideMenu||!menuOverlay)return;
  sideMenu.classList.add("open");
  sideMenu.setAttribute("aria-hidden","false");
  menuOverlay.hidden=false;
  document.body.classList.add("menu-open");
  requestAnimationFrame(()=>menuOverlay.classList.add("visible"));
}
function closeMenu(){
  if(!sideMenu||!menuOverlay)return;
  sideMenu.classList.remove("open");
  sideMenu.setAttribute("aria-hidden","true");
  menuOverlay.classList.remove("visible");
  document.body.classList.remove("menu-open");
  setTimeout(()=>{menuOverlay.hidden=true;},180);
}

function internalHeader(title,actionClass="internal-shell-spacer",backRoute="home"){
  return `<div class="internal-shell-header"><button class="internal-shell-button" data-back-route="${backRoute}" type="button" aria-label="Back"><svg viewBox="0 0 24 24"><path d="m14.5 5-7 7 7 7"/></svg></button><div class="internal-shell-title">${title}</div>${actionClass==="calendar"?`<button class="internal-shell-button" data-focus-date type="button" aria-label="Choose date">${icons.calendar}</button>`:`<div class="internal-shell-spacer" aria-hidden="true"></div>`}</div>`;
}

function home(){
  appContent.innerHTML=`
  <div class="page home-page">
    <div class="offline-status" aria-live="polite"></div>
    <section class="welcome-card" aria-label="Saferry welcome">
      <div class="welcome-copy"><h2>Hello, Traveler!</h2><p>Plan ahead. Travel safe.<br>Enjoy Bantayan Island!</p></div>
      <svg class="hero-illustration" viewBox="0 0 190 108" role="img" aria-label="Ferry and island illustration"><circle cx="151" cy="25" r="10" fill="#CBE5F6"/><path d="M118 51c13-6 25-6 37 0 8-4 16-5 24-1 6 3 9 7 10 11H108c1-5 4-8 10-10Z" fill="#D8ECF9"/><path d="M86 70c18-9 41-9 59 0 11-5 23-5 33 1 4 2 8 5 10 8H76c2-4 5-7 10-9Z" fill="#C8E5F5"/><path d="M58 78h118" stroke="#AFD5EC" stroke-width="2" stroke-linecap="round"/><path d="M72 62h65l-8 15H78L72 62Z" fill="#0D2D52"/><path d="M88 55h33v7H88z" fill="#0D2D52"/><path d="M96 49h17v6H96z" fill="#0D2D52"/><path d="M104 44h3v5h-3z" fill="#0D2D52"/><path d="M91 68h6v5h-6zM105 68h6v5h-6zM119 68h6v5h-6z" fill="#EAF5FF"/><path d="M54 89c14 0 19 2 30 2 10 0 16-2 25-2 11 0 17 3 26 3 10 0 16-2 28-2 8 0 13 1 18 2" fill="none" stroke="#8CC5E8" stroke-width="2.5" stroke-linecap="round"/><path d="M147 73c4-10 5-18 4-24" fill="none" stroke="#7DBB5C" stroke-width="2" stroke-linecap="round"/><path d="M151 49c-6-3-9-7-11-11M151 51c6-5 10-7 14-7M151 55c-4-4-8-5-12-5M151 54c5-3 9-3 13-2" fill="none" stroke="#7DBB5C" stroke-width="2" stroke-linecap="round"/></svg>
    </section>
    <div class="section-label">MAIN FEATURES</div>
    <section class="feature-grid">
      <button class="feature-card" data-route-to="schedules" type="button"><span class="feature-icon">${icons.ferry}</span><strong>Ferry Schedules</strong><span>Check trip schedules and details.</span></button>
      <button class="feature-card" data-route-to="safety" type="button"><span class="feature-icon">${icons.shield}</span><strong>Safety Tips</strong><span>Practical tips for safe travel.</span></button>
      <button class="feature-card" data-route-to="emergency" type="button"><span class="feature-icon">${icons.phone}</span><strong>Emergency Contacts</strong><span>Quick access to important numbers.</span></button>
      <button class="feature-card" data-route-to="about" type="button"><span class="feature-icon">${icons.info}</span><strong>About &amp; Info</strong><span>Learn more about Saferry.</span></button>
    </section>
  </div>`;
  setConnection();
}

function formatScheduleDate(date){return date.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});}
function inputDateValue(date){const y=date.getFullYear();const m=String(date.getMonth()+1).padStart(2,"0");const d=String(date.getDate()).padStart(2,"0");return `${y}-${m}-${d}`;}
function shiftScheduleDate(days){const next=new Date(scheduleDate);next.setDate(next.getDate()+days);scheduleDate=next;schedulesPage();}

function schedulesPage(){
  const activeSchedule=(scheduleDemo && !Array.isArray(scheduleDemo) ? scheduleDemo[scheduleDirection] : scheduleDemo) || [];
  appContent.innerHTML=`<div class="page internal-page schedule-page">
    ${internalHeader("Ferry Schedules","calendar")}
    <input id="scheduleDatePicker" class="visually-hidden-input" type="date" value="${inputDateValue(scheduleDate)}" aria-label="Choose schedule date">
    <div class="route-switch" aria-label="Ferry route"><button class="${scheduleDirection==="HAGNAYA → STA. FE"?"active":""}" data-direction="HAGNAYA → STA. FE" type="button">HAGNAYA → STA. FE</button><button class="${scheduleDirection==="STA. FE → HAGNAYA"?"active":""}" data-direction="STA. FE → HAGNAYA" type="button">STA. FE → HAGNAYA</button></div>
    <div class="schedule-date-row"><button class="date-nav" data-date-shift="-1" type="button" aria-label="Previous date"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button><div class="schedule-date">${icons.calendar}<span>${formatScheduleDate(scheduleDate)}</span></div><button class="date-nav" data-date-shift="1" type="button" aria-label="Next date"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button></div>
    <div class="demo-strip">${icons.alert}<div><strong>Reference schedule</strong> — primary source: ${scheduleMeta.primarySource||"verified public source"}; last checked ${scheduleMeta.lastChecked||"recently"}. Published times can differ across sources, so confirm the operator's latest sailing before travel.</div></div>
    <div class="schedule-list">${activeSchedule.length?activeSchedule.map(x=>`<div class="schedule-row"><div class="schedule-time">${x.time}</div><div class="schedule-main"><strong>${x.operator || "Super Shuttle Ferry"}</strong><span>${x.type}</span><span>${x.duration}</span></div></div>`).join(""):"<div class=\"schedule-empty\">No schedule entries are available for this date.</div>"}</div>
    <div class="change-note">${icons.info}<div>Schedule may change without prior notice due to weather conditions, sea travel restrictions, or operator updates.</div></div>
  </div>`;
}

function safetyPage(){
  const list=safetyTab==="sea"?safetySea:safetyBeach;
  const safetyIcons=safetyTab==="sea"?[icons.plan,icons.vesselNew,icons.lifejacketNew,icons.capacity,icons.ticket,icons.weatherNew]:[icons.sunNew,icons.lifeguard,icons.buddy,icons.waterNew,icons.noImpairment,icons.emergencyReady];
  appContent.innerHTML=`<div class="page internal-page safety-page">${internalHeader("Safety Tips")}<div class="safety-tabs" role="tablist" aria-label="Safety categories"><button class="${safetyTab==="sea"?"active":""}" data-safety-tab="sea" type="button">SEA TRAVEL</button><button class="${safetyTab==="beach"?"active":""}" data-safety-tab="beach" type="button">BEACH SAFETY</button></div><div class="card safety-list">${list.map((x,i)=>`<button class="safety-item safety-item-button" data-safety-detail="${i}" data-safety-category="${safetyTab}" type="button"><div class="list-icon">${safetyIcons[i]||icons.shield}</div><div class="item-main"><strong>${x[0]}</strong><span>${x[1]}</span></div><div class="safety-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></div></button>`).join("")}</div></div>`;
}

function contactIconFor(name,type){
  const label=String(name||"").toLowerCase();
  if(type==="police" || label.includes("pnp")) return icons.policeNew;
  if(type==="coast" || label.includes("coast guard")) return icons.anchorNew;
  if(type==="hospital" || label.includes("hospital")) return icons.medicalNew;
  if(label.includes("lgu")) return icons.civic;
  if(label.includes("bantayan 911")) return icons.localResponse;
  return icons.rescue;
}

function emergencyPage(){
  appContent.innerHTML=`<div class="page internal-page emergency-page">${internalHeader("Emergency Contacts")}<div class="emergency-alert"><span class="emergency-alert-icon">${icons.alert}</span><div><strong>In case of emergency, call 911 first.</strong><span>Local reference contacts are provided below; reconfirm details before final public deployment.</span></div></div><div class="card emergency-card" aria-label="Emergency contacts">${contacts.map(x=>{const [name,number,type]=Array.isArray(x)?x:[x.name,x.number,x.type];return `<div class="contact-item"><div class="contact-avatar contact-type-${type}">${contactIconFor(name,type)}</div><div class="item-main"><strong>${name}</strong><span>${number}</span></div><a class="contact-action" href="tel:${String(number||"").replace(/\s/g,"")}" aria-label="Call ${name}">${icons.phone}</a></div>`}).join("")}</div></div>`;
}

function aboutPage(){
  const installVisible=document.body.classList.contains("install-available") && !window.matchMedia("(display-mode: standalone)").matches;
  appContent.innerHTML=`<div class="page internal-page about-page">${internalHeader("About & Info")}<section class="about-hero card" aria-label="Saferry application information"><img src="icons/icon-192.png" alt="Saferry app icon" class="about-app-icon"><div class="about-hero-copy"><h2>Saferry</h2><div class="about-version">Version 1.0.0</div><div class="about-badge">Offline-First App</div></div></section><div class="info-list about-info-list"><button class="info-row" type="button" data-info-item="about"><div class="list-icon">${icons.aboutApp}</div><div class="info-copy"><strong>About Saferry</strong><span>Learn more about the app.</span></div><span class="info-chevron" aria-hidden="true">›</span></button><button class="info-row" type="button" data-info-item="how"><div class="list-icon">${icons.guideNew}</div><div class="info-copy"><strong>How to Use</strong><span>Quick guide for using Saferry.</span></div><span class="info-chevron" aria-hidden="true">›</span></button><button class="info-row" type="button" data-info-item="data"><div class="list-icon">${icons.dataNew}</div><div class="info-copy"><strong>Data Information</strong><span>Learn how information is stored offline.</span></div><span class="info-chevron" aria-hidden="true">›</span></button><button class="info-row" type="button" data-info-item="disclaimer"><div class="list-icon">${icons.disclaimerNew}</div><div class="info-copy"><strong>Disclaimer</strong><span>Important notes and disclaimer.</span></div><span class="info-chevron" aria-hidden="true">›</span></button></div><button id="installAppLink" class="install-app-button" type="button" ${installVisible?"":"hidden"}>Install Saferry</button><div class="data-reference-note">Reference data last checked: October 6, 2026. Ferry schedules and emergency contacts can change; verify before critical travel or emergencies.</div><div class="sync-panel"><div class="sync-copy"><strong>Data synchronization</strong><span id="syncStatusText">${syncMeta.message}</span></div><button id="syncDataLink" class="sync-data-button" type="button">${remoteConfig.enabled?"Update Data":"Sync Setup"}</button></div><div class="about-message" id="aboutMessage" hidden aria-live="polite"></div></div>`;
}

const safetyDetailContent={
  sea:[
    {title:"Plan Ahead",icon:icons.plan,summary:"Prepare before you leave for the port.",body:["Check the published ferry schedule before traveling and allow enough time to reach the terminal.","Keep your ticket and passenger information ready before boarding.","For important trips, check the operator and current weather or port advisories again before leaving."]},
    {title:"Use Authorized Vessels",icon:icons.vesselNew,summary:"Choose authorized passenger vessels and follow crew instructions.",body:["Use the ferry service and vessel designated for passenger travel. Do not board an unapproved or overcrowded vessel.","Follow the terminal and crew instructions throughout boarding and sailing.","If a crew member gives a safety instruction, follow it promptly."]},
    {title:"Wear Your Life Jacket",icon:icons.lifejacketNew,summary:"Know where the life jackets are and follow the crew's instructions.",body:["Follow the vessel's instructions on when and how to use a life jacket.","Know where your nearest life-saving equipment is located before the trip begins.","If conditions worsen, follow crew directions immediately rather than waiting for instructions from the app."]},
    {title:"Respect Passenger Capacity",icon:icons.capacity,summary:"Do not board an overcrowded trip.",body:["Passenger vessels have authorized capacity limits intended to support safe operation.","If a vessel appears overcrowded or boarding conditions seem unsafe, wait for official guidance instead of forcing your way aboard.","Let the operator and authorities manage capacity and boarding decisions."]},
    {title:"Check Passenger Details",icon:icons.ticket,summary:"Make sure your ticket and passenger details are correct.",body:["Review the name, route and other passenger information before boarding.","Keep your ticket or booking reference available in case the terminal or crew needs to verify it.","Correct errors with the ticketing or terminal staff before boarding when possible."]},
    {title:"Follow Current Advisories",icon:icons.weatherNew,summary:"Follow the latest operator, port, Coast Guard and weather information.",body:["Ferry schedules are reference information and can change because of operational or weather conditions.","Check official advisories before traveling and follow any cancellation, suspension or safety instruction.","Saferry does not replace real-time instructions from the ferry operator or authorities."]}
  ],
  beach:[
    {title:"Choose a Safe Area",icon:icons.sunNew,summary:"Use designated or monitored swimming areas.",body:["Look for signs, local safety notices and areas that are intended for swimming.","Avoid entering water where warning signs indicate dangerous conditions or restricted activity.","When in doubt, ask local authorities or lifeguards before entering the water."]},
    {title:"Look for Lifeguards",icon:icons.lifeguard,summary:"Prefer areas with lifeguards and available rescue equipment.",body:["Choose a monitored area when one is available.","Take note of where lifeguards and emergency equipment are located before swimming.","Follow lifeguard instructions immediately, especially when conditions change."]},
    {title:"Stay With Others",icon:icons.buddy,summary:"Do not swim alone.",body:["Stay with a companion and keep children and vulnerable swimmers within close reach.","Tell someone where you are going and avoid isolated swimming areas.","If a swimmer is in trouble, call for trained assistance rather than entering a dangerous situation yourself."]},
    {title:"Avoid Hazard Areas",icon:icons.waterNew,summary:"Stay away from marked danger zones and watercraft traffic.",body:["Observe warning flags, ropes, signs and local instructions.","Avoid areas used by anchored or moving boats and other watercraft.","Move to a safer area if waves, currents or weather conditions become difficult."]},
    {title:"Do Not Swim Impaired",icon:icons.noImpairment,summary:"Do not swim when alcohol or other impairment affects your judgment.",body:["Swimming requires attention, balance and the ability to respond quickly to changing conditions.","Do not enter the water if you are drunk or otherwise unable to respond safely.","If someone is impaired, keep them away from the water and help them stay with a responsible companion."]},
    {title:"Keep Emergency Contacts Ready",icon:icons.emergencyReady,summary:"Know who to call before you enter the water.",body:["Keep 911 and relevant local emergency contacts available on the phone.","Tell companions where the nearest help point or rescue service can be reached.","In an emergency, call for trained assistance and follow the instructions of responders."]}
  ]
};

const aboutDetailContent={
  about:{title:"About Saferry",icon:icons.aboutApp,body:["Saferry is an offline-first travel companion designed to help tourists and residents travel more safely to and from Bantayan Island.","The app brings ferry schedule references, practical sea and beach safety reminders, and emergency contacts into one lightweight mobile application.","Its core information can remain available offline, while an internet connection can be used to synchronize updated data from the Saferry remote data repository."]},
  how:{title:"How to Use",icon:icons.guideNew,body:["Use Home or the bottom navigation to open Ferry Schedules, Safety Tips, Emergency Contacts and About & Info.","In Ferry Schedules, switch the route and date to review the current reference schedule.","In Safety Tips, choose Sea Travel or Beach Safety, then tap a tip to read its detailed guidance.","In Emergency Contacts, tap a call button to contact the selected service. Use 911 for immediate emergencies.","When online, use Update Data in About & Info to synchronize the latest available remote data. When offline, Saferry uses the latest saved copy."]},
  data:{title:"Data Information",icon:icons.dataNew,body:["Saferry stores core reference data locally so the main features continue to work without an internet connection.","When online, the app checks the Saferry remote data repository for a newer manifest and validated JSON data.","A successful synchronization is saved locally. If a later refresh fails or there is no internet connection, Saferry continues using the last successful local copy.","Ferry schedules and emergency contact details are reference information and should be reconfirmed when circumstances are critical."]},
  disclaimer:{title:"Disclaimer",icon:icons.disclaimerNew,body:["Saferry provides reference information and safety reminders; it is not a substitute for official instructions, trained responders or emergency services.","Ferry schedules may change because of weather, port conditions, vessel operations or other circumstances.","Emergency contact numbers and local services can change. For an immediate emergency, use the official emergency service available in your area and follow responder instructions.","Always follow current instructions from ferry operators, the Philippine Coast Guard, local authorities, lifeguards and other responsible officials."]}
};

function safetyDetailPage(category,index){
  const entry=(safetyDetailContent[category]||[])[Number(index)];
  const sourceData=category==="sea"?(safetySea[Number(index)]||[]):(safetyBeach[Number(index)]||[]);
  if(!entry){go("safety");return;}
  appContent.innerHTML=`<div class="page internal-page detail-page safety-detail-page">${internalHeader(entry.title,"internal-shell-spacer","safety")}<section class="detail-hero card"><div class="detail-icon">${entry.icon}</div><div><h2>${entry.title}</h2><p>${entry.summary}</p></div></section><section class="card detail-content"><h3>What to do</h3>${entry.body.map(t=>`<p>${t}</p>`).join("")}<div class="detail-reminder"><strong>Saferry reminder</strong><span>${sourceData[1]||"Follow current instructions from the relevant authorities."}</span></div></section></div>`;
}

function aboutDetailPage(key){
  const entry=aboutDetailContent[key];
  if(!entry){go("about");return;}
  appContent.innerHTML=`<div class="page internal-page detail-page about-detail-page">${internalHeader(entry.title,"internal-shell-spacer","about")}<section class="detail-hero card"><div class="detail-icon">${entry.icon}</div><div><h2>${entry.title}</h2><p>${key==="about"?"Learn what Saferry is and why it was built.":key==="how"?"Quick guide to using Saferry.":key==="data"?"How Saferry stores and updates its information.":"Important limitations and safety notes."}</p></div></section><section class="card detail-content"><h3>Information</h3>${entry.body.map(t=>`<p>${t}</p>`).join("")}</section></div>`;
}


function applyDataBundle(bundle,source="local"){
  const {schedules,safety,emergency,manifest}=bundle || {};
  if(schedules && schedules.routes && typeof schedules.routes==="object"){
    scheduleDemo=schedules.routes;
    scheduleMeta={...scheduleMeta,...schedules,source};
  }
  if(safety){
    if(Array.isArray(safety.seaTravel))safetySea=safety.seaTravel;
    if(Array.isArray(safety.beachSafety))safetyBeach=safety.beachSafety;
  }
  if(emergency && Array.isArray(emergency.contacts)){
    contacts=emergency.contacts.map(x=>[x.name,x.number,x.type]);
    contactMeta={...contactMeta,...emergency,source};
  }
  if(source==="remote"){
    syncMeta={status:"synced",lastSync:new Date().toISOString(),version:manifest?.version || null,message:`Online data synchronized${manifest?.version?` • ${manifest.version}`:""}.`};
  }
}

function storeRemoteBundle(bundle){
  try{
    localStorage.setItem("saferry.remote.bundle",JSON.stringify(bundle));
    localStorage.setItem("saferry.remote.syncedAt",new Date().toISOString());
  }catch(error){console.warn("Saferry could not store synchronized data.",error);}
}

function readRemoteBundle(){
  try{
    const raw=localStorage.getItem("saferry.remote.bundle");
    return raw?JSON.parse(raw):null;
  }catch(error){return null;}
}

async function fetchJson(url){
  const response=await fetch(url,{cache:"no-store"});
  if(!response.ok)throw new Error(`HTTP ${response.status} for ${url}`);
  return response.json();
}

function githubRawFileUrl(path){
  const clean=String(path||"").replace(/^\/+/,"");
  const base=`https://raw.githubusercontent.com/${remoteConfig.repository}/${remoteConfig.branch || "main"}/`;
  const url=new URL(clean,base);
  url.searchParams.set("saferry",Date.now().toString());
  return url.href;
}

function githubApiFileUrl(path){
  const base=`https://api.github.com/repos/${remoteConfig.repository}/contents/`;
  const clean=String(path||"").replace(/^\/+/,"");
  const url=new URL(clean,base);
  if(remoteConfig.branch)url.searchParams.set("ref",remoteConfig.branch);
  url.searchParams.set("saferry",Date.now().toString());
  return url.href;
}

function decodeBase64Utf8(value){
  const binary=atob(String(value||"").replace(/\s/g,""));
  const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

async function fetchGithubRawJsonFile(path){
  const response=await fetch(githubRawFileUrl(path),{cache:"no-store"});
  if(!response.ok)throw new Error(`GitHub Raw HTTP ${response.status} for ${path}`);
  return response.json();
}

async function fetchGithubApiJsonFile(path){
  const response=await fetch(githubApiFileUrl(path),{cache:"no-store"});
  if(!response.ok)throw new Error(`GitHub API HTTP ${response.status} for ${path}`);
  const payload=await response.json();
  if(payload && payload.type==="file" && payload.content){
    return JSON.parse(decodeBase64Utf8(payload.content));
  }
  throw new Error(`GitHub API did not return file content for ${path}.`);
}

async function fetchGithubJsonFile(path){
  try{
    return await fetchGithubRawJsonFile(path);
  }catch(rawError){
    try{
      return await fetchGithubApiJsonFile(path);
    }catch(apiError){
      throw new Error(`${path}: Raw GitHub failed (${rawError.message}); GitHub API failed (${apiError.message})`);
    }
  }
}

function validScheduleData(data){return !!(data && data.routes && typeof data.routes==="object");}
function validSafetyData(data){return !!(data && Array.isArray(data.seaTravel) && Array.isArray(data.beachSafety));}
function validEmergencyData(data){return !!(data && Array.isArray(data.contacts));}

async function loadRemoteConfig(){
  try{
    const config=await fetchJson("data/remote-config.json");
    remoteConfig={...remoteConfig,...config};
  }catch(error){
    remoteConfig={...remoteConfig,enabled:false};
    console.info("Saferry remote update configuration is unavailable; local data remains active.");
  }
}

function remoteSyncConfigured(){
  if(!remoteConfig.enabled)return false;
  if(remoteConfig.provider==="github-api")return !!remoteConfig.repository;
  return !!remoteConfig.manifestUrl;
}

function shouldAutoSync(){
  if(!remoteSyncConfigured() || !navigator.onLine)return false;
  const last=localStorage.getItem("saferry.remote.syncedAt");
  if(!last)return true;
  const ageMinutes=(Date.now()-Date.parse(last))/60000;
  return !Number.isFinite(ageMinutes) || ageMinutes>=Number(remoteConfig.refreshIntervalMinutes||60);
}

async function syncRemoteData({manual=false}={}){
  if(!remoteSyncConfigured()){
    syncMeta={status:"not-configured",lastSync:syncMeta.lastSync,version:syncMeta.version,message:"Online updates are not connected. Check data/remote-config.json."};
    if(currentRoute==="about")render();
    if(manual)window.alert("Online updates are not connected. Check data/remote-config.json and make sure the GitHub repository is configured.");
    return false;
  }
  if(!navigator.onLine){
    syncMeta={status:"offline",lastSync:syncMeta.lastSync,version:syncMeta.version,message:"Offline — using the latest available local data."};
    if(currentRoute==="about")render();
    if(manual)window.alert("Saferry is offline. The latest available data is being used.");
    return false;
  }
  const button=document.getElementById("syncDataLink");
  if(button)button.disabled=true;
  try{
    let manifest;
    let fetchRemote;
    if(remoteConfig.provider==="github-api" && remoteConfig.repository){
      const manifestPath=remoteConfig.manifestPath || "data-update-manifest.json";
      fetchRemote=path=>fetchGithubJsonFile(path);
      manifest=await fetchRemote(manifestPath);
    }else{
      manifest=await fetchJson(remoteConfig.manifestUrl);
      const base=new URL(remoteConfig.manifestUrl,window.location.href);
      fetchRemote=path=>fetchJson(new URL(path,base).href);
    }
    if(!manifest || !manifest.files)throw new Error("Remote data manifest is missing file entries.");
    const [schedules,safety,emergency]=await Promise.all([
      fetchRemote(manifest.files.schedules),
      fetchRemote(manifest.files.safety),
      fetchRemote(manifest.files.emergency)
    ]);
    if(!validScheduleData(schedules) || !validSafetyData(safety) || !validEmergencyData(emergency))throw new Error("Remote data failed basic validation.");
    const bundle={manifest,schedules,safety,emergency};
    storeRemoteBundle(bundle);
    applyDataBundle(bundle,"remote");
    if(currentRoute!=="home")render();
    return true;
  }catch(error){
    const detail=String(error?.message || error || "Unknown error");
    syncMeta={status:"error",lastSync:syncMeta.lastSync,version:syncMeta.version,message:"Online refresh failed — using the latest available local data."};
    console.warn("Saferry online data refresh failed.",error);
    if(currentRoute==="about")render();
    if(manual)window.alert(`Saferry could not refresh the online data. The latest available local data remains in use.

${detail}`);
    return false;
  }finally{
    const latestButton=document.getElementById("syncDataLink");
    if(latestButton)latestButton.disabled=false;
  }
}

let detailState={category:"sea",index:0,key:"about"};

function render(){
  activeNav(currentRoute);document.body.classList.toggle("internal-view",currentRoute!=="home");
  if(currentRoute==="schedules")schedulesPage();else if(currentRoute==="safety")safetyPage();else if(currentRoute==="safety-detail")safetyDetailPage(detailState.category,detailState.index);else if(currentRoute==="emergency")emergencyPage();else if(currentRoute==="about")aboutPage();else if(currentRoute==="about-detail")aboutDetailPage(detailState.key);else home();
}

function openDatePicker(){
  const picker=document.getElementById("scheduleDatePicker");
  if(!picker)return;
  if(typeof picker.showPicker==="function") picker.showPicker(); else picker.click();
}

window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();
  deferredInstallPrompt=event;
  document.body.classList.add("install-available");
  const installLink=document.getElementById("installAppLink");
  if(installLink) installLink.hidden=false;
});
window.addEventListener("appinstalled",()=>{
  deferredInstallPrompt=null;
  document.body.classList.remove("install-available");
  const installLink=document.getElementById("installAppLink");
  if(installLink) installLink.hidden=true;
});

menuButton?.addEventListener("click",openMenu);
menuClose?.addEventListener("click",closeMenu);
menuOverlay?.addEventListener("click",closeMenu);
navItems.forEach(n=>n.addEventListener("click",()=>go(n.dataset.route)));

document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu();});
document.addEventListener("click",e=>{
  const route=e.target.closest("[data-route-to]"); if(route) go(route.dataset.routeTo);
  const menuRoute=e.target.closest("[data-menu-route]"); if(menuRoute) go(menuRoute.dataset.menuRoute);
  const back=e.target.closest("[data-back-route]"); if(back){go(back.dataset.backRoute);return;}
  const safetyDetail=e.target.closest("[data-safety-detail]"); if(safetyDetail){detailState={category:safetyDetail.dataset.safetyCategory,index:Number(safetyDetail.dataset.safetyDetail)};currentRoute="safety-detail";closeMenu();render();window.scrollTo(0,0);return;}
  const infoDetail=e.target.closest("[data-info-item]");
  if(infoDetail){detailState={key:infoDetail.dataset.infoItem};currentRoute="about-detail";closeMenu();render();window.scrollTo(0,0);return;}
  const direction=e.target.closest("[data-direction]"); if(direction){scheduleDirection=direction.dataset.direction;schedulesPage();}
  const dateShift=e.target.closest("[data-date-shift]"); if(dateShift) shiftScheduleDate(Number(dateShift.dataset.dateShift));
  const safety=e.target.closest("[data-safety-tab]"); if(safety){safetyTab=safety.dataset.safetyTab;safetyPage();}
  const focusDate=e.target.closest("[data-focus-date]"); if(focusDate) openDatePicker();
  const syncData=e.target.closest("#syncDataLink"); if(syncData){syncRemoteData({manual:true}); return;}
  const installApp=e.target.closest("#installAppLink");
  if(installApp && deferredInstallPrompt){
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.finally(()=>{deferredInstallPrompt=null;installApp.hidden=true;});
    return;
  }

});

document.addEventListener("change",e=>{
  const picker=e.target.closest("#scheduleDatePicker");
  if(picker && picker.value){const [y,m,d]=picker.value.split("-").map(Number);scheduleDate=new Date(y,m-1,d);schedulesPage();}
});

addEventListener("online",()=>{setConnection();if(remoteConfig.enabled)syncRemoteData();});addEventListener("offline",()=>{setConnection();});

async function loadData(){
  try{
    const [safetyRes,scheduleRes,contactRes]=await Promise.all([
      fetch("data/safety-tips.json"),
      fetch("data/schedules.json"),
      fetch("data/emergency-contacts.json")
    ]);
    const safety=await safetyRes.json();
    const schedules=await scheduleRes.json();
    const emergency=await contactRes.json();
    applyDataBundle({schedules,safety,emergency},"local");

    const storedRemote=readRemoteBundle();
    if(storedRemote?.schedules && storedRemote?.safety && storedRemote?.emergency){
      applyDataBundle(storedRemote,"remote");
      const storedAt=localStorage.getItem("saferry.remote.syncedAt");
      syncMeta.lastSync=storedAt || syncMeta.lastSync;
    }

    await loadRemoteConfig();
    if(remoteConfig.enabled && shouldAutoSync()) await syncRemoteData();
    if(!remoteConfig.enabled && syncMeta.status==="local") syncMeta.message="Using verified local reference data.";
    if(currentRoute!=="home")render();
  }catch(error){
    console.warn("Saferry local data files could not be loaded; built-in reference data remains active.",error);
    await loadRemoteConfig();
  }
}

if("serviceWorker" in navigator){addEventListener("load",()=>{navigator.serviceWorker.register("service-worker.js?v=28",{updateViaCache:"none"}).catch(console.error);});}

render();
loadData();
