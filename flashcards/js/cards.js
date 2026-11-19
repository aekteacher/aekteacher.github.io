/**
 * Läs in alla ämnen
 */
export async function loadSubjects() {

    const response =
        await fetch("csv/index.json");

    return await response.json();
}

/**
 * Läs in ett ämnes CSV-fil
 */
export async function loadCards(subjectId) {

    const response =
        await fetch(
            `csv/${subjectId}.csv`
        );

if (!response.ok) {

    throw new Error(
        `Kunde inte läsa csv/${subjectId}.csv`
    );

}

    const csv =
        await response.text();

    const result =
        Papa.parse(
            csv,
            {
                header: true,
                skipEmptyLines: true,
                transformHeader: header =>
                    header.trim()
            }
        );

    if (result.errors.length > 0) {

        console.error(
            "CSV-fel:",
            result.errors
        );

    }

    return result.data.map(row => ({

        id:
            row.id || "",

        question:
            row.question || "",

        answer:
            row.answer || "",

        questionImage:
            row.questionImage || "",

        answerImage:
            row.answerImage || "",

        tags:
            row.tags || ""

    }));
}


