// Public tour DTOs only. No participant identities are stored or exposed.
export const ZONE = 'Europe/Oslo';
export function todayKey(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone: ZONE, year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(now);
  const part = type => parts.find(p => p.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export function dateOf(key) { return new Date(`${key}T12:00:00Z`); }
export function addDays(key, days) { const d=dateOf(key); d.setUTCDate(d.getUTCDate()+days); return d.toISOString().slice(0,10); }
export function monday(key) { const day=dateOf(key).getUTCDay(); return addDays(key,-((day+6)%7)); }
export function weekNumber(key) { const d=dateOf(key); d.setUTCDate(d.getUTCDate()+4-(d.getUTCDay()||7)); return Math.ceil((((d-Date.UTC(d.getUTCFullYear(),0,1))/86400000)+1)/7); }
export function osloTime(now=new Date()) { return new Intl.DateTimeFormat('nb-NO',{timeZone:ZONE,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now); }
export function isPast(tour, now=new Date()) { const today=todayKey(now); return tour.date<today || (tour.date===today && tour.time<=osloTime(now)); }
export function weatherEligible(date, today=todayKey()) { return date>=today && date<addDays(today,4); }
export function available(tour) { return Math.max(0,tour.capacity-tour.booked); }
export function canJoin(tour, now=new Date()) { return available(tour)>0 && !isPast(tour,now); }
export function makeDemoTours(today=todayKey()) {
 const base=monday(today);
 const routes=[
  {title:'Langs fjorden',start:'Hovedinngangen ved LevaLeva (demo)',route:'LevaLeva → havneområdet → LevaLeva',duration:60,leader:'Ingrid Berg (demo)',pace:'Rolig',accessible:true,info:'Jevnt underlag. Vi tar en liten pause ved vannet. Ta med drikke og en varm jakke.'},
  {title:'Grønn pause i sentrum',start:'Torget i Levanger (demo)',route:'Torget → parkområdet → Torget',duration:45,leader:'Lars Moen (demo)',pace:'Rolig',accessible:true,info:'En kort tur med god tid til samtaler. Benker og pauser underveis.'},
  {title:'Utsikt fra Staupshaugen',start:'Avtalt møteplass ved Staup (demo)',route:'Staup → utsiktspunktet → Staup',duration:90,leader:'Anne Vik (demo)',pace:'Moderat',accessible:false,info:'Noen bakker og ujevnt underlag. Bruk gode sko. Fruktpause ved utsiktspunktet.'}
 ];
 const tours=[];
 for(let w=-1;w<6;w++) for(const [i,day] of [0,2,3,5].entries()) {
  const route=routes[(i+(w+7))%routes.length];
  tours.push({...route,id:`demo-${w}-${i}`,date:addDays(base,w*7+day),time:i===2?'13:00':'10:00',capacity:15,booked:i===1?15:i===2?12:6,weather:{temperature:6+(i%3),summary:i%2?'Delvis skyet':'Lettskyet',source:'demo'}});
 }
 return tours;
}
