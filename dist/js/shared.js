import {copy} from './content.js';
import {mountMascots} from './mascot.js';
import {renderHeader} from './header.js';
export const $=id=>document.getElementById(id);
export const t=key=>copy[key];
export function progress(){try{const value=JSON.parse(localStorage.getItem('acustik-progress')||'[]');return Array.isArray(value)?[...new Set(value.filter(x=>['quiz','game','rover'].includes(x)))]:[]}catch{return []}}
export function updateProgress(){if($('progress'))$('progress').textContent=`${t('progress')}: ${progress().length} ${t('of')} 3`}
export function complete(id){try{localStorage.setItem('acustik-progress',JSON.stringify([...new Set([...progress(),id])]))}catch{}updateProgress()}
export function shell(page){
 mountMascots();
 document.documentElement.lang='en';
 renderHeader(page);
 document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));
 const title={home:'Home',solar:'Solar system',stories:'Robot stories',missions:'Missions',login:'Sign in',register:'Register',account:'Account'}[page];
 if(title)document.title=title+' — Acustik Space';
 const access=$('header-access');
 import('./auth.js').then(async({currentUser})=>{try{const user=await currentUser();if(user){access.href='account.html';access.textContent='My account'}}catch{}});
 updateProgress();
}
