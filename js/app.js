import {todayKey,dateOf,addDays,monday,weekNumber,available,canJoin,isPast,weatherEligible} from './data.js';
import {tourRepository} from './repository.js';
const $=s=>document.querySelector(s);
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const format=(key,options)=>new Intl.DateTimeFormat('nb-NO',{timeZone:'UTC',...options}).format(dateOf(key));
const fullDate=key=>format(key,{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const shortDate=key=>format(key,{day:'numeric',month:'short'});
let tours=tourRepository.list();
let week=monday(todayKey());
const current=$(`nav [data-page="${document.body.dataset.page}"]`);if(current)current.setAttribute('aria-current','page');
const badge=t=>`<span class="badge ${available(t)?'':'full'}">${available(t)?`${available(t)} av ${t.capacity} ledige`:'Fullbooket'}</span>`;
const dialog=$('#trip-dialog');
$('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
function openTour(id){
 const t=tours.find(t=>t.id===id);if(!t)return;
 const detail=(label,value)=>`<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`;
 $('#dialog-content').innerHTML=`<p class="eyebrow">UT PÅ TUR</p>${badge(t)}<h2 id="dialog-title">${escape(t.title)}</h2><p>${escape(fullDate(t.date))} · kl. ${escape(t.time)}</p><dl class="detail-list">${detail('Ledige plasser',`${available(t)} av ${t.capacity}`)}${detail('Turleder',t.leader)}${detail('Oppmøtested',t.start)}${detail('Rute',t.route)}${detail('Varighet',`${t.duration} minutter`)}${detail('Tempo',t.pace)}</dl><p class="detail-info"><strong>${t.accessible?'Tilrettelagt for rullestolbrukere':'Ikke tilrettelagt for rullestolbrukere'}</strong></p><p class="detail-info">${escape(t.info||'Ingen ekstra informasjon.')}</p>${weatherEligible(t.date)?`<div class="weather">${t.weather?`☀ ${escape(t.weather.temperature)} °C · ${escape(t.weather.summary)}<small>Demonstrasjonsvær – ikke en faktisk værmelding.</small>`:'Værmelding er ikke tilgjengelig for denne demoturen.'}</div>`:''}<p class="dialog-note">Tidspunkt, rute og værforhold kan endre seg. Se over turinformasjonen før avreise.</p>${canJoin(t)?'<button class="button" id="join-demo" type="button">Meld deg på (demo) <span>→</span></button>':`<p class="registration-status">${isPast(t)?'Turen har startet eller er avsluttet.':'Turen er fullbooket. Ingen ledige plasser.'}</p>`}<p class="dialog-note">Ingen reell påmelding. ID-porten er en planlagt funksjon. Kun antall plasser vises, aldri hvem som deltar.</p><div id="registration-status" role="status"></div>`;
 $('#join-demo')?.addEventListener('click',()=>{$('#registration-status').className='registration-status';$('#registration-status').textContent='Dette er en demonstrasjon. Du er ikke påmeldt, og ingen plass er reservert. Innlogging med ID-porten og påmelding kommer i en senere versjon.';});
 dialog.showModal();
}
document.addEventListener('click',e=>{const button=e.target.closest('[data-tour]');if(button)openTour(button.dataset.tour);});
if($('#upcoming')){
 $('#upcoming').innerHTML=tours.filter(t=>!isPast(t)).slice(0,3).map(t=>`<article class="trip-card"><div class="card-top"><div class="date-block">${escape(format(t.date,{month:'short'}))}<strong>${dateOf(t.date).getUTCDate()}</strong></div>${badge(t)}</div><div class="card-body"><h3>${escape(t.title)}</h3><p>${escape(format(t.date,{weekday:'long'}))} kl. ${t.time} · ${t.duration} min<br>${escape(t.pace)} tempo${t.accessible?' · Tilrettelagt':''}</p><button data-tour="${escape(t.id)}">Les mer om turen <span aria-hidden="true">↗</span></button></div></article>`).join('');
}
function renderCalendar(){
 $('#calendar-range').textContent=`${shortDate(week)} – ${format(addDays(week,13),{day:'numeric',month:'long',year:'numeric'})}`;
 $('#calendar').innerHTML=[0,1].map(w=>{const start=addDays(week,w*7);return `<section class="week" aria-label="Uke ${weekNumber(start)}"><h3>Uke ${weekNumber(start)}${start===monday(todayKey())?' · Denne uka':start===addDays(monday(todayKey()),7)?' · Neste uke':''}</h3><div class="week-grid">${Array.from({length:7},(_,d)=>{const key=addDays(start,d);const items=tours.filter(t=>t.date===key);return `<div class="day ${key===todayKey()?'is-today':''}"><div class="day-head"><span>${escape(format(key,{weekday:'short'}))}</span><strong ${key===todayKey()?'aria-label="I dag"':''}>${dateOf(key).getUTCDate()}</strong></div>${items.length?items.map(t=>`<button class="event ${available(t)?'':'full'}" data-tour="${escape(t.id)}" aria-label="${escape(t.title)}, ${escape(fullDate(t.date))}, klokken ${t.time}, ${available(t)} av ${t.capacity} ledige"><time datetime="${t.date}T${t.time}">${t.time}</time><strong>${escape(t.title)}</strong><span>${isPast(t)?'Avsluttet':available(t)?`${available(t)} ledige`:'Fullbooket'}</span></button>`).join(''):'<span class="empty">Ingen turer</span>'}</div>`;}).join('')}</div></section>`;}).join('');
}
if($('#calendar')){
 const requested=new URLSearchParams(location.search).get('dato');
 if(requested && /^\d{4}-\d{2}-\d{2}$/.test(requested) && !Number.isNaN(dateOf(requested).getTime())) week=monday(requested);
 renderCalendar();$('#prev').onclick=()=>{week=addDays(week,-7);renderCalendar();};$('#next').onclick=()=>{week=addDays(week,7);renderCalendar();};$('#today').onclick=()=>{week=monday(todayKey());renderCalendar();};
}
const form=$('#new-trip');
if(form){
 form.elements.date.min=todayKey();
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const fields=new FormData(form);const draft=Object.fromEntries(fields);
 for(const field of ['title','leader','start','route']){draft[field]=draft[field].trim();if(!draft[field]){form.elements[field].setCustomValidity('Fyll inn dette feltet.');form.elements[field].reportValidity();return;}}
 draft.duration=Number(draft.duration);draft.capacity=Number(draft.capacity);draft.accessible=fields.has('accessible');draft.info=draft.info.trim();
 if(isPast(draft)){form.elements.time.setCustomValidity('Velg et tidspunkt i fremtiden.');form.elements.time.reportValidity();return;}
 const {tour,persisted}=tourRepository.create(draft);tours=tourRepository.list();
 $('#form-status').innerHTML=persisted?`Demoturen er lagret i denne fanen. <a href="turer.html?dato=${tour.date}">Se turen i kalenderen →</a>`:'Nettleseren tillater ikke lagring. Turen er kun tilgjengelig på denne siden til den lastes inn på nytt.';
 form.reset();
 });
 form.addEventListener('input',()=>{for(const el of form.elements)if(el.setCustomValidity)el.setCustomValidity('');});
 form.addEventListener('reset',()=>{for(const el of form.elements)if(el.setCustomValidity)el.setCustomValidity('');});
}
