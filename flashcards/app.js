let cards=[],filtered=[],queue=[],current=0,failedMode=false,favMode=false;
let stats=JSON.parse(localStorage.getItem("flashStats")||'{"correct":0,"wrong":0}');
let favorites=JSON.parse(localStorage.getItem("favorites")||'[]');
let failed=JSON.parse(localStorage.getItem("failed")||'[]');
function save(){
  localStorage.setItem("flashStats",JSON.stringify(stats));
  localStorage.setItem("favorites",JSON.stringify(favorites));
  localStorage.setItem("failed",JSON.stringify(failed));
}
async function loadSubjects(){
  const s=await (await fetch('csv/index.json')).json();
  subjectSelect.innerHTML='';
  s.forEach(x=>{let o=document.createElement('option')
    ;o.value=x.id;o.textContent=x.namn;subjectSelect.appendChild(o);});
  if(s.length)loadSubject(s[0].id);
}
async function loadSubject(id){
  const t=await (await fetch(`csv/${id}.csv`)).text();
  cards=t.split(/?/).slice(1).filter(x=>x.trim()).map(r=>{let c=r.split(',');
                                                      return{
                                                        id:c[0],question:c[1],answer:c[2],image:c[3]||'',tags:c[4]||''
                                                      }
                                                      });
  applyFilters();}
function applyFilters(){
  filtered=[...cards];
  if(failedMode)filtered=filtered.filter(c=>failed.includes(c.id));
  if(favMode)filtered=filtered.filter(c=>favorites.includes(c.id));
  queue=[...filtered].sort(()=>Math.random()-0.5);current=0;show();
}
function show(){
  if(!queue.length)
  return;let c=queue[current]
    ;questionText.innerHTML=marked.parse(c.question);
  back.innerHTML=marked.parse(c.answer);
  cardImage.classList.toggle('hidden',!c.image);
  if(c.image)cardImage.src='images/'+c.image;front.classList.remove('hidden');
  back.classList.add('hidden');
  progressBar.style.width=((current+1)/queue.length*100)+'%';
  if(window.MathJax)MathJax.typesetPromise();
}
function flipCard(){
  front.classList.toggle('hidden');
  back.classList.toggle('hidden');
}
function next(){
  current=(current+1)%queue.length;show();
}
function markAnswer(ok){
  let c=queue[current];
  if(ok)stats.correct++;
  else{
    stats.wrong++;
    if(!failed.includes(c.id))failed.push(c.id);
  }
  save();correct.textContent=stats.correct;
  wrong.textContent=stats.wrong;next();
}
function toggleFavoriteCurrent(){
  let id=queue[current].id;favorites=favorites.includes(id)?favorites.filter(x=>x!==id):favorites.concat(id);
  save();
}
function toggleFailedMode(){
  failedMode=!failedMode;
  favMode=false;applyFilters();
}
function toggleFavoritesMode(){
  favMode=!favMode;
  failedMode=false;applyFilters();
}
function exportProgress(){
  const data={stats,favorites,failed};
  const b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(b);
  a.download='flashcards-framsteg.json';a.click();}importProgress.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=x=>{const d=JSON.parse(x.target.result);localStorage.setItem('flashStats',JSON.stringify(d.stats||{}));localStorage.setItem('favorites',JSON.stringify(d.favorites||[]));localStorage.setItem('failed',JSON.stringify(d.failed||[]));location.reload();};r.readAsText(f);};subjectSelect.onchange=e=>loadSubject(e.target.value);searchBox.oninput=e=>{const q=e.target.value.toLowerCase();filtered=cards.filter(c=>(c.question+c.answer+c.tags).toLowerCase().includes(q));queue=[...filtered];current=0;show();};darkBtn.onclick=()=>document.body.classList.toggle('dark');correct.textContent=stats.correct;wrong.textContent=stats.wrong;loadSubjects();
