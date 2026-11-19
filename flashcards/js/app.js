import {load,save} from './storage.js';
import {loadSubjects,loadCards} from './cards.js';
import {tagFilter,searchCards} from './filters.js';
import {render} from './ui.js';
import {exportData} from './importExport.js';
let allCards=[],cards=[],current=0;let stats=load('flashStats',{correct:0,wrong:0});let favorites=load('favorites',[]);let failed=load('failed',[]);
function urlTags(){const p=new URLSearchParams(location.search);const t=p.get('tag');return t?t.split(',').map(x=>x.trim()):[];}
async function init(){const subs=await loadSubjects();subs.forEach(s=>{let o=document.createElement('option');o.value=s.id;o.textContent=s.namn;subjectSelect.appendChild(o);});await loadSubject(subs[0].id);}
async function loadSubject(id){allCards=await loadCards(id);applyFilters();}
function applyFilters(){cards=[...allCards];cards=tagFilter(cards,urlTags());cards=searchCards(cards,searchBox.value||'');activeFilter.textContent=urlTags().length?'Aktiva URL-taggar: '+urlTags().join(', '):'';current=0;show();}
function show(){if(!cards.length){emptyMessage.classList.remove('hidden');return;}emptyMessage.classList.add('hidden');render(cards[current]);progressBar.style.width=((current+1)/cards.length*100)+'%';correct.textContent=stats.correct;wrong.textContent=stats.wrong;}
flipBtn.onclick=()=>{front.classList.toggle('hidden');back.classList.toggle('hidden');};
correctBtn.onclick=()=>{stats.correct++;save('flashStats',stats);current=(current+1)%cards.length;show();};
wrongBtn.onclick=()=>{stats.wrong++;if(!failed.includes(cards[current].id))failed.push(cards[current].id);save('failed',failed);save('flashStats',stats);current=(current+1)%cards.length;show();};
favCurrentBtn.onclick=()=>{const id=cards[current].id;favorites.includes(id)?favorites=favorites.filter(x=>x!==id):favorites.push(id);save('favorites',favorites);};
favoritesBtn.onclick=()=>{cards=allCards.filter(c=>favorites.includes(c.id));current=0;show();};
failedBtn.onclick=()=>{cards=allCards.filter(c=>failed.includes(c.id));current=0;show();};
searchBox.oninput=applyFilters;subjectSelect.onchange=e=>loadSubject(e.target.value);darkBtn.onclick=()=>document.body.classList.toggle('dark');exportBtn.onclick=()=>exportData({stats,favorites,failed});importProgress.onchange=e=>{const r=new FileReader();r.onload=x=>{const d=JSON.parse(x.target.result);save('flashStats',d.stats||{});save('favorites',d.favorites||[]);save('failed',d.failed||[]);location.reload();};r.readAsText(e.target.files[0]);};init();