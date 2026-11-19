export function render(card) {

    const questionText =
        document.getElementById(
            "questionText"
        );

    const answerText =
        document.getElementById(
            "answerText"
        );

    const questionImage =
        document.getElementById(
            "questionImage"
        );

    const answerImage =
        document.getElementById(
            "answerImage"
        );

    questionText.innerHTML =
        marked.parse(
            card.question || ""
        );

    answerText.innerHTML =
        marked.parse(
            card.answer || ""
        );

    if (card.questionImage) {

        questionImage.src =
            "images/" +
            card.questionImage;

        questionImage.classList.remove(
            "hidden"
        );

    } else {

        questionImage.classList.add(
            "hidden"
        );

        questionImage.removeAttribute(
            "src"
        );
    }

    if (card.answerImage) {

        answerImage.src =
            "images/" +
            card.answerImage;

        answerImage.classList.remove(
            "hidden"
        );

    } else {

        answerImage.classList.add(
            "hidden"
        );

        answerImage.removeAttribute(
            "src"
        );
    }

    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}