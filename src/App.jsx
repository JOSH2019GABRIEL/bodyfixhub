// ============================================================
// BODYFIX HUB — Full Application v2.0
// ============================================================
import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";

// DESIGN TOKENS
const T = {
  primary:"#2d6a4f", primaryLight:"#52b788", primaryDark:"#1b4332",
  accent:"#f4a261", accentLight:"#fbc073", accentDark:"#e76f51", teal:"#40916c",
  bg:"#0d1a13", bgCard:"#111f18", bgSurface:"#172619", bgHover:"#1e3323", bgModal:"#0f1d15",
  border:"#1e3323", textPrimary:"#e8f5e9", textSecondary:"#a5c8b2", textMuted:"#4a7c59", textDisabled:"#2a4a35",
  success:"#52b788", error:"#e07070", warning:"#f4a261",
  wa:"#25D366", waDark:"#128C7E",
  fontDisplay:"'DM Serif Display',Georgia,serif", fontBody:"'Plus Jakarta Sans','Helvetica Neue',sans-serif",
  radius:"10px", radiusMd:"16px", radiusLg:"22px", radiusXl:"30px", radiusFull:"9999px",
  shadowGreen:"0 4px 24px rgba(45,106,79,0.25)", shadowLg:"0 12px 48px rgba(0,0,0,0.6)",
  transition:"all 0.2s ease", zModal:1000, zToast:1100, zHeader:100,
};

// CONSTANTS
const MASSAGE_TYPES = [
  {id:"swedish",name:"Swedish",icon:"🌊",desc:"Gentle full-body relaxation using long flowing strokes.",duration:60,base:85,color:"#52b788"},
  {id:"deep_tissue",name:"Deep Tissue",icon:"💪",desc:"Intense pressure for chronic tension in deep muscle layers.",duration:75,base:110,color:"#f4a261"},
  {id:"sports",name:"Sports",icon:"⚡",desc:"Performance, injury prevention & rapid recovery.",duration:60,base:100,color:"#e07070"},
  {id:"hot_stone",name:"Hot Stone",icon:"🪨",desc:"Heated basalt stones melt tension & boost circulation.",duration:90,base:130,color:"#9b8ea0"},
  {id:"prenatal",name:"Prenatal",icon:"🌸",desc:"Gentle, safe techniques for pregnancy discomforts.",duration:60,base:95,color:"#e8a4c4"},
  {id:"reflexology",name:"Reflexology",icon:"🦶",desc:"Pressure points on feet & hands for whole-body wellness.",duration:45,base:70,color:"#7bbbd4"},
  {id:"aromatherapy",name:"Aromatherapy",icon:"🌿",desc:"Therapeutic massage with curated essential oils.",duration:60,base:90,color:"#6ec09e"},
  {id:"shiatsu",name:"Shiatsu",icon:"✋",desc:"Japanese finger-pressure to restore energy balance.",duration:60,base:95,color:"#c8a97e"},
];
const SPECIALTIES=["Swedish","Deep Tissue","Sports","Hot Stone","Prenatal","Reflexology","Aromatherapy","Shiatsu","Trigger Point","Lymphatic Drainage","Myofascial Release","Cupping Therapy"];
const TIME_SLOTS=["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"];
const LOCATIONS=[{id:"home",label:"Home",icon:"🏠",hint:"Your residential address"},{id:"office",label:"Office",icon:"🏢",hint:"Workplace address"},{id:"hotel",label:"Hotel",icon:"🏨",hint:"Hotel + room number"}];
const PAIN_AREAS=["Neck","Shoulders","Upper Back","Lower Back","Hips","Legs","Feet","Arms","Head","Chest"];
const PRESSURES=[{id:"light",label:"Light",note:"Feather-soft"},{id:"medium",label:"Medium",note:"Balanced"},{id:"firm",label:"Firm",note:"Therapeutic"},{id:"deep",label:"Deep",note:"Intense"}];
const CONDITIONS=["No injuries","Recent surgery","Chronic pain","Fibromyalgia","Arthritis","Herniated disc","Pregnancy","Osteoporosis","High blood pressure","Skin conditions","Cancer (inform therapist)","Diabetes"];
const NGN=1650;
const ADMIN_WA="2348012345678";
const BRAND="BodyFix Hub";

const PLANS=[
  {id:"weekly",name:"Weekly Flow",freq:"week",sessions:1,discount:15,color:"#52b788",gradient:"linear-gradient(135deg,#52b788,#2d6a4f)",perks:["15% off every session","Priority booking","Flexible rescheduling","Wellness check-ins"],badge:"Popular"},
  {id:"monthly",name:"Monthly Reset",freq:"month",sessions:4,discount:25,color:"#f4a261",gradient:"linear-gradient(135deg,#f4a261,#e76f51)",perks:["25% off every session","Guaranteed priority slots","Free schedule changes","Monthly body assessment","VIP therapist access","Birthday session gift"],badge:"Best Value"},
];

const SEED_THERAPISTS=[
  {id:"t001",name:"Amara Nwosu",email:"amara@bodyfix.ng",phone:"2348011111111",avatar:"https://i.pravatar.cc/300?img=47",bio:"9-year holistic wellness expert blending Swedish and deep tissue for transformative healing.",specialties:["Swedish","Deep Tissue","Aromatherapy"],rating:4.9,reviewCount:214,experience:9,certified:true,available:true,bookedSlots:{},reviewList:[{author:"Chidi O.",rating:5,text:"Back pain completely gone after one session!",date:"Mar 12, 2025"}],photoRevealed:false},
  {id:"t002",name:"Emeka Eze",email:"emeka@bodyfix.ng",phone:"2348022222222",avatar:"https://i.pravatar.cc/300?img=52",bio:"Former sports physiotherapist. Performance recovery specialist.",specialties:["Sports","Deep Tissue","Trigger Point"],rating:4.8,reviewCount:178,experience:7,certified:true,available:true,bookedSlots:{},reviewList:[{author:"Segun B.",rating:5,text:"Best sports massage in Lagos!",date:"Mar 5, 2025"}],photoRevealed:false},
  {id:"t003",name:"Chioma Okafor",email:"chioma@bodyfix.ng",phone:"2348033333333",avatar:"https://i.pravatar.cc/300?img=44",bio:"Prenatal & aromatherapy certified, creating calming sanctuary experiences.",specialties:["Prenatal","Aromatherapy","Swedish"],rating:4.9,reviewCount:192,experience:6,certified:true,available:true,bookedSlots:{},reviewList:[],photoRevealed:false},
  {id:"t004",name:"Adaeze Obi",email:"adaeze@bodyfix.ng",phone:"2348044444444",avatar:"https://i.pravatar.cc/300?img=41",bio:"Rooted in African healing traditions, specialising in reflexology and shiatsu.",specialties:["Reflexology","Shiatsu","Hot Stone"],rating:4.7,reviewCount:143,experience:5,certified:true,available:true,bookedSlots:{},reviewList:[],photoRevealed:false},
  {id:"t005",name:"Tunde Bakare",email:"tunde@bodyfix.ng",phone:"2348055555555",avatar:"https://i.pravatar.cc/300?img=56",bio:"11-year veteran. Powerful deep tissue sessions legendary among professionals.",specialties:["Deep Tissue","Sports","Myofascial Release"],rating:4.8,reviewCount:267,experience:11,certified:true,available:true,bookedSlots:{},reviewList:[],photoRevealed:false},
  {id:"t006",name:"Ngozi Chukwu",email:"ngozi@bodyfix.ng",phone:"2348066666666",avatar:"https://i.pravatar.cc/300?img=43",bio:"Mindfulness-led hot stone and lymphatic drainage specialist.",specialties:["Hot Stone","Lymphatic Drainage","Swedish"],rating:4.6,reviewCount:98,experience:4,certified:true,available:true,bookedSlots:{},reviewList:[],photoRevealed:false},
  {id:"t007",name:"Seun Adeleke",email:"seun@bodyfix.ng",phone:"2348077777777",avatar:"https://i.pravatar.cc/300?img=55",bio:"Cupping & trigger point expert achieving remarkable results for chronic conditions.",specialties:["Trigger Point","Cupping Therapy","Deep Tissue"],rating:4.9,reviewCount:155,experience:8,certified:true,available:true,bookedSlots:{},reviewList:[],photoRevealed:false},
  {id:"t008",name:"Kemi Lawal",email:"kemi@bodyfix.ng",phone:"2348088888888",avatar:"https://i.pravatar.cc/300?img=40",bio:"Intuitive healer bridging emotional and physical relief through gentle touch.",specialties:["Swedish","Aromatherapy","Prenatal"],rating:4.7,reviewCount:121,experience:5,certified:true,available:true,bookedSlots:{},reviewList:[],photoRevealed:false},
  {id:"t009",name:"Ife Adesanya",email:"ife@bodyfix.ng",phone:"2348099999999",avatar:"https://i.pravatar.cc/300?img=53",bio:"Science-backed approach integrating anatomy for precisely targeted relief.",specialties:["Sports","Myofascial Release","Reflexology"],rating:4.8,reviewCount:189,experience:7,certified:true,available:true,bookedSlots:{},reviewList:[],photoRevealed:false},
  {id:"t010",name:"Zara Musa",email:"zara@bodyfix.ng",phone:"2348010101010",avatar:"https://i.pravatar.cc/300?img=45",bio:"East African & Japanese traditions fused into transformative shiatsu sessions.",specialties:["Shiatsu","Lymphatic Drainage","Hot Stone"],rating:4.9,reviewCount:203,experience:10,certified:true,available:true,bookedSlots:{},reviewList:[],photoRevealed:false},
];
// LOCAL STORAGE
const LS={get:(k,d=null)=>{try{const v=localStorage.getItem("bfh_"+k);return v!==null?JSON.parse(v):d;}catch{return d;}},set:(k,v)=>{try{localStorage.setItem("bfh_"+k,JSON.stringify(v));}catch{}}};

// WHATSAPP SERVICE
const fmtN=(u)=>`₦${(u*NGN).toLocaleString("en-NG")}`;
const fmtD=(s)=>{try{const d=new Date(s+"T12:00:00");return d.toLocaleDateString("en-NG",{weekday:"long",month:"long",day:"numeric",year:"numeric"});}catch{return s;}};
const shortD=(s)=>{try{const d=new Date(s+"T12:00:00");return d.toLocaleDateString("en-NG",{weekday:"short",month:"short",day:"numeric"});}catch{return s;}};
const longD=(s)=>{try{const d=new Date(s+"T12:00:00");return d.toLocaleDateString("en-NG",{weekday:"long",year:"numeric",month:"long",day:"numeric"});}catch{return s;}};

