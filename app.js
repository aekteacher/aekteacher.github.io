let cards = [
{
category:"Geografi",
question:"Vad är Sveriges huvudstad?",
answer:"Stockholm"
},
{
category:"Matematik",
question:"Vad är 8 × 7?",
answer:"56"
},
{
category:"Historia",
question:"När började andra världskriget?",
answer:"1939"
},
{
category:"Engelska",
question:"Vad betyder apple?",
answer:"Äpple"
}
];

let filteredCards = [...cards];
let current = 0;
let showingAnswer = false;

let stats = JSON.parse(
localStorage.getItem("flashStats")
) || {
correct:0,
wrong:0
};

function populateCategories(){

const select =
document.getElementById("categorySelect");

select.innerHTML =
'<option value="all">Alla kategorier</option>';

const categories =
[...new Set(cards.map(c=>c.category))];

categories.forEach(cat=>{

const option =
document.createElement("option");

option.value = cat;
option.textContent = cat;

select.appendChild(option);

});

}

function updateCard(){

if(filteredCards.length===0){
return;
}

const card = filteredCards[current];

document.getElementById("front")
.textContent = card.question;

document.getElementById("back")
.textContent = card.answer;

showingAnswer = false;

document.getElementById("front")
.classList.remove("hidden");

document.getElementById("back")
.classList.add("hidden");

document.getElementById("total")
.textContent = filteredCards.length;

}

function flipCard(){

showingAnswer=!showingAnswer;

document.getElementById("front")
.classList.toggle("hidden");

document.getElementById("back")
.classList.toggle("hidden");

}

function nextCard(){

current++;

if(current>=filteredCards.length){
current=0;
}

updateCard();

}

function previousCard(){

current--;

if(current<0){
current=filteredCards.length-1;
}

updateCard();

}

function shuffleCards(){

filteredCards.sort(
()=>Math.random()-0.5
);

current=0;

updateCard();
}

function markAnswer(correct){

if(correct){
stats.correct++;
}
else{
stats.wrong++;
}

localStorage.setItem(
"flashStats",
JSON.stringify(stats)
);

updateStats();

nextCard();

}

function updateStats(){

document.getElementById("correct")
.textContent = stats.correct;

document.getElementById("wrong")
.textContent = stats.wrong;

}

document
.getElementById("categorySelect")
.addEventListener("change", e=>{

if(e.target.value==="all"){
filteredCards=[...cards];
}
else{
filteredCards=
cards.filter(
c=>c.category===e.target.value
);
}

current=0;

updateCard();

});

document
.getElementById("csvInput")
.addEventListener("change", importCSV);

function importCSV(event){

const file =
event.target.files[0];

const reader =
new FileReader();

reader.onload = function(e){

const rows =
e.target.result
.split("\n")
.slice(1);

rows.forEach(row=>{

const cols =
row.split(",");

if(cols.length >= 3){

cards.push({
category:cols[0].trim(),
question:cols[1].trim(),
answer:cols[2].trim()
});

}

});

populateCategories();

filteredCards=[...cards];

updateCard();

};

reader.readAsText(file);
}

populateCategories();
updateStats();
updateCard();