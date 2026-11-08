/* Valor Claro · lógica compartida. Ajusta CONFIG antes de publicar.
   SUB_URL: enlace de pago de la suscripción · FORM_URL: formulario/endpoint de email · PROMO: texto de oferta (vacío = sin banner) */
const CONFIG={SUB_URL:"#",FORM_URL:"/api/subscribe",PRICE:"8,99",PROMO:""};
const $=i=>document.getElementById(i),f=(x,d=2)=>isFinite(x)?x.toLocaleString('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d}):'–',esc=t=>String(t==null?'':t).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
const IDS=['px','rev','mg','g','buy','n','r','M'],EX={px:250,rev:60,mg:25,g:10,buy:1,n:10,r:10,M:20};
const flows=o=>{const a=[];for(let t=1;t<=o.n;t++)a.push(o.rev*Math.pow(1+o.g/100,t)*o.mg/100*Math.pow(1+o.buy/100,t));return a};
const fv=(o,r)=>{const a=flows(o);let s=0;a.forEach((x,i)=>s+=x/Math.pow(1+r/100,i+1));return s+o.M*a[a.length-1]/Math.pow(1+r/100,o.n)};
const irr=(o,P)=>{let lo=-50,hi=100;for(let i=0;i<80;i++){const m=(lo+hi)/2;fv(o,m)>P?lo=m:hi=m}return(lo+hi)/2};
const impG=o=>{let lo=-20,hi=60;for(let i=0;i<60;i++){const m=(lo+hi)/2;fv({...o,g:m},o.r)<o.px?lo=m:hi=m}return(lo+hi)/2};
const bars=fl=>{const m=Math.max(...fl),w=640/fl.length;return`<svg viewBox="0 0 640 165" width="100%" role="img" aria-label="Flujo de caja por acción por año">`+fl.map((x,i)=>{const h=x/m*120;return`<rect x="${i*w+w*.15}" y="${140-h}" width="${w*.7}" height="${h}" rx="3" class="fa"/><text x="${i*w+w/2}" y="158" class="tx" text-anchor="middle">${i+1}</text>`}).join('')+'</svg>'};
const verdict=up=>up>=20?['Infravalorada con margen','up']:up>=-10?['Cerca de su precio justo','am']:['Cara para tus supuestos','dn'];
const gauge=(px,F)=>{const p=Math.min(px/(2*F),1)*100;return`<div class="gz"><i style="left:${p}%"></i><span style="left:${p}%">Precio ${f(px)}</span></div><div class="lg"><span>Infravalorada</span><span>Valor justo ${f(F)}</span><span>Cara</span></div>`};

/* Escenarios automáticos: base ±3 de crecimiento, ±3 de margen, ±4 de múltiplo */
const scen=o=>[-1,0,1].map(d=>{const q={...o,g:o.g+3*d,mg:Math.max(.1,o.mg+3*d),M:Math.max(1,o.M+4*d)};return{F:fv(q,o.r),I:irr(q,o.px)}});
const mp=(S,px,t)=>{const w=S.map(s=>s.F),hi=Math.max(px,...w)*1.1,X=x=>30+x/hi*580,lo=Math.min(...w),up=Math.max(...w);return`<svg viewBox="0 0 640 125" width="100%" role="img" aria-label="Mapa de valoración"><defs><linearGradient id="gm"><stop offset="0" stop-color="#e39aa6"/><stop offset=".5" stop-color="#a78bfa"/><stop offset="1" stop-color="#9fd8b0"/></linearGradient></defs><rect x="30" y="44" width="580" height="12" rx="6" fill="#2d2342"/><rect x="${X(lo)}" y="44" width="${X(up)-X(lo)}" height="12" rx="6" fill="url(#gm)" opacity=".85"/><line x1="${X(t)}" x2="${X(t)}" y1="38" y2="62" stroke="#9fd8b0" stroke-width="2" stroke-dasharray="3 3"/><circle cx="${X(w[1])}" cy="50" r="7" fill="#0e0a16" stroke="#fff" stroke-width="2"/><line x1="${X(px)}" x2="${X(px)}" y1="32" y2="68" stroke="#fff" stroke-width="2.5"/><text x="${X(px)}" y="24" class="tw" text-anchor="middle">Precio ${f(px,0)}</text><text x="${X(lo)}" y="86" class="tx" text-anchor="middle">Bajista ${f(lo,0)}</text><text x="${X(up)}" y="86" class="tx" text-anchor="middle">Alcista ${f(up,0)}</text><text x="${X(w[1])}" y="102" class="tx" text-anchor="middle">Base ${f(w[1],0)}</text><text x="${X(t)}" y="118" class="tx" text-anchor="middle">Compra hasta ${f(t,0)}</text></svg>`};
const alerts=(o,S)=>{const F=S[1].F,en=o.px/(o.rev*o.mg/100),fl=flows(o);let pf=0;fl.forEach((x,i)=>pf+=x/Math.pow(1+o.r/100,i+1));const sh=1-pf/F,a=[];
if(o.M>en*1.1)a.push(`Sales a ${f(o.M,1)}x y entras a ${f(en,1)}x: cuentas con que el mercado pague más dentro de ${o.n} años.`);
if(sh>.75)a.push(`El ${f(sh*100,0)} % del valor depende del múltiplo de salida: es tu hipótesis más frágil.`);
if(S[2].F>3*S[0].F)a.push('Hay mucha distancia entre el escenario bajista y el alcista: poca visibilidad.');
if(o.g>25)a.push('Crecer más de un 25 % anual durante años es excepcional.');
if(o.mg>40)a.push('Un margen de FCF superior al 40 % es muy alto: ¿es sostenible frente a la competencia?');
if(o.r<8)a.push('Exiges menos de un 8 % anual: es poco exigente frente a otras alternativas.');
return a};
const heat=o=>{const gs=[-4,-2,0,2,4],ms=[-6,-3,0,3,6];let h='<table class="hm"><tr><th>Crecimiento ↓ · Salida →</th>'+ms.map(m=>`<th>${f(Math.max(1,o.M+m),0)}x</th>`).join('')+'</tr>';gs.forEach(a=>{h+=`<tr><th>${f(o.g+a,1)} %</th>`+ms.map(m=>{const x=fv({...o,g:o.g+a,M:Math.max(1,o.M+m)},o.r),k=x/o.px;return`<td style="background:${k>=1.2?'rgba(159,216,176,.28)':k>=.9?'rgba(227,198,127,.25)':'rgba(227,154,166,.28)'}">${f(x,0)}</td>`}).join('')+'</tr>'});return h+'</table>'};

/* Prueba PRO de 7 días (en el navegador; ver LEEME) */
const Plan={K:'vc_trial',KL:'vc_lic',key:'',lic:false,D:7*864e5,t:0,load(){try{this.t=+localStorage.getItem(this.K)||0}catch(e){}},start(){this.t=Date.now();try{localStorage.setItem(this.K,String(this.t))}catch(e){}},active(){return this.t>0&&Date.now()-this.t<this.D},expired(){return this.t>0&&!this.active()&&!this.lic},pro(){return this.lic||this.active()},setKey(k){this.key=k;this.lic=true;try{localStorage.setItem(this.KL,k)}catch(e){}},clearKey(){this.key='';this.lic=false;try{localStorage.removeItem(this.KL)}catch(e){}},async check(k){try{const b=new FormData();b.append('key',k);const r=await fetch('/api/license',{method:'POST',body:b});if(!r.ok)return null;return !!(await r.json()).valid}catch(e){return null}},left(){return Math.max(0,Math.ceil((this.D-(Date.now()-this.t))/864e5))}};Plan.load();try{Plan.key=localStorage.getItem(Plan.KL)||'';Plan.lic=!!Plan.key}catch(e){}

/* Puerta de email (modal) */
const Gate={ok:false,KEY:'vc_ok',mode:'free',init(after){try{this.ok=localStorage.getItem(this.KEY)==='1'}catch(e){}
const mo=$('mo');if(!mo)return;this.after=after;
$('mx').onclick=()=>this.close();mo.onclick=e=>{if(e.target===mo)this.close()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mo.hidden)this.close()});
$('gt').onsubmit=async e=>{e.preventDefault();const em=$('gem').value.trim(),m=$('gms');
if(!/^\S+@\S+\.\S+$/.test(em)){m.textContent='Escribe un email válido.';return}
if(!$('gck').checked){m.textContent='Necesitamos tu consentimiento para enviarte emails.';return}
if(CONFIG.FORM_URL){try{const r=await fetch(CONFIG.FORM_URL,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'email='+encodeURIComponent(em)+'&consent=yes&source='+encodeURIComponent(location.pathname+'#'+Gate.mode)});if(!r.ok)throw 0}catch(_){m.textContent='No se pudo registrar. Inténtalo de nuevo.';return}}
Gate.ok=true;try{localStorage.setItem(Gate.KEY,'1')}catch(_){}Gate.close();if(Gate.after)Gate.after(Gate.mode)}},
open(m){this.mode=m||'free';const t=this.mode==='trial';$('mt').textContent=t?'Activa tu prueba PRO de 7 días':'Desbloquea la calculadora gratis';$('gsub').textContent=t?'Introduce tu email y tendrás todo PRO durante 7 días. Sin tarjeta. Al terminar vuelves al plan gratuito y conservas tus empresas.':'Introduce tu email y úsala con tus propios datos. Sin tarjeta.';$('gbt').textContent=t?'Activar prueba':'Entrar gratis';$('mo').hidden=false;setTimeout(()=>$('gem').focus(),30)},close(){$('mo').hidden=true}};