function buildAdminMsg(b){
return`🏥 *${BRAND} — New Booking*
━━━━━━━━━━━━━━━━━━
📋 *Booking ID:* ${b.id}
🕐 *Placed:* ${new Date(b.createdAt).toLocaleString("en-NG")}

👤 *CLIENT*
Name: ${b.clientName}
Phone: ${b.clientPhone||"Not provided"}
Email: ${b.clientEmail||"Not provided"}
WhatsApp: ${b.clientWhatsapp||"Not provided"}

💆 *SESSION*
Type: ${b.massageTypeName} ${b.icon}
Duration: ${b.duration} minutes
Date: ${fmtD(b.date)}
Time: ${b.time}

📍 *LOCATION*
Type: ${b.locationType}
Address: ${b.address}

🧑‍⚕️ *THERAPIST ASSIGNED*
Name: ${b.therapistName}
Phone: +${b.therapistPhone}
Email: ${b.therapistEmail}

🌿 *WELLNESS NOTES*
Pain Areas: ${b.wellness?.painAreas?.join(", ")||"None"}
Pressure: ${b.wellness?.pressure||"Medium"}
Conditions: ${b.wellness?.conditions?.join(", ")||"None"}
Notes: ${b.wellness?.notes||"—"}

💰 *PAYMENT*
Base: ${fmtN(b.basePrice)}
Discount: ${b.discountPercent>0?`${b.discountPercent}% Subscription`:"None"}
*Total: ${fmtN(b.finalPrice)}*
━━━━━━━━━━━━━━━━━━
✅ Confirm in your dashboard.
${BRAND} Admin`;
}

function buildTherapistMsg(b){
return`🌿 *${BRAND} — New Assignment*
━━━━━━━━━━━━━━━━━━
Hello *${b.therapistName}*! You have a new session.

📅 *DATE & TIME*
Date: *${fmtD(b.date)}*
Time: *${b.time}*
Duration: ${b.duration} minutes

📍 *WHERE TO GO*
Type: *${b.locationType}*
Address: *${b.address}*

👤 *CLIENT*
Name: ${b.clientName}
Phone: ${b.clientPhone||"Not shared"}

💆 *SESSION DETAILS*
Massage: ${b.massageTypeName}
Pressure: ${b.wellness?.pressure||"Medium"}
Focus: ${b.wellness?.painAreas?.join(", ")||"Full body"}
Conditions: ${b.wellness?.conditions?.join(", ")||"None"}
${b.wellness?.notes?`Notes: ${b.wellness.notes}`:""}

━━━━━━━━━━━━━━━━━━
⚠️ Arrive *10 min early* with all equipment.
Issues? Contact admin: wa.me/${ADMIN_WA}
${BRAND} Team 🏥`;
}

const sendAdminWA=(b)=>window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(buildAdminMsg(b))}`,"_blank");
const sendTherapistWA=(b)=>window.open(`https://wa.me/${b.therapistPhone}?text=${encodeURIComponent(buildTherapistMsg(b))}`,"_blank");

// UTILITIES
const stars=(r)=>"★".repeat(Math.floor(r))+(r%1>=0.5?"½":"")+"☆".repeat(5-Math.ceil(r));
const discP=(base,pct)=>Math.round(base*(1-pct/100));
const genId=()=>"BFH-"+Date.now().toString(36).toUpperCase();
const genDays=(n=14)=>{const a=[];const now=new Date();for(let i=0;i<n;i++){const d=new Date(now);d.setDate(now.getDate()+i);a.push(d.toISOString().split("T")[0]);}return a;};

// APP CONTEXT
const Ctx=createContext(null);
function AppProvider({children}){
  const[therapists,setTR]=useState(()=>LS.get("therapists",SEED_THERAPISTS));
  const[bookings,setBR]=useState(()=>LS.get("bookings",[]));
  const[favorites,setFR]=useState(()=>LS.get("favorites",[]));
  const[subscriptions,setSR]=useState(()=>LS.get("subscriptions",[]));
  const[currentUser,setCR]=useState(()=>LS.get("currentUser",{name:"Guest",email:"",phone:"",avatar:"",whatsapp:""}));
  const[notifications,setNots]=useState([]);

  const setTherapists=useCallback((v)=>{setTR(p=>{const n=typeof v==="function"?v(p):v;LS.set("therapists",n);return n;});},[]);
  const setBookings=useCallback((v)=>{setBR(p=>{const n=typeof v==="function"?v(p):v;LS.set("bookings",n);return n;});},[]);
  const setFavorites=useCallback((v)=>{setFR(p=>{const n=typeof v==="function"?v(p):v;LS.set("favorites",n);return n;});},[]);
  const setSubscriptions=useCallback((v)=>{setSR(p=>{const n=typeof v==="function"?v(p):v;LS.set("subscriptions",n);return n;});},[]);
  const setCurrentUser=useCallback((v)=>{setCR(p=>{const n=typeof v==="function"?v(p):v;LS.set("currentUser",n);return n;});},[]);

  const addNotification=useCallback((message,type="success")=>{
    const id=Date.now();
    setNots(p=>[...p,{id,message,type}]);
    setTimeout(()=>setNots(p=>p.filter(n=>n.id!==id)),5000);
  },[]);
  const toggleFavorite=useCallback((id)=>{setFavorites(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);},[setFavorites]);
  const revealTherapistPhoto=useCallback((tid)=>{setTherapists(p=>p.map(t=>t.id===tid?{...t,photoRevealed:true}:t));},[setTherapists]);
  const activeSub=subscriptions.find(s=>s.active)||null;
  const discountPct=activeSub?(activeSub.plan==="monthly"?25:15):0;

  return(
    <Ctx.Provider value={{therapists,setTherapists,bookings,setBookings,favorites,setFavorites,subscriptions,setSubscriptions,currentUser,setCurrentUser,activeSub,discountPct,notifications,addNotification,toggleFavorite,revealTherapistPhoto}}>
      {children}
    </Ctx.Provider>
  );
}
const useApp=()=>{const c=useContext(Ctx);if(!c)throw new Error("outside provider");return c;};
// GLOBAL CSS
const CSS=`
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0d1a13;color:#e8f5e9;-webkit-font-smoothing:antialiased;}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:#111f18;}
  ::-webkit-scrollbar-thumb{background:#2d6a4f55;border-radius:4px;}
  ::-webkit-scrollbar-thumb:hover{background:#52b788;}
  input::placeholder,textarea::placeholder{color:#2a4a35;}
  input:focus,textarea:focus{outline:none!important;border-color:#2d6a4f!important;box-shadow:0 0 0 3px rgba(45,106,79,0.18)!important;}
  textarea{resize:vertical;min-height:80px;}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes waBounce{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
`;

// UI PRIMITIVES
function Btn({children,onClick,variant="primary",size="md",disabled=false,fullWidth,icon,style={},title}){
  const base={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,border:"none",borderRadius:T.radiusFull,cursor:disabled?"not-allowed":"pointer",fontFamily:T.fontBody,fontWeight:700,letterSpacing:"0.02em",transition:T.transition,opacity:disabled?0.45:1,whiteSpace:"nowrap",outline:"none",width:fullWidth?"100%":undefined};
  const sz={sm:{padding:"7px 16px",fontSize:12},md:{padding:"10px 22px",fontSize:13},lg:{padding:"14px 30px",fontSize:15}};
  const vr={
    primary:{background:`linear-gradient(135deg,${T.primary},${T.primaryDark})`,color:"#e8f5e9",boxShadow:T.shadowGreen},
    accent:{background:`linear-gradient(135deg,${T.accent},${T.accentDark})`,color:"#1a0e06"},
    outline:{background:"transparent",color:T.primaryLight,border:`1.5px solid ${T.primaryLight}`},
    ghost:{background:`rgba(82,183,136,0.08)`,color:T.textSecondary},
    danger:{background:`rgba(224,112,112,0.12)`,color:T.error,border:`1px solid rgba(224,112,112,0.3)`},
    wa:{background:`linear-gradient(135deg,${T.wa},${T.waDark})`,color:"#fff",boxShadow:`0 4px 18px rgba(37,211,102,0.3)`,animation:"waBounce 2.5s infinite"},
    secondary:{background:T.bgSurface,color:T.textPrimary,border:`1.5px solid ${T.border}`},
  };
  return <button onClick={onClick} disabled={disabled} title={title} style={{...base,...sz[size],...vr[variant],...style}}>{icon&&<span style={{fontSize:"1.1em"}}>{icon}</span>}{children}</button>;
}

function Badge({children,color=T.primary,style={}}){
  return <span style={{background:color+"1a",color,border:`1px solid ${color}40`,borderRadius:T.radiusFull,padding:"3px 10px",fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:T.fontBody,display:"inline-block",...style}}>{children}</span>;
}

function Tag({children,active,onClick,color=T.primary,style={}}){
  return <span onClick={onClick} style={{display:"inline-block",padding:"5px 12px",borderRadius:T.radiusFull,fontSize:12,fontWeight:600,cursor:onClick?"pointer":"default",transition:T.transition,border:`1px solid ${active?color:T.border}`,background:active?color+"1e":"transparent",color:active?color:T.textMuted,fontFamily:T.fontBody,...style}}>{children}</span>;
}

function Inp({label,value,onChange,placeholder,type="text",required,error,style={},rows}){
  const s={width:"100%",padding:"10px 13px",background:T.bgCard,border:`1.5px solid ${error?T.error:T.border}`,borderRadius:T.radius,color:T.textPrimary,fontSize:14,fontFamily:T.fontBody,...style};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label&&<label style={{fontSize:11,fontWeight:700,color:T.textMuted,letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}{required&&<span style={{color:T.accent}}> *</span>}</label>}
      {rows?<textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={s}/>:<input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} style={s}/>}
      {error&&<span style={{fontSize:12,color:T.error}}>{error}</span>}
    </div>
  );
}

function AvatarDisplay({src,name,size=44,onClick,style={}}){
  const initials=(name||"G").split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
  const base={width:size,height:size,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:onClick?"pointer":"default",transition:T.transition,...style};
  return src?<img src={src} alt={name||"User"} onClick={onClick} style={{...base,objectFit:"cover",border:`2px solid ${T.primary}60`}} onError={e=>{e.target.style.display="none";}}/>
    :<div onClick={onClick} style={{...base,background:`linear-gradient(135deg,${T.primary},${T.primaryDark})`,color:"#e8f5e9",fontWeight:700,fontSize:size*0.35,fontFamily:T.fontDisplay}}>{initials}</div>;
}

function StarRating({value,max=5,onChange,size=22}){
  return <div style={{display:"flex",gap:3}}>{Array.from({length:max},(_,i)=>i+1).map(n=><span key={n} onClick={()=>onChange?.(n)} style={{fontSize:size,color:n<=value?T.accent:T.border,cursor:onChange?"pointer":"default",lineHeight:1}}>★</span>)}</div>;
}

function SecHead({title,subtitle,action}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28,flexWrap:"wrap",gap:12}}>
      <div>
        <h2 style={{fontFamily:T.fontDisplay,fontSize:26,color:T.textPrimary,margin:"0 0 4px",fontWeight:400,letterSpacing:"-0.02em"}}>{title}</h2>
        {subtitle&&<p style={{color:T.textMuted,fontSize:14,margin:0,fontFamily:T.fontBody}}>{subtitle}</p>}
      </div>
      {action&&<div>{action}</div>}
    </div>
  );
}

