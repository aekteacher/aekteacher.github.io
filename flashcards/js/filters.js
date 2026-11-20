export function getTagFilter() {

    const params =
        new URLSearchParams(
            location.search
        );

    const tagString =
        params.get("tag");

    if (!tagString) {

        return [];

    }

    return tagString
        .split(",")
        .map(tag => tag.trim());
}

/**
 * OCH-filter:
 * ?tag=1,funktioner,aritmetik
 *
 * Kortet måste innehålla ALLA tre taggarna
 */
export function filterCardsByTags(
    cards,
    selectedTags
) {

    if (
        !selectedTags ||
        selectedTags.length === 0
    ) {

        return cards;

    }

    return cards.filter(card => {

        const cardTags =
            (card.tags || "")
            .split(",")
            .map(tag => tag.trim());

        return selectedTags.every(
            selectedTag =>
                cardTags.includes(
                    selectedTag
                )
        );

    });
}

/**
 * Sökfilter
 */
export function searchCards(
    cards,
    text
) {

    if (!text) {

        return cards;

    }

    return cards.filter(card =>
        JSON.stringify(card)
            .toLowerCase()
            .includes(
                text.toLowerCase()
            )
    );
}
