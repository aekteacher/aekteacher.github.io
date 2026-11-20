import { load, save }
from "./storage.js";

import {
    loadSubjects,
    loadCards
}
from "./cards.js";

import {
    searchCards
}
from "./filters.js";

import { render }
from "./ui.js";

import { exportData }
from "./importExport.js";

let allCards = [];
let cards = [];

let studyQueue = [];

let current = 0;
let studiedCount = 0;

const activeFilter =
    document.getElementById("activeFilter");

const searchBox =
    document.getElementById("searchBox");

const subjectSelect =
    document.getElementById("subjectSelect");

const emptyMessage =
    document.getElementById("emptyMessage");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const front =
    document.getElementById("front");

const back =
    document.getElementById("back");

const correctElement =
    document.getElementById("correct");

const wrongElement =
    document.getElementById("wrong");

const darkBtn =
    document.getElementById("darkBtn");

const exportBtn =
    document.getElementById("exportBtn");

const importProgress =
    document.getElementById("importProgress");

const randomMode =
    document.getElementById("randomMode");

let stats =
    load(
        "flashStats",
        {
            correct: 0,
            wrong: 0
        }
    );

let favorites =
    load(
        "favorites",
        []
    );

let failed =
    load(
        "failed",
        []
    );

function getTagFilter() {

    const params =
        new URLSearchParams(
            location.search
        );

    return params.get("tag");
}

async function init() {

    const subjects =
        await loadSubjects();

    subjects.forEach(subject => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            subject.id;

        option.textContent =
            subject.namn;

        subjectSelect.appendChild(
            option
        );

    });

    if (subjects.length > 0) {

        await loadSubject(
            subjects[0].id
        );

    }
}

async function loadSubject(id) {

    try {

        allCards =
            await loadCards(id);

        applyFilters();

    }
    catch (error) {

        console.error(error);

        emptyMessage.textContent =
            error.message;

        emptyMessage.classList.remove(
            "hidden"
        );

    }
}

function createStudyQueue() {

    if (
        randomMode &&
        randomMode.checked
    ) {

        studyQueue =
            [...cards];

        for (
            let i =
                studyQueue.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );

            [
                studyQueue[i],
                studyQueue[j]
            ] =
            [
                studyQueue[j],
                studyQueue[i]
            ];
        }

    }
    else {

        studyQueue =
            [...cards];
    }

    current = 0;
    studiedCount = 0;

    if (progressBar) {

        progressBar.style.width =
            "0%";

    }
}

function applyFilters() {

    cards = [...allCards];

    const tag =
        getTagFilter();

    if (tag) {

        cards =
            cards.filter(card => {

                const tags =
                    (card.tags || "")
                    .split(",")
                    .map(t => t.trim());

                return tags.includes(tag);

            });

        activeFilter.textContent =
            "Aktivt filter: " +
            tag;

    }
    else {

        activeFilter.textContent =
            "";

    }

    cards =
        searchCards(
            cards,
            searchBox.value || ""
        );

    createStudyQueue();

    show();
}

function nextCard() {

    if (
        studyQueue.length === 0
    ) {
        return;
    }

    studiedCount++;

    current++;

    if (
        current >=
        studyQueue.length
    ) {

        createStudyQueue();

    }

    show();
}

function show() {

    front.classList.remove(
        "hidden"
    );

    back.classList.add(
        "hidden"
    );

    if (
        !studyQueue ||
        studyQueue.length === 0
    ) {

        emptyMessage.classList.remove(
            "hidden"
        );

        if (progressBar) {

            progressBar.style.width =
                "0%";

        }

        return;
    }

    emptyMessage.classList.add(
        "hidden"
    );

    render(
        studyQueue[current]
    );

    progressBar.style.width =
        (
            Math.min(
                studiedCount,
                studyQueue.length
            )
            /
            studyQueue.length
            * 100
        ) + "%";

    if (progressText) {

        progressText.textContent =
            `${Math.min(
                studiedCount,
                studyQueue.length
            )} / ${studyQueue.length}`;
    }

    correctElement.textContent =
        stats.correct;

    wrongElement.textContent =
        stats.wrong;
}

document
.getElementById("flipBtn")
.onclick = () => {

    front.classList.toggle(
        "hidden"
    );

    back.classList.toggle(
        "hidden"
    );

};

document
.getElementById("correctBtn")
.onclick = () => {

    stats.correct++;

    save(
        "flashStats",
        stats
    );

    nextCard();

};

document
.getElementById("wrongBtn")
.onclick = () => {

    stats.wrong++;

    const id =
        studyQueue[current].id;

    if (
        !failed.includes(id)
    ) {

        failed.push(id);

    }

    save(
        "failed",
        failed
    );

    save(
        "flashStats",
        stats
    );

    nextCard();

};

document
.getElementById("favCurrentBtn")
.onclick = () => {

    const id =
        studyQueue[current].id;

    if (
        favorites.includes(id)
    ) {

        favorites =
            favorites.filter(
                x => x !== id
            );

    }
    else {

        favorites.push(id);

    }

    save(
        "favorites",
        favorites
    );

};

document
.getElementById("favoritesBtn")
.onclick = () => {

    cards =
        allCards.filter(
            card =>
            favorites.includes(
                card.id
            )
        );

    createStudyQueue();

    show();

};

document
.getElementById("failedBtn")
.onclick = () => {

    cards =
        allCards.filter(
            card =>
            failed.includes(
                card.id
            )
        );

    createStudyQueue();

    show();

};

searchBox.oninput =
    applyFilters;

subjectSelect.onchange =
    event =>
    loadSubject(
        event.target.value
    );

darkBtn.onclick =
    () =>
    document.body.classList.toggle(
        "dark"
    );

exportBtn.onclick =
    () =>
    exportData({
        stats,
        favorites,
        failed
    });

importProgress.onchange =
    event => {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        const reader =
            new FileReader();

        reader.onload =
            loadEvent => {

                const data =
                    JSON.parse(
                        loadEvent.target.result
                    );

                save(
                    "flashStats",
                    data.stats || {}
                );

                save(
                    "favorites",
                    data.favorites || []
                );

                save(
                    "failed",
                    data.failed || []
                );

                location.reload();
            };

        reader.readAsText(
            file
        );

    };

if (randomMode) {

    randomMode.onchange =
        () => {

            createStudyQueue();

            show();

        };

}

init();