function Empty({icon,title,desc,action}){
  return(
    <div style={{textAlign:"center",padding:"64px 24px",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
      <div style={{fontSize:52,opacity:0.35}}>{icon}</div>
      <h3 style={{fontFamily:T.fontDisplay,color:T.textSecondary,fontSize:20,margin:0,fontWeight:400}}>{title}</h3>
      {desc&&<p style={{color:T.textMuted,fontSize:14,margin:0,maxWidth:320,lineHeight:1.7}}>{desc}</p>}
      {action&&<div style={{marginTop:8}}>{action}</div>}
    </div>
  );
}

function Modal({open,onClose,title,subtitle,children,maxWidth=560}){
  useEffect(()=>{document.body.style.overflow=open?"hidden":"";return()=>{document.body.style.overflow="";};},[open]);
  if(!open)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",backdropFilter:"blur(8px)",zIndex:T.zModal,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.bgModal,border:`1px solid ${T.border}`,borderRadius:T.radiusXl,padding:28,width:"100%",maxWidth,maxHeight:"90vh",overflowY:"auto",boxShadow:T.shadowLg,animation:"slideUp 0.25s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
          <div>
            <h2 style={{fontFamily:T.fontDisplay,fontSize:21,color:T.textPrimary,margin:0,fontWeight:400}}>{title}</h2>
            {subtitle&&<p style={{color:T.textMuted,fontSize:13,margin:"4px 0 0"}}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{background:T.bgSurface,border:`1px solid ${T.border}`,borderRadius:"50%",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.textMuted,fontSize:14,flexShrink:0,marginLeft:12}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Toasts({notifications}){
  const cfg={success:{border:T.success+"60",icon:"✓",color:T.success},error:{border:T.error+"60",icon:"✕",color:T.error},info:{border:T.accent+"60",icon:"ℹ",color:T.accent},wa:{border:T.wa+"60",icon:"📱",color:T.wa}};
  if(!notifications.length)return null;
  return(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:T.zToast,display:"flex",flexDirection:"column",gap:10,maxWidth:380}}>
      {notifications.map(n=>{const s=cfg[n.type]||cfg.info;return(
        <div key={n.id} style={{background:T.bgSurface,border:`1px solid ${s.border}`,borderRadius:T.radiusMd,padding:"13px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:T.shadowLg,animation:"slideUp 0.2s ease"}}>
          <div style={{width:26,height:26,borderRadius:"50%",background:s.color+"1a",border:`1px solid ${s.color}40`,display:"flex",alignItems:"center",justifyContent:"center",color:s.color,fontWeight:700,fontSize:12,flexShrink:0}}>{s.icon}</div>
          <p style={{color:T.textPrimary,fontSize:13,margin:0,lineHeight:1.4,fontFamily:T.fontBody}}>{n.message}</p>
        </div>
      );})}
    </div>
  );
}
// USER PROFILE MODAL
function UserProfileModal({open,onClose}){
  const{currentUser,setCurrentUser,addNotification}=useApp();
  const[form,setForm]=useState({...currentUser});
  const fileRef=useRef();
  useEffect(()=>{if(open)setForm({...currentUser});},[open,currentUser]);
  const handleFile=(e)=>{
    const file=e.target.files?.[0];if(!file)return;
    if(!file.type.startsWith("image/")){addNotification("Please select an image file.","error");return;}
    if(file.size>5*1024*1024){addNotification("Image must be under 5MB.","error");return;}
    const r=new FileReader();r.onload=(ev)=>setForm(f=>({...f,avatar:ev.target.result}));r.readAsDataURL(file);
  };
  const save=()=>{
    if(!form.name?.trim()){addNotification("Name is required.","error");return;}
    setCurrentUser(form);addNotification("Profile updated!","success");onClose();
  };
  return(
    <Modal open={open} onClose={onClose} title="My Profile" subtitle="Manage your account details">
      <div style={{display:"flex",flexDirection:"column",gap:18}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <div style={{position:"relative"}}>
            <AvatarDisplay src={form.avatar} name={form.name} size={90}/>
            <button onClick={()=>fileRef.current?.click()} style={{position:"absolute",bottom:0,right:0,width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent},${T.accentDark})`,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}} title="Upload photo">📷</button>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <input value={form.avatar||""} onChange={e=>setForm(f=>({...f,avatar:e.target.value}))} placeholder="Or paste image URL…" style={{fontSize:12,padding:"7px 12px",background:T.bgCard,border:`1.5px solid ${T.border}`,borderRadius:T.radius,color:T.textPrimary,width:220,fontFamily:T.fontBody}}/>
            {form.avatar&&<Btn variant="danger" size="sm" onClick={()=>setForm(f=>({...f,avatar:""}))}>✕</Btn>}
          </div>
        </div>
        <div style={{height:1,background:T.border}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Inp label="Full Name" required value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your full name"/>
          <Inp label="Email" type="email" value={form.email||""} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com"/>
          <Inp label="Phone" type="tel" value={form.phone||""} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+234 800 000 0000"/>
          <Inp label="WhatsApp" type="tel" value={form.whatsapp||""} onChange={e=>setForm(f=>({...f,whatsapp:e.target.value}))} placeholder="+234 800 000 0000"/>
        </div>
        <div style={{display:"flex",gap:10,paddingTop:4}}>
          <Btn fullWidth onClick={save}>Save Profile</Btn>
          <Btn variant="secondary" fullWidth onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </Modal>
  );
}

// PHOTO REQUEST MODAL (Privacy System)
function PhotoRequestModal({therapist,open,onClose}){
  const{revealTherapistPhoto,addNotification}=useApp();
  const[agreed,setAgreed]=useState(false);
  const submit=()=>{
    if(!agreed){addNotification("Please agree to privacy terms.","error");return;}
    revealTherapistPhoto(therapist.id);
    addNotification(`${therapist.name}'s photo revealed. Please treat this information with respect.`,"info");
    setAgreed(false);onClose();
  };
  if(!therapist)return null;
  return(
    <Modal open={open} onClose={onClose} title="Request Therapist Photo" subtitle="Privacy-protected access" maxWidth={460}>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:`${T.accent}10`,border:`1px solid ${T.accent}28`,borderRadius:T.radiusMd,padding:14}}>
          <p style={{color:T.textSecondary,fontSize:13,lineHeight:1.65,margin:0}}>To protect the privacy and safety of our therapists, profile photos are hidden by default. You may request to view <strong style={{color:T.textPrimary}}>{therapist.name}</strong>'s photo for session verification only.</p>
        </div>
        <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 14px",background:T.bgSurface,borderRadius:T.radius,cursor:"pointer"}} onClick={()=>setAgreed(v=>!v)}>
          <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${agreed?T.primaryLight:T.border}`,background:agreed?T.primaryLight:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:T.transition}}>
            {agreed&&<span style={{color:"#0d1a13",fontSize:11,fontWeight:900}}>✓</span>}
          </div>
          <p style={{color:T.textSecondary,fontSize:12,lineHeight:1.6,margin:0}}>I agree to use this photo only for session verification and will not share, screenshot, or misuse the therapist's image in any way.</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn fullWidth onClick={submit} disabled={!agreed}>Reveal Photo</Btn>
          <Btn variant="secondary" fullWidth onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </Modal>
  );
}

// WHATSAPP CONFIRMATION MODAL
function WAModal({booking,open,onClose,onDone}){
  const[adminSent,setAS]=useState(false);
  const[therapistSent,setTS]=useState(false);
  if(!booking)return null;
  return(
    <Modal open={open} onClose={onClose} title="Send WhatsApp Notifications" subtitle="Notify admin and therapist instantly" maxWidth={480}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{background:`${T.wa}08`,border:`1px solid ${T.wa}20`,borderRadius:T.radiusMd,padding:"10px 14px"}}>
          <p style={{color:T.textSecondary,fontSize:13,margin:0,lineHeight:1.6}}>Booking <strong style={{color:T.textPrimary}}>{booking.id}</strong> is confirmed. Click below to open WhatsApp with pre-filled messages for admin and your therapist.</p>
        </div>

        <div style={{background:T.bgCard,border:`1px solid ${adminSent?T.wa+"50":T.border}`,borderRadius:T.radiusMd,padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div>
              <div style={{fontWeight:700,color:T.textPrimary,fontSize:14}}>📋 Admin — Full Order Details</div>
              <div style={{color:T.textMuted,fontSize:12}}>Booking info → Super Admin ({ADMIN_WA})</div>
            </div>
            {adminSent&&<Badge color={T.wa}>Sent ✓</Badge>}
          </div>
          <Btn variant="wa" fullWidth onClick={()=>{sendAdminWA(booking);setAS(true);}} disabled={adminSent} icon="💬">
            {adminSent?"Sent to Admin!":"Send to Admin via WhatsApp"}
          </Btn>
        </div>

        <div style={{background:T.bgCard,border:`1px solid ${therapistSent?T.wa+"50":T.border}`,borderRadius:T.radiusMd,padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div>
              <div style={{fontWeight:700,color:T.textPrimary,fontSize:14}}>🧑‍⚕️ Therapist — Location & Time</div>
              <div style={{color:T.textMuted,fontSize:12}}>Address + schedule → {booking.therapistName}</div>
            </div>
            {therapistSent&&<Badge color={T.wa}>Sent ✓</Badge>}
          </div>
          <Btn variant="wa" fullWidth onClick={()=>{sendTherapistWA(booking);setTS(true);}} disabled={therapistSent} icon="💬">
            {therapistSent?"Sent to Therapist!":"Send to Therapist via WhatsApp"}
          </Btn>
        </div>

        <Btn variant="primary" fullWidth onClick={onDone}>{adminSent&&therapistSent?"All Done ✓":"Skip & Close"}</Btn>
        <p style={{color:T.textMuted,fontSize:11,textAlign:"center",lineHeight:1.5}}>WhatsApp opens in a new tab with a pre-filled message. Simply press Send.</p>
      </div>
    </Modal>
  );
}
// HEADER
const NAV=[{id:"book",label:"Book Now",icon:"✦"},{id:"therapists",label:"Therapists",icon:"👤"},{id:"bookings",label:"My Bookings",icon:"📋"},{id:"favorites",label:"Favourites",icon:"♥"},{id:"plans",label:"Wellness Plans",icon:"💎"}];

function Header({tab,setTab}){
  const{activeSub,currentUser}=useApp();
  const[showProfile,setShowProfile]=useState(false);
  return(
    <>
      <header style={{position:"sticky",top:0,zIndex:T.zHeader,background:"rgba(13,26,19,0.96)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.border}`}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px",height:62,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:11,cursor:"pointer"}} onClick={()=>setTab("book")}>
            <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${T.primary},${T.primaryDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:T.shadowGreen,flexShrink:0}}>🏥</div>
            <div>
              <div style={{fontFamily:T.fontDisplay,fontSize:18,color:T.primaryLight,lineHeight:1,letterSpacing:"-0.01em"}}>BodyFix Hub</div>
              <div style={{fontSize:9,color:T.textMuted,letterSpacing:"0.18em",textTransform:"uppercase",fontFamily:T.fontBody}}>Your Wellness. Your Doorstep.</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {activeSub&&<Badge color={T.accent}>⭐ {activeSub.plan==="monthly"?"Monthly":"Weekly"} Plan</Badge>}
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"5px 12px 5px 6px",background:T.bgSurface,border:`1px solid ${T.border}`,borderRadius:T.radiusFull,cursor:"pointer",transition:T.transition}} onClick={()=>setShowProfile(true)} title="Edit profile">
              <AvatarDisplay src={currentUser.avatar} name={currentUser.name} size={28}/>
              <span style={{fontSize:13,color:T.textSecondary,fontFamily:T.fontBody}}>{currentUser.name||"Guest"}</span>
              <span style={{color:T.textMuted,fontSize:11}}>✎</span>
            </div>
          </div>
        </div>
        <nav style={{maxWidth:1200,margin:"0 auto",padding:"0 16px",display:"flex",overflowX:"auto"}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{background:"none",border:"none",borderBottom:`2px solid ${tab===n.id?T.primaryLight:"transparent"}`,color:tab===n.id?T.primaryLight:T.textMuted,padding:"10px 16px",fontSize:13,fontWeight:tab===n.id?700:500,cursor:"pointer",whiteSpace:"nowrap",transition:T.transition,display:"flex",alignItems:"center",gap:6,fontFamily:T.fontBody}}>
              <span style={{fontSize:13}}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
      </header>
      <UserProfileModal open={showProfile} onClose={()=>setShowProfile(false)}/>
    </>
  );
}

