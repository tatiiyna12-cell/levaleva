import {makeDemoTours} from './data.js';
// Backend seam: replace these methods with authenticated API calls later.
// The current adapter deliberately has no registration or participant API.
const KEY='levaleva.demo.tours.v1';
let memory=[];
function readCustom() {
 try {const data=JSON.parse(sessionStorage.getItem(KEY)||'[]'); return Array.isArray(data)?data.filter(t=>t && typeof t.id==='string' && typeof t.title==='string' && /^\d{4}-\d{2}-\d{2}$/.test(t.date) && /^\d{2}:\d{2}$/.test(t.time) && Number.isInteger(t.capacity) && t.capacity>0 && Number.isInteger(t.booked) && t.booked>=0):[];} catch {return memory;}
}
export const tourRepository={
 list(){return [...makeDemoTours(),...readCustom()].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));},
 create(draft){const tour={...draft,id:`local-${crypto.randomUUID()}`,booked:0,weather:null}; const all=[...readCustom(),tour]; memory=all; let persisted=true;try{sessionStorage.setItem(KEY,JSON.stringify(all));}catch{persisted=false;}return {tour,persisted};}
};