// HERO
function Hero({onBook}){
  const stats=[{v:"500+",l:"Sessions"},{v:"4.9★",l:"Rating"},{v:"10",l:"Therapists"},{v:"3 Cities",l:"Coverage"}];
  return(
    <section style={{position:"relative",overflow:"hidden",background:`radial-gradient(ellipse 80% 50% at 50% -10%,${T.primary}22,transparent 70%),${T.bg}`,borderBottom:`1px solid ${T.border}`,padding:"52px 24px 44px"}}>
      <div style={{position:"absolute",top:-60,right:-60,width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${T.primary}10,transparent)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-80,left:-40,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${T.accent}08,transparent)`,pointerEvents:"none"}}/>
      <div style={{maxWidth:1200,margin:"0 auto",position:"relative"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:`${T.primary}1a`,border:`1px solid ${T.primary}40`,borderRadius:T.radiusFull,padding:"5px 14px",marginBottom:18}}>
          <span style={{color:T.primaryLight,fontSize:10}}>●</span>
          <span style={{color:T.primaryLight,fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:T.fontBody}}>Lagos · Abuja · Port Harcourt</span>
        </div>
        <h1 style={{fontFamily:T.fontDisplay,fontSize:"clamp(30px,5vw,52px)",fontWeight:400,color:T.textPrimary,lineHeight:1.1,margin:"0 0 16px",letterSpacing:"-0.02em"}}>
          Your Wellness.{" "}
          <em style={{fontStyle:"italic",background:`linear-gradient(135deg,${T.accent},${T.accentLight})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Your Doorstep.</em>
        </h1>
        <p style={{fontSize:16,color:T.textSecondary,lineHeight:1.7,margin:"0 0 30px",maxWidth:520,fontFamily:T.fontBody}}>Book certified massage therapists who come to your home, office or hotel. Real-time availability · Upfront pricing · WhatsApp notifications.</p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <Btn size="lg" onClick={onBook} icon="✦">Book a Session</Btn>
          <Btn size="lg" variant="ghost">View Plans</Btn>
        </div>
        <div style={{display:"flex",gap:0,marginTop:40,flexWrap:"wrap"}}>
          {stats.map((s,i)=>(
            <div key={s.l} style={{padding:"12px 28px 12px 0",marginRight:28,borderRight:i<stats.length-1?`1px solid ${T.border}`:"none"}}>
              <div style={{fontFamily:T.fontDisplay,fontSize:24,color:T.primaryLight,lineHeight:1,marginBottom:3}}>{s.v}</div>
              <div style={{fontSize:12,color:T.textMuted,fontFamily:T.fontBody}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
// BOOKING WIZARD
const STEPS=["Massage","Date & Time","Therapist","Your Details","Confirm"];

function StepBar({cur}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:34}}>
      {STEPS.map((label,i)=>(
        <div key={label} style={{display:"flex",alignItems:"center",flex:i<STEPS.length-1?1:"auto"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:i<cur?T.primaryLight:i===cur?T.accent:T.bgSurface,border:`2px solid ${i<cur?T.primaryLight:i===cur?T.accent:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:i<=cur?"#0d1a13":T.textMuted,fontSize:i<cur?13:11,fontWeight:700,transition:T.transition,flexShrink:0}}>
              {i<cur?"✓":i+1}
            </div>
            <span style={{fontSize:10,color:i===cur?T.accent:T.textMuted,fontWeight:i===cur?700:400,whiteSpace:"nowrap",fontFamily:T.fontBody,display:window.innerWidth<480?"none":"block"}}>{label}</span>
          </div>
          {i<STEPS.length-1&&<div style={{flex:1,height:2,background:i<cur?T.primaryLight:T.border,marginBottom:22,marginLeft:4,marginRight:4,transition:T.transition}}/>}
        </div>
      ))}
    </div>
  );
}

// Step 0 — Massage Type
function S0({sel,onSel,dPct}){
  return(
    <div>
      <h3 style={{fontFamily:T.fontDisplay,color:T.textPrimary,fontSize:21,marginBottom:4,fontWeight:400}}>Choose Your Massage</h3>
      <p style={{color:T.textMuted,fontSize:14,marginBottom:20,fontFamily:T.fontBody}}>Select the treatment that best fits your body today</p>
      {dPct>0&&<div style={{background:`${T.primaryLight}10`,border:`1px solid ${T.primaryLight}28`,borderRadius:T.radius,padding:"10px 16px",marginBottom:18,fontSize:13,color:T.primaryLight}}>🎉 Your {dPct}% subscription discount will apply at checkout</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:13}}>
        {MASSAGE_TYPES.map(m=>{
          const isS=sel===m.id,price=discP(m.base,dPct);
          return(
            <div key={m.id} onClick={()=>onSel(m.id)} style={{background:isS?`${m.color}12`:T.bgCard,border:`1.5px solid ${isS?m.color:T.border}`,borderRadius:T.radiusMd,padding:17,cursor:"pointer",transition:T.transition,position:"relative"}}>
              {isS&&<div style={{position:"absolute",top:10,right:10,width:20,height:20,borderRadius:"50%",background:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#0d1a13",fontWeight:900}}>✓</div>}
              <div style={{fontSize:28,marginBottom:9}}>{m.icon}</div>
              <div style={{fontWeight:700,color:T.textPrimary,fontSize:14,marginBottom:3,fontFamily:T.fontBody}}>{m.name}</div>
              <div style={{color:T.textMuted,fontSize:12,marginBottom:11,lineHeight:1.5}}>{m.desc}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  {dPct>0&&<div style={{color:T.textMuted,fontSize:11,textDecoration:"line-through"}}>{fmtN(m.base)}</div>}
                  <div style={{color:m.color,fontWeight:700,fontSize:15}}>{fmtN(price)}</div>
                </div>
                <Badge color={T.textMuted} style={{fontSize:10}}>{m.duration}min</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Step 1 — Date & Time
function S1({date,time,onDate,onTime,therapists}){
  const dates=genDays(14);
  const avail=(d,t)=>therapists.filter(th=>!th.bookedSlots?.[`${d}_${t}`]).length;
  return(
    <div>
      <h3 style={{fontFamily:T.fontDisplay,color:T.textPrimary,fontSize:21,marginBottom:4,fontWeight:400}}>Pick Date & Time</h3>
      <p style={{color:T.textMuted,fontSize:14,marginBottom:22}}>Real-time therapist availability shown below</p>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:T.textMuted,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>Date</div>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8}}>
          {dates.map(d=>{
            const dt=new Date(d+"T12:00:00"),isS=d===date,today=d===dates[0];
            return(
              <div key={d} onClick={()=>onDate(d)} style={{minWidth:62,padding:"11px 9px",borderRadius:T.radiusMd,background:isS?T.primaryLight:T.bgCard,border:`1.5px solid ${isS?T.primaryLight:T.border}`,cursor:"pointer",textAlign:"center",transition:T.transition,flexShrink:0}}>
                <div style={{fontSize:10,color:isS?"#0d1a13":T.textMuted,fontWeight:700,marginBottom:4}}>{today?"TODAY":dt.toLocaleDateString("en-NG",{weekday:"short"}).toUpperCase()}</div>
                <div style={{fontSize:21,fontWeight:700,color:isS?"#0d1a13":T.textPrimary,fontFamily:T.fontDisplay,lineHeight:1}}>{dt.getDate()}</div>
                <div style={{fontSize:10,color:isS?"#0d1a13":T.textMuted,marginTop:2}}>{dt.toLocaleDateString("en-NG",{month:"short"})}</div>
              </div>
            );
          })}
        </div>
      </div>
      {date&&(
        <div>
          <div style={{fontSize:11,color:T.textMuted,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>Time Slot</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:8}}>
            {TIME_SLOTS.map(t=>{
              const n=avail(date,t),isS=t===time,full=n===0;
              return(
                <div key={t} onClick={()=>!full&&onTime(t)} style={{padding:"10px 7px",borderRadius:T.radius,background:isS?T.primaryLight:T.bgSurface,border:`1.5px solid ${isS?T.primaryLight:T.border}`,cursor:full?"not-allowed":"pointer",textAlign:"center",opacity:full?0.35:1,transition:T.transition}}>
                  <div style={{fontSize:13,fontWeight:700,color:isS?"#0d1a13":T.textPrimary}}>{t}</div>
                  <div style={{fontSize:10,color:isS?"#0d1a13":T.textMuted,marginTop:2}}>{full?"Full":`${n} free`}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Step 2 — Therapist (with privacy photo system)
function S2({therapists,date,time,selId,onSel,favorites,onTogFav}){
  const[photoTarget,setPhotoTarget]=useState(null);
  const avail=therapists.filter(t=>!t.bookedSlots?.[`${date}_${time}`]);
  return(
    <div>
      <h3 style={{fontFamily:T.fontDisplay,color:T.textPrimary,fontSize:21,marginBottom:4,fontWeight:400}}>Choose Your Therapist</h3>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,flexWrap:"wrap"}}>
        <p style={{color:T.textMuted,fontSize:14,margin:0}}><span style={{color:T.primaryLight,fontWeight:700}}>{avail.length}</span> available on <span style={{color:T.primaryLight}}>{shortD(date)}</span> at <span style={{color:T.primaryLight}}>{time}</span></p>
        <Badge color={T.accent} style={{fontSize:10}}>🔒 Photos hidden for privacy</Badge>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:11}}>
        {avail.map(t=>{
          const isS=t.id===selId,fav=favorites.includes(t.id);
          return(
            <div key={t.id} onClick={()=>onSel(t)} style={{display:"flex",gap:15,padding:17,borderRadius:T.radiusMd,background:isS?`${T.primary}12`:T.bgCard,border:`1.5px solid ${isS?T.primaryLight:T.border}`,cursor:"pointer",transition:T.transition,alignItems:"center"}}>
              <div style={{position:"relative",flexShrink:0}}>
                <img src={t.avatar} alt="Therapist" style={{width:58,height:58,borderRadius:"50%",objectFit:"cover",border:`2px solid ${T.border}`,filter:t.photoRevealed?"none":"blur(8px) grayscale(40%)",transition:"filter 0.4s ease"}}/>
                {!t.photoRevealed&&(
                  <div style={{position:"absolute",inset:0,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:18}}>🔒</span>
                  </div>
                )}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4,flexWrap:"wrap"}}>
                  <span style={{fontWeight:700,color:T.textPrimary,fontSize:15}}>{t.name}</span>
                  {t.certified&&<Badge>✓ Certified</Badge>}
                  {fav&&<Badge color={T.accent}>♥</Badge>}
                </div>
                <div style={{color:T.accent,fontSize:13,marginBottom:4}}>{stars(t.rating)} <span style={{color:T.textMuted,fontSize:12}}>({t.reviewCount})</span></div>
                <div style={{color:T.textMuted,fontSize:12,marginBottom:6}}>{t.experience} yrs · {t.specialties.slice(0,2).join(", ")}</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                  {t.specialties.slice(0,3).map(s=><Tag key={s}>{s}</Tag>)}
                  <button onClick={e=>{e.stopPropagation();setPhotoTarget(t);}} style={{background:`${T.accent}15`,border:`1px solid ${T.accent}40`,borderRadius:T.radiusFull,padding:"3px 9px",color:T.accent,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:T.fontBody}}>
                    {t.photoRevealed?"📸 Photo visible":"🔍 Request Photo"}
                  </button>
                </div>
              </div>
              <button onClick={e=>{e.stopPropagation();onTogFav(t.id);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:fav?T.accent:T.textMuted,padding:4,flexShrink:0}}>{fav?"♥":"♡"}</button>
            </div>
          );
        })}
        {avail.length===0&&<div style={{textAlign:"center",padding:40,color:T.textMuted}}>No therapists available at this slot. Please try a different time.</div>}
      </div>
      <PhotoRequestModal therapist={photoTarget} open={!!photoTarget} onClose={()=>setPhotoTarget(null)}/>
    </div>
  );
}
// Step 3 — Details
function S3({user,setUser,location,setLocation,address,setAddress,wellness,setWellness}){
  const[showW,setShowW]=useState(true);
  const tP=p=>setWellness(w=>({...w,painAreas:w.painAreas.includes(p)?w.painAreas.filter(x=>x!==p):[...w.painAreas,p]}));
  const tC=c=>setWellness(w=>({...w,conditions:w.conditions.includes(c)?w.conditions.filter(x=>x!==c):[...w.conditions,c]}));
  return(
    <div>
      <h3 style={{fontFamily:T.fontDisplay,color:T.textPrimary,fontSize:21,marginBottom:4,fontWeight:400}}>Your Details</h3>
      <p style={{color:T.textMuted,fontSize:14,marginBottom:22}}>Help us personalise your session</p>
      <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:T.radiusMd,padding:18,marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:T.primaryLight,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:15}}>Contact Information</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:13}}>
          <Inp label="Full Name" required value={user.name||""} onChange={e=>setUser(u=>({...u,name:e.target.value}))} placeholder="Your full name"/>
          <Inp label="Email Address" required type="email" value={user.email||""} onChange={e=>setUser(u=>({...u,email:e.target.value}))} placeholder="you@example.com"/>
          <Inp label="Phone Number" type="tel" value={user.phone||""} onChange={e=>setUser(u=>({...u,phone:e.target.value}))} placeholder="+234 800 000 0000"/>
          <Inp label="WhatsApp (for updates)" type="tel" value={user.whatsapp||""} onChange={e=>setUser(u=>({...u,whatsapp:e.target.value}))} placeholder="+234 800 000 0000"/>
        </div>
      </div>
      <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:T.radiusMd,padding:18,marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:T.primaryLight,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:15}}>Service Location</div>
        <div style={{display:"flex",gap:10,marginBottom:13,flexWrap:"wrap"}}>
          {LOCATIONS.map(l=>(
            <div key={l.id} onClick={()=>setLocation(l.id)} style={{flex:1,minWidth:90,padding:"11px 13px",borderRadius:T.radius,background:location===l.id?`${T.primary}1a`:T.bgSurface,border:`1.5px solid ${location===l.id?T.primaryLight:T.border}`,cursor:"pointer",textAlign:"center",transition:T.transition}}>
              <div style={{fontSize:20,marginBottom:3}}>{l.icon}</div>
              <div style={{fontSize:13,fontWeight:700,color:location===l.id?T.primaryLight:T.textPrimary}}>{l.label}</div>
              <div style={{fontSize:11,color:T.textMuted}}>{l.hint}</div>
            </div>
          ))}
        </div>
        <Inp label={`${LOCATIONS.find(l=>l.id===location)?.label} Address`} required value={address} onChange={e=>setAddress(e.target.value)} placeholder={`Enter full ${location} address with landmarks…`}/>
      </div>
      <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:T.radiusMd,overflow:"hidden"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"15px 18px",cursor:"pointer",borderBottom:showW?`1px solid ${T.border}`:"none"}} onClick={()=>setShowW(v=>!v)}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:T.primaryLight,letterSpacing:"0.08em",textTransform:"uppercase"}}>Wellness Preferences</div>
            <div style={{fontSize:12,color:T.textMuted,marginTop:2}}>Help your therapist prepare the ideal session</div>
          </div>
          <span style={{color:T.textMuted,fontSize:16}}>{showW?"▲":"▼"}</span>
        </div>
        {showW&&(
          <div style={{padding:18}}>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:T.textMuted,fontWeight:700,textTransform:"uppercase",marginBottom:10}}>Pain / Focus Areas</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{PAIN_AREAS.map(p=><Tag key={p} active={wellness.painAreas.includes(p)} onClick={()=>tP(p)} color={T.primaryLight}>{p}</Tag>)}</div>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:T.textMuted,fontWeight:700,textTransform:"uppercase",marginBottom:10}}>Pressure Preference</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {PRESSURES.map(p=>(
                  <div key={p.id} onClick={()=>setWellness(w=>({...w,pressure:p.id}))} style={{flex:1,minWidth:75,padding:"9px 10px",borderRadius:T.radius,background:wellness.pressure===p.id?`${T.primary}1a`:T.bgSurface,border:`1.5px solid ${wellness.pressure===p.id?T.primaryLight:T.border}`,cursor:"pointer",textAlign:"center",transition:T.transition}}>
                    <div style={{fontSize:13,fontWeight:700,color:wellness.pressure===p.id?T.primaryLight:T.textPrimary}}>{p.label}</div>
                    <div style={{fontSize:11,color:T.textMuted}}>{p.note}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:T.textMuted,fontWeight:700,textTransform:"uppercase",marginBottom:10}}>Health Conditions</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{CONDITIONS.map(c=><Tag key={c} active={wellness.conditions.includes(c)} onClick={()=>tC(c)} color={T.teal}>{c}</Tag>)}</div>
            </div>
            <Inp label="Additional Notes" rows={3} value={wellness.notes||""} onChange={e=>setWellness(w=>({...w,notes:e.target.value}))} placeholder="Anything your therapist should know before arriving…"/>
          </div>
        )}
      </div>
    </div>
  );
}

// Step 4 — Confirm
function S4({massageType,date,time,therapist,location,address,user,wellness,dPct,finalPrice}){
  const mt=MASSAGE_TYPES.find(m=>m.id===massageType);
  const loc=LOCATIONS.find(l=>l.id===location);
  const rows=[["Massage",`${mt?.icon} ${mt?.name}`],["Date",shortD(date)],["Time",time],["Duration",`${mt?.duration} min`],["Location",`${loc?.icon} ${loc?.label}`],["Address",address],["Therapist",therapist?.name],["Pressure",PRESSURES.find(p=>p.id===wellness.pressure)?.label]];
  return(
    <div>
      <h3 style={{fontFamily:T.fontDisplay,color:T.textPrimary,fontSize:21,marginBottom:4,fontWeight:400}}>Confirm Your Booking</h3>
      <p style={{color:T.textMuted,fontSize:14,marginBottom:22}}>Review all details before confirming</p>
      <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:T.radiusMd,overflow:"hidden",marginBottom:14}}>
        {rows.map(([k,v],i)=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"12px 18px",borderBottom:i<rows.length-1?`1px solid ${T.border}`:"none",gap:16}}>
            <span style={{color:T.textMuted,fontSize:13}}>{k}</span>
            <span style={{color:T.textPrimary,fontSize:13,fontWeight:600,textAlign:"right"}}>{v}</span>
          </div>
        ))}
        {wellness.painAreas?.length>0&&(
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 18px",borderTop:`1px solid ${T.border}`}}>
            <span style={{color:T.textMuted,fontSize:13}}>Focus Areas</span>
            <span style={{color:T.textPrimary,fontSize:13,fontWeight:600,textAlign:"right"}}>{wellness.painAreas.join(", ")}</span>
          </div>
        )}
        <div style={{background:`${T.primary}08`,borderTop:`1px solid ${T.border}`,padding:"14px 18px"}}>
          {dPct>0&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{color:T.textMuted,fontSize:13}}>Base price</span>
                <span style={{color:T.textMuted,fontSize:13,textDecoration:"line-through"}}>{fmtN(MASSAGE_TYPES.find(m=>m.id===massageType)?.base)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
                <span style={{color:T.primaryLight,fontSize:13}}>Subscription {dPct}% off</span>
                <span style={{color:T.primaryLight,fontSize:13}}>−{fmtN(MASSAGE_TYPES.find(m=>m.id===massageType)?.base-finalPrice)}</span>
              </div>
            </>
          )}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:T.textPrimary,fontSize:16,fontWeight:700,fontFamily:T.fontDisplay}}>Total</span>
            <span style={{color:T.accent,fontSize:24,fontWeight:700,fontFamily:T.fontDisplay}}>{fmtN(finalPrice)}</span>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,padding:"11px 15px",background:`${T.wa}0a`,border:`1px solid ${T.wa}28`,borderRadius:T.radius}}>
        <span style={{fontSize:16,flexShrink:0}}>💬</span>
        <span style={{color:T.textSecondary,fontSize:13,lineHeight:1.5}}>After confirming, you'll send WhatsApp notifications to <strong style={{color:T.textPrimary}}>admin</strong> (full order) and your <strong style={{color:T.textPrimary}}>therapist</strong> (location + time).</span>
      </div>
    </div>
  );
}

// BOOKING WIZARD (main orchestrator)
function BookingWizard({onComplete}){
  const{therapists,setTherapists,setBookings,bookings,discountPct,currentUser,setCurrentUser,addNotification,favorites,toggleFavorite}=useApp();
  const[step,setStep]=useState(0);
  const[massageType,setMT]=useState(null);
  const[date,setDate]=useState(null);
  const[time,setTime]=useState(null);
  const[therapist,setTherapist]=useState(null);
  const[location,setLocation]=useState("home");
  const[address,setAddress]=useState("");
  const[user,setUser]=useState({name:currentUser.name||"",email:currentUser.email||"",phone:currentUser.phone||"",whatsapp:currentUser.whatsapp||""});
  const[wellness,setWellness]=useState({painAreas:[],pressure:"medium",conditions:[],notes:""});
  const[loading,setLoading]=useState(false);
  const[confirmedBooking,setCB]=useState(null);
  const[showWA,setShowWA]=useState(false);

  const mt=MASSAGE_TYPES.find(m=>m.id===massageType);
  const finalPrice=mt?discP(mt.base,discountPct):0;

  const canNext=()=>{
    if(step===0)return!!massageType;
    if(step===1)return!!date&&!!time;
    if(step===2)return!!therapist;
    if(step===3)return!!address&&!!user.name&&!!user.email;
    return true;
  };

  const confirm=()=>{
    setLoading(true);
    const id=genId();
    const booking={
      id,massageType,massageTypeName:mt.name,icon:mt.icon,duration:mt.duration,
      date,time,locationType:LOCATIONS.find(l=>l.id===location)?.label,address,
      therapistId:therapist.id,therapistName:therapist.name,therapistEmail:therapist.email,therapistPhone:therapist.phone,
      clientName:user.name,clientEmail:user.email,clientPhone:user.phone,clientWhatsapp:user.whatsapp,
      wellness,basePrice:mt.base,discountPercent:discountPct,finalPrice,status:"upcoming",createdAt:new Date().toISOString(),
    };
    const updT=therapists.map(t=>t.id===therapist.id?{...t,bookedSlots:{...t.bookedSlots,[`${date}_${time}`]:true}}:t);
    setTherapists(updT);
    setBookings(prev=>[booking,...prev]);
    setCurrentUser({...currentUser,...user});
    setLoading(false);
    setCB(booking);
    addNotification(`Booking confirmed! ${therapist.name} on ${shortD(date)} at ${time}.`,"success");
    setShowWA(true);
  };

  const reset=()=>{setStep(0);setMT(null);setDate(null);setTime(null);setTherapist(null);setAddress("");setCB(null);setShowWA(false);};

  if(confirmedBooking&&!showWA){
    return(
      <div style={{textAlign:"center",padding:"60px 24px",maxWidth:480,margin:"0 auto"}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:`${T.primaryLight}18`,border:`2px solid ${T.primaryLight}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 24px",color:T.primaryLight}}>✓</div>
        <h2 style={{fontFamily:T.fontDisplay,color:T.textPrimary,fontSize:28,marginBottom:8,fontWeight:400}}>Booking Confirmed!</h2>
        <p style={{color:T.textMuted,marginBottom:4}}><strong style={{color:T.textPrimary}}>{confirmedBooking.therapistName}</strong> · {shortD(confirmedBooking.date)} · {confirmedBooking.time}</p>
        <p style={{color:T.accent,fontWeight:700,fontSize:22,marginBottom:24,fontFamily:T.fontDisplay}}>{fmtN(confirmedBooking.finalPrice)}</p>
        {discountPct>0&&<Badge color={T.primaryLight} style={{marginBottom:24}}>✓ {discountPct}% discount applied</Badge>}
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <Btn onClick={reset}>Book Another</Btn>
          <Btn variant="secondary" onClick={()=>onComplete?.("bookings")}>View Bookings</Btn>
        </div>
      </div>
    );
  }

  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px"}}>
      <StepBar cur={step}/>
      <div style={{minHeight:380}}>
        {step===0&&<S0 sel={massageType} onSel={setMT} dPct={discountPct}/>}
        {step===1&&<S1 date={date} time={time} onDate={setDate} onTime={setTime} therapists={therapists}/>}
        {step===2&&<S2 therapists={therapists} date={date} time={time} selId={therapist?.id} onSel={setTherapist} favorites={favorites} onTogFav={toggleFavorite}/>}
        {step===3&&<S3 user={user} setUser={setUser} location={location} setLocation={setLocation} address={address} setAddress={setAddress} wellness={wellness} setWellness={setWellness}/>}
        {step===4&&<S4 massageType={massageType} date={date} time={time} therapist={therapist} location={location} address={address} user={user} wellness={wellness} dPct={discountPct} finalPrice={finalPrice}/>}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:34,paddingTop:22,borderTop:`1px solid ${T.border}`}}>
        <div>{step>0&&<Btn variant="secondary" onClick={()=>setStep(s=>s-1)} icon="←">Back</Btn>}</div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {mt&&step>0&&<span style={{color:T.textMuted,fontSize:13}}>Total: <strong style={{color:T.accent}}>{fmtN(finalPrice)}</strong></span>}
          {step<STEPS.length-1
            ?<Btn onClick={()=>canNext()&&setStep(s=>s+1)} disabled={!canNext()}>Continue →</Btn>
            :<Btn onClick={confirm} disabled={loading}>{loading?"Confirming…":"Confirm & Notify 💬"}</Btn>}
        </div>
      </div>
      {confirmedBooking&&<WAModal booking={confirmedBooking} open={showWA} onClose={()=>setShowWA(false)} onDone={()=>setShowWA(false)}/>}
    </div>
  );
}
// THERAPISTS PAGE
function TherapistCard({t,onProfile,onReview}){
  const{favorites,toggleFavorite}=useApp();
  const fav=favorites.includes(t.id);
  const[photoTarget,setPhotoTarget]=useState(null);
  return(
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:T.radiusLg,overflow:"hidden",display:"flex",flexDirection:"column"}}>
      <div style={{position:"relative",height:185,overflow:"hidden",background:T.bgSurface}}>
        {t.photoRevealed?(
          <img src={t.avatar} alt={t.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        ):(
          <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
            <div style={{width:70,height:70,borderRadius:"50%",overflow:"hidden",filter:"blur(6px) grayscale(50%)"}}>
              <img src={t.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            </div>
            <span style={{color:T.textMuted,fontSize:12,fontWeight:600}}>🔒 Photo hidden for privacy</span>
            <button onClick={()=>setPhotoTarget(t)} style={{background:`${T.accent}15`,border:`1px solid ${T.accent}40`,borderRadius:T.radiusFull,padding:"5px 12px",color:T.accent,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:T.fontBody}}>Request Photo</button>
          </div>
        )}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(13,26,19,0.7),transparent)",pointerEvents:"none"}}/>
        {t.certified&&<div style={{position:"absolute",top:10,left:10,background:`${T.primaryLight}ee`,borderRadius:T.radiusFull,padding:"3px 10px",fontSize:11,fontWeight:700,color:"#0a1a0d"}}>✓ Certified</div>}
        <button onClick={()=>toggleFavorite(t.id)} style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)",border:`1px solid ${fav?T.accent+"60":"rgba(255,255,255,0.2)"}`,borderRadius:"50%",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15,color:fav?T.accent:"#fff"}}>{fav?"♥":"♡"}</button>
      </div>
      <div style={{padding:16,flex:1,display:"flex",flexDirection:"column"}}>
        <h3 style={{fontFamily:T.fontDisplay,fontSize:17,color:T.textPrimary,margin:"0 0 3px",fontWeight:400}}>{t.name}</h3>
        <div style={{color:T.accent,fontSize:13,marginBottom:6}}>{stars(t.rating)} <span style={{color:T.textMuted,fontSize:12}}>({t.reviewCount})</span></div>
        <p style={{color:T.textMuted,fontSize:13,lineHeight:1.55,margin:"0 0 10px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{t.bio}</p>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>{t.specialties.slice(0,3).map(s=><Tag key={s}>{s}</Tag>)}</div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,marginBottom:13}}>
          {[["Exp",`${t.experience}yr`],["Reviews",t.reviewCount],["Skills",t.specialties.length]].map(([l,v])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{color:T.primaryLight,fontWeight:700,fontSize:15,fontFamily:T.fontDisplay}}>{v}</div>
              <div style={{color:T.textMuted,fontSize:11}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:7,marginTop:"auto"}}>
          <Btn variant="outline" fullWidth size="sm" onClick={()=>onProfile(t)}>Profile</Btn>
          <Btn variant="ghost" fullWidth size="sm" onClick={()=>onReview(t)}>Review</Btn>
        </div>
      </div>
      <PhotoRequestModal therapist={photoTarget} open={!!photoTarget} onClose={()=>setPhotoTarget(null)}/>
    </div>
  );
}

function TherapistProfileModal({t,open,onClose,onReview}){
  const{favorites,toggleFavorite}=useApp();
  const[photoTarget,setPhotoTarget]=useState(null);
  if(!t)return null;
  const fav=favorites.includes(t.id);
  return(
    <Modal open={open} onClose={onClose} title="" maxWidth={580}>
      <div style={{position:"relative",height:210,borderRadius:T.radiusMd,overflow:"hidden",marginBottom:18}}>
        {t.photoRevealed?(
          <img src={t.avatar} alt={t.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        ):(
          <div style={{width:"100%",height:"100%",background:T.bgSurface,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
            <div style={{width:80,height:80,borderRadius:"50%",overflow:"hidden",filter:"blur(8px)"}}>
              <img src={t.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            </div>
            <span style={{color:T.textMuted,fontSize:13}}>🔒 Photo hidden for privacy</span>
            <button onClick={()=>setPhotoTarget(t)} style={{background:`${T.accent}18`,border:`1px solid ${T.accent}40`,borderRadius:T.radiusFull,padding:"6px 14px",color:T.accent,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:T.fontBody}}>Request Photo Access</button>
          </div>
        )}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(15,29,21,0.9) 0%,transparent 50%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:14,left:16}}>
          <h2 style={{fontFamily:T.fontDisplay,color:"#fff",fontSize:22,margin:"0 0 5px",fontWeight:400}}>{t.name}</h2>
          <div style={{color:T.accent,fontSize:13}}>{stars(t.rating)} <span style={{color:"#ccc",fontSize:12}}>({t.reviewCount} reviews)</span></div>
        </div>
        {t.certified&&<div style={{position:"absolute",top:10,left:10,background:`${T.primaryLight}ee`,borderRadius:T.radiusFull,padding:"3px 10px",fontSize:11,fontWeight:700,color:"#0a1a0d"}}>✓ Certified</div>}
        <button onClick={()=>toggleFavorite(t.id)} style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.5)",border:"none",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:17,color:fav?T.accent:"#fff"}}>{fav?"♥":"♡"}</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:16}}>
        {[["Experience",`${t.experience} yrs`],["Sessions",`${t.reviewCount*3}+`],["Specialties",t.specialties.length]].map(([l,v])=>(
          <div key={l} style={{background:T.bgSurface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"11px",textAlign:"center"}}>
            <div style={{color:T.primaryLight,fontWeight:700,fontSize:17,fontFamily:T.fontDisplay}}>{v}</div>
            <div style={{color:T.textMuted,fontSize:11,marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,color:T.textMuted,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>About</div>
        <p style={{color:T.textSecondary,fontSize:14,lineHeight:1.7,margin:0}}>{t.bio}</p>
      </div>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,color:T.textMuted,fontWeight:700,textTransform:"uppercase",marginBottom:9}}>Specialties</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{t.specialties.map(s=><Tag key={s} active>{s}</Tag>)}</div>
      </div>
      {t.reviewList?.length>0&&(
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:T.textMuted,fontWeight:700,textTransform:"uppercase",marginBottom:11}}>Reviews</div>
          {t.reviewList.map((r,i)=>(
            <div key={i} style={{background:T.bgSurface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:13,marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{color:T.accent,fontSize:13}}>{"★".repeat(r.rating)}</span>
                <span style={{color:T.textMuted,fontSize:11}}>{r.author} · {r.date}</span>
              </div>
              <p style={{color:T.textSecondary,fontSize:13,margin:0,lineHeight:1.5}}>{r.text}</p>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",gap:10}}>
        <Btn fullWidth onClick={()=>{onClose();onReview(t);}}>Write a Review</Btn>
        <Btn variant="secondary" fullWidth onClick={onClose}>Close</Btn>
      </div>
      <PhotoRequestModal therapist={photoTarget} open={!!photoTarget} onClose={()=>setPhotoTarget(null)}/>
    </Modal>
  );
}

function AddTherapistModal({open,onClose}){
  const{therapists,setTherapists,addNotification}=useApp();
  const[f,setF]=useState({name:"",email:"",phone:"",bio:"",experience:"",avatarUrl:"",specialties:[]});
  const tgS=s=>setF(x=>({...x,specialties:x.specialties.includes(s)?x.specialties.filter(v=>v!==s):[...x.specialties,s]}));
  const submit=()=>{
    if(!f.name||!f.email)return;
    const t={id:`t${Date.now()}`,name:f.name,email:f.email,phone:f.phone||"234000000000",bio:f.bio||"Certified massage therapist committed to your wellness.",experience:Number(f.experience)||1,specialties:f.specialties.length?f.specialties:["Swedish"],avatar:f.avatarUrl||`https://i.pravatar.cc/300?img=${Math.floor(Math.random()*60)+10}`,rating:5.0,reviewCount:0,certified:true,available:true,bookedSlots:{},reviewList:[],photoRevealed:false};
    setTherapists([t,...therapists]);
    addNotification(`${f.name}'s profile created!`,"success");
    setF({name:"",email:"",phone:"",bio:"",experience:"",avatarUrl:"",specialties:[]});onClose();
  };
  return(
    <Modal open={open} onClose={onClose} title="Add New Therapist" subtitle="Create a professional profile">
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          <Inp label="Full Name" required value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))} placeholder="e.g. Amara Nwosu"/>
          <Inp label="Email" required type="email" value={f.email} onChange={e=>setF(x=>({...x,email:e.target.value}))} placeholder="therapist@email.com"/>
          <Inp label="Phone / WhatsApp" type="tel" value={f.phone} onChange={e=>setF(x=>({...x,phone:e.target.value}))} placeholder="+234 800 000 0000"/>
          <Inp label="Years Experience" type="number" value={f.experience} onChange={e=>setF(x=>({...x,experience:e.target.value}))} placeholder="e.g. 5"/>
        </div>
        <Inp label="Bio" rows={3} value={f.bio} onChange={e=>setF(x=>({...x,bio:e.target.value}))} placeholder="Professional background…"/>
        <Inp label="Avatar URL (optional)" value={f.avatarUrl} onChange={e=>setF(x=>({...x,avatarUrl:e.target.value}))} placeholder="https://…"/>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:T.textMuted,textTransform:"uppercase",marginBottom:10}}>Specialties</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{SPECIALTIES.map(s=><Tag key={s} active={f.specialties.includes(s)} onClick={()=>tgS(s)} color={T.primaryLight}>{s}</Tag>)}</div>
        </div>
        <div style={{display:"flex",gap:10,paddingTop:6}}>
          <Btn fullWidth onClick={submit} disabled={!f.name||!f.email}>Create Profile</Btn>
          <Btn variant="secondary" fullWidth onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </Modal>
  );
}

function ReviewModal({therapist,open,onClose}){
  const{therapists,setTherapists,addNotification}=useApp();
  const[rating,setRating]=useState(5);
  const[text,setText]=useState("");
  const[author,setAuthor]=useState("");
  const submit=()=>{
    if(!text.trim())return;
    const review={author:author||"Anonymous",rating,text,date:new Date().toLocaleDateString("en-NG",{month:"short",day:"numeric",year:"numeric"})};
    const upd=therapists.map(t=>{
      if(t.id!==therapist.id)return t;
      const list=[...(t.reviewList||[]),review];
      const avg=+(list.reduce((s,r)=>s+r.rating,0)/list.length).toFixed(1);
      return{...t,reviewList:list,rating:avg,reviewCount:list.length};
    });
    setTherapists(upd);
    addNotification(`Review for ${therapist.name} submitted!`,"success");
    setText("");setRating(5);setAuthor("");onClose();
  };
  if(!therapist)return null;
  return(
    <Modal open={open} onClose={onClose} title={`Review ${therapist.name}`} subtitle="Help others make great choices">
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:T.textMuted,textTransform:"uppercase",marginBottom:11}}>Your Rating</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}><StarRating value={rating} onChange={setRating} size={30}/><span style={{color:T.textMuted,fontSize:14}}>{["","Poor","Fair","Good","Very Good","Excellent"][rating]}</span></div>
        </div>
        <Inp label="Your Name (optional)" value={author} onChange={e=>setAuthor(e.target.value)} placeholder="e.g. Chidi O."/>
        <Inp label="Your Review" required rows={4} value={text} onChange={e=>setText(e.target.value)} placeholder="Describe your experience…"/>
        <div style={{display:"flex",gap:10}}><Btn fullWidth onClick={submit} disabled={!text.trim()}>Submit Review</Btn><Btn variant="secondary" fullWidth onClick={onClose}>Cancel</Btn></div>
      </div>
    </Modal>
  );
}

function TherapistsPage(){
  const{therapists}=useApp();
  const[search,setSearch]=useState("");
  const[filterSpec,setFSpec]=useState(null);
  const[profileT,setProfileT]=useState(null);
  const[reviewT,setReviewT]=useState(null);
  const[showAdd,setShowAdd]=useState(false);
  const filtered=therapists.filter(t=>{
    const ms=!search||t.name.toLowerCase().includes(search.toLowerCase())||t.specialties.some(s=>s.toLowerCase().includes(search.toLowerCase()));
    const sp=!filterSpec||t.specialties.includes(filterSpec);
    return ms&&sp;
  });
  return(
    <div style={{maxWidth:1200,margin:"0 auto",padding:"32px 24px"}}>
      <SecHead title="Our Therapists" subtitle={`${therapists.length} certified professionals ready to serve`} action={<Btn icon="+" onClick={()=>setShowAdd(true)}>Add Therapist</Btn>}/>
      <div style={{marginBottom:22}}>
        <Inp value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or specialty…" style={{marginBottom:12}}/>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:6}}>
          {[{id:null,label:"All"},...SPECIALTIES.map(s=>({id:s,label:s}))].map(f=>(
            <button key={f.label} onClick={()=>setFSpec(f.id)} style={{padding:"5px 13px",borderRadius:T.radiusFull,border:`1px solid ${filterSpec===f.id?T.primaryLight:T.border}`,background:filterSpec===f.id?`${T.primary}1a`:"transparent",color:filterSpec===f.id?T.primaryLight:T.textMuted,fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",transition:T.transition,fontFamily:T.fontBody}}>{f.label}</button>
          ))}
        </div>
      </div>
      <div style={{color:T.textMuted,fontSize:13,marginBottom:18}}>Showing <strong style={{color:T.textPrimary}}>{filtered.length}</strong> of {therapists.length} therapists</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(275px,1fr))",gap:18}}>
        {filtered.map(t=><TherapistCard key={t.id} t={t} onProfile={()=>setProfileT(t)} onReview={()=>setReviewT(t)}/>)}
      </div>
      {filtered.length===0&&<div style={{textAlign:"center",padding:60,color:T.textMuted}}>No therapists found. Adjust your filters.</div>}
      <TherapistProfileModal t={profileT} open={!!profileT} onClose={()=>setProfileT(null)} onReview={t=>{setProfileT(null);setReviewT(t);}}/>
      <ReviewModal therapist={reviewT} open={!!reviewT} onClose={()=>setReviewT(null)}/>
      <AddTherapistModal open={showAdd} onClose={()=>setShowAdd(false)}/>
    </div>
  );
}
// BOOKINGS PAGE
function BookingsPage({onBookNew}){
  const{bookings,setBookings,addNotification}=useApp();
  const[filter,setFilter]=useState("all");
  const[waTarget,setWATarget]=useState(null);
  const cancel=id=>{setBookings(prev=>prev.map(b=>b.id===id?{...b,status:"cancelled"}:b));addNotification("Booking cancelled.","info");};
  const tabs=[{id:"all",label:"All",n:bookings.length},{id:"upcoming",label:"Upcoming",n:bookings.filter(b=>b.status==="upcoming").length},{id:"completed",label:"Completed",n:bookings.filter(b=>b.status==="completed").length},{id:"cancelled",label:"Cancelled",n:bookings.filter(b=>b.status==="cancelled").length}];
  const displayed=filter==="all"?bookings:bookings.filter(b=>b.status===filter);
  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px"}}>
      <SecHead title="My Bookings" subtitle="Track, manage, and re-notify for all sessions" action={<Btn onClick={onBookNew} icon="✦">Book New Session</Btn>}/>
      <div style={{display:"flex",gap:6,marginBottom:24,flexWrap:"wrap"}}>
        {tabs.map(f=>(
          <button key={f.id} onClick={()=>setFilter(f.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 15px",borderRadius:T.radiusFull,border:`1px solid ${filter===f.id?T.primaryLight:T.border}`,background:filter===f.id?`${T.primary}1a`:"transparent",color:filter===f.id?T.primaryLight:T.textMuted,fontSize:13,fontWeight:filter===f.id?700:400,cursor:"pointer",transition:T.transition,fontFamily:T.fontBody}}>
            {f.label}
            <span style={{background:filter===f.id?T.primaryLight:T.bgSurface,color:filter===f.id?"#0d1a13":T.textMuted,borderRadius:T.radiusFull,padding:"1px 7px",fontSize:11,fontWeight:700}}>{f.n}</span>
          </button>
        ))}
      </div>
      {displayed.length>0?(
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          {displayed.map(b=>{
            const mt=MASSAGE_TYPES.find(m=>m.id===b.massageType);
            const sc={upcoming:{color:T.primaryLight,label:"Upcoming"},completed:{color:T.textMuted,label:"Completed"},cancelled:{color:T.error,label:"Cancelled"}}[b.status]||{color:T.textMuted,label:"?"};
            return(
              <div key={b.id} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:T.radiusMd,overflow:"hidden"}}>
                <div style={{display:"flex",gap:14,padding:18,alignItems:"center",flexWrap:"wrap"}}>
                  <div style={{width:50,height:50,borderRadius:T.radius,background:`${mt?.color||T.primary}18`,border:`1px solid ${mt?.color||T.primary}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{mt?.icon||"🌿"}</div>
                  <div style={{flex:1,minWidth:170}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,color:T.textPrimary,fontSize:14}}>{mt?.name||b.massageType} Massage</span>
                      <Badge color={sc.color}>{sc.label}</Badge>
                      {b.discountPercent>0&&<Badge color={T.primaryLight}>{b.discountPercent}% off</Badge>}
                    </div>
                    <div style={{color:T.textMuted,fontSize:13,marginBottom:2}}>{shortD(b.date)} · {b.time} · {b.duration} min</div>
                    <div style={{color:T.textSecondary,fontSize:13}}>👤 {b.therapistName} · 📍 {b.locationType}</div>
                    <div style={{color:T.textMuted,fontSize:12,marginTop:2}}>📌 {b.address}</div>
                  </div>
                  <div style={{textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:7}}>
                    <div style={{color:T.accent,fontWeight:700,fontSize:17,fontFamily:T.fontDisplay}}>{fmtN(b.finalPrice)}</div>
                    <div style={{color:T.textMuted,fontSize:11}}>{b.id}</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <Btn variant="wa" size="sm" onClick={()=>setWATarget(b)} icon="💬" title="Re-send WhatsApp notifications">Re-notify</Btn>
                      {b.status==="upcoming"&&<Btn variant="danger" size="sm" onClick={()=>cancel(b.id)}>Cancel</Btn>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ):(
        <Empty icon="📋" title="No bookings yet" desc="Book your first session and begin your wellness journey today." action={<Btn onClick={onBookNew} icon="✦">Book a Session</Btn>}/>
      )}
      {waTarget&&<WAModal booking={waTarget} open={!!waTarget} onClose={()=>setWATarget(null)} onDone={()=>setWATarget(null)}/>}
    </div>
  );
}

// FAVOURITES PAGE
function FavoritesPage({onNav}){
  const{therapists,favorites,toggleFavorite}=useApp();
  const favs=therapists.filter(t=>favorites.includes(t.id));
  return(
    <div style={{maxWidth:1200,margin:"0 auto",padding:"32px 24px"}}>
      <SecHead title="Favourite Therapists" subtitle="Your handpicked wellness team"/>
      {favs.length===0?(
        <Empty icon="♡" title="No favourites yet" desc="Browse therapists and tap ♡ to save your preferred ones." action={<Btn onClick={()=>onNav("therapists")} icon="👤">Browse Therapists</Btn>}/>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:18}}>
          {favs.map(t=>(
            <div key={t.id} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:T.radiusLg,overflow:"hidden"}}>
              <div style={{position:"relative",height:170}}>
                {t.photoRevealed?<img src={t.avatar} alt={t.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:(
                  <div style={{width:"100%",height:"100%",background:T.bgSurface,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
                    <div style={{width:60,height:60,borderRadius:"50%",overflow:"hidden",filter:"blur(6px)"}}>
                      <img src={t.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    </div>
                    <span style={{color:T.textMuted,fontSize:12}}>🔒 Privacy Protected</span>
                  </div>
                )}
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(13,26,19,0.65),transparent)",pointerEvents:"none"}}/>
                <button onClick={()=>toggleFavorite(t.id)} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.5)",border:"none",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15,color:T.accent}}>♥</button>
              </div>
              <div style={{padding:15}}>
                <h3 style={{fontFamily:T.fontDisplay,fontSize:16,color:T.textPrimary,margin:"0 0 3px",fontWeight:400}}>{t.name}</h3>
                <div style={{color:T.accent,fontSize:13,marginBottom:8}}>{stars(t.rating)} <span style={{color:T.textMuted,fontSize:12}}>({t.reviewCount})</span></div>
                <Btn variant="outline" fullWidth size="sm" onClick={()=>onNav("book")}>Book This Therapist</Btn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// PLANS PAGE
function PlansPage(){
  const{subscriptions,setSubscriptions,addNotification}=useApp();
  const activePlan=subscriptions.find(s=>s.active);
  const subscribe=pid=>{const p=PLANS.find(x=>x.id===pid);setSubscriptions([{plan:pid,active:true,startDate:new Date().toISOString()},...subscriptions.filter(s=>s.plan!==pid).map(s=>({...s,active:false}))]);addNotification(`${p.name} activated! Enjoy ${p.discount}% off.`,"success");};
  const cancel=pid=>{setSubscriptions(prev=>prev.map(s=>s.plan===pid?{...s,active:false}:s));addNotification("Subscription cancelled.","info");};
  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px"}}>
      <SecHead title="Wellness Plans" subtitle="Subscribe for recurring sessions at exclusive discounted rates"/>
      {activePlan&&(
        <div style={{background:`${T.primaryLight}0e`,border:`1px solid ${T.primaryLight}30`,borderRadius:T.radiusMd,padding:"14px 18px",marginBottom:26,display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:20}}>⭐</span>
          <div><div style={{color:T.primaryLight,fontWeight:700,fontSize:14}}>Active Subscription</div><div style={{color:T.textMuted,fontSize:13}}>You're on the <strong style={{color:T.textPrimary}}>{PLANS.find(p=>p.id===activePlan.plan)?.name}</strong> plan. Discount auto-applies at checkout.</div></div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:22,marginBottom:36}}>
        {PLANS.map(plan=>{
          const isActive=activePlan?.plan===plan.id;
          return(
            <div key={plan.id} style={{background:T.bgCard,border:`2px solid ${isActive?plan.color:T.border}`,borderRadius:T.radiusXl,padding:26,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:`radial-gradient(circle,${plan.color}12,transparent)`,pointerEvents:"none"}}/>
              <div style={{position:"absolute",top:14,right:14}}><Badge color={plan.color}>{plan.badge}</Badge></div>
              <div style={{fontSize:38,marginBottom:14}}>{plan.id==="weekly"?"🗓️":"📅"}</div>
              <h3 style={{fontFamily:T.fontDisplay,fontSize:22,color:T.textPrimary,margin:"0 0 5px",fontWeight:400}}>{plan.name}</h3>
              <p style={{color:T.textMuted,fontSize:13,margin:"0 0 16px"}}>{plan.sessions} session{plan.sessions>1?"s":""} / {plan.freq} · Cancel anytime</p>
              <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:18}}>
                <span style={{fontFamily:T.fontDisplay,fontSize:44,fontWeight:400,color:plan.color,lineHeight:1}}>{plan.discount}%</span>
                <span style={{color:T.textMuted,fontSize:14}}>off every session</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:22}}>
                {plan.perks.map(perk=>(
                  <div key={perk} style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:17,height:17,borderRadius:"50%",background:`${plan.color}1a`,border:`1px solid ${plan.color}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:plan.color,fontSize:10,fontWeight:900}}>✓</span></div>
                    <span style={{color:T.textSecondary,fontSize:13}}>{perk}</span>
                  </div>
                ))}
              </div>
              {isActive?<Btn variant="danger" fullWidth onClick={()=>cancel(plan.id)}>Cancel Plan</Btn>:<Btn fullWidth onClick={()=>subscribe(plan.id)} style={{background:plan.gradient,color:"#0d1a13"}}>Subscribe — {plan.discount}% Off</Btn>}
            </div>
          );
        })}
      </div>
      <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:T.radiusLg,overflow:"hidden"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.border}`}}><h3 style={{fontFamily:T.fontDisplay,color:T.textPrimary,fontSize:17,margin:0,fontWeight:400}}>Plan Comparison</h3></div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:T.bgSurface}}>
              <th style={{textAlign:"left",padding:"11px 20px",color:T.textMuted,fontSize:11,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",fontFamily:T.fontBody}}>Feature</th>
              {PLANS.map(p=><th key={p.id} style={{textAlign:"center",padding:"11px 20px",color:p.color,fontSize:13,fontWeight:700,fontFamily:T.fontBody}}>{p.name}</th>)}
            </tr></thead>
            <tbody>
              {[["Sessions/cycle","1/week","4/month"],["Discount","15%","25%"],["Priority booking","✓","✓"],["Free cancellation","✓","✓"],["Wellness advisor","✓","✓"],["Monthly assessment","—","✓"],["VIP therapist access","—","✓"],["Birthday bonus","—","✓"]].map(([feat,...vals],i)=>(
                <tr key={feat} style={{borderTop:`1px solid ${T.border}`,background:i%2===0?"transparent":`${T.bgSurface}80`}}>
                  <td style={{padding:"10px 20px",color:T.textSecondary,fontSize:13,fontFamily:T.fontBody}}>{feat}</td>
                  {vals.map((v,j)=><td key={j} style={{padding:"10px 20px",textAlign:"center",color:v==="✓"?T.primaryLight:v==="—"?T.textMuted:T.textPrimary,fontSize:13,fontWeight:v==="✓"||v==="—"?700:400}}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ROOT APP
function AppRoot(){
  const[tab,setTab]=useState("book");
  const{notifications}=useApp();
  return(
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:T.fontBody}}>
      <style>{CSS}</style>
      <Header tab={tab} setTab={setTab}/>
      <main>
        {tab==="book"&&(<><Hero onBook={()=>{}}/><BookingWizard onComplete={t=>setTab(t||"bookings")}/></>)}
        {tab==="therapists"&&<TherapistsPage/>}
        {tab==="bookings"&&<BookingsPage onBookNew={()=>setTab("book")}/>}
        {tab==="favorites"&&<FavoritesPage onNav={setTab}/>}
        {tab==="plans"&&<PlansPage/>}
      </main>
      <Toasts notifications={notifications}/>
      <footer style={{borderTop:`1px solid ${T.border}`,padding:"28px 24px",background:T.bgCard,marginTop:40}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${T.primary},${T.primaryDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🏥</div>
            <div>
              <div style={{fontFamily:T.fontDisplay,fontSize:15,color:T.primaryLight}}>BodyFix Hub</div>
              <div style={{fontSize:10,color:T.textMuted,letterSpacing:"0.15em",textTransform:"uppercase"}}>Your Wellness. Your Doorstep.</div>
            </div>
          </div>
          <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
            {["Privacy Policy","Terms of Service","Support","admin@bodyfix.ng"].map(l=><a key={l} href="#" style={{color:T.textMuted,fontSize:12,textDecoration:"none",fontFamily:T.fontBody}}>{l}</a>)}
          </div>
          <div style={{color:T.textMuted,fontSize:12}}>© 2025 BodyFix Hub. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

export default function App(){
  return <AppProvider><AppRoot/></AppProvider>;
}
