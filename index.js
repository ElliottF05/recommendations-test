// Semantic Scholar Recommendations API page: 
// https://api.semanticscholar.org/api-docs/recommendations#tag/Paper-Recommendations

// Base URL for recommendations API
const BASE_URL = 'https://api.semanticscholar.org/recommendations/v1';

/**
 * Fetch recommendations for a single positive paperId.
 *
 * @param {string} paperId - The paperId to make recommendations for.
 * @param {number} [limit=5] - Max number of recommendations to return (default: 5).
 * @param {string} [fields="title,url"] - Comma-separated list of fields to include for each recommended paper (paperId is always returned regardless of settings).
 * @param {string} [from="all-cs"] - The scope of the recommendations. Default is "all-cs". Other option is "recent"
 * @returns {Object|undefined} Recommendations data as an object (returns undefined if an error occurs).f
 */
async function fetchRecsFromSingleId(paperId, limit=5, fields="title,url", from="all-cs") {

    const params = new URLSearchParams({
        from: from,
        limit: limit,
        fields: fields,
    })

    const requestURL = `${BASE_URL}/papers/forpaper/${paperId}?${params}`;

    try {
        const response = await fetch(requestURL, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error fetching recommendations from single id: ", err.message);
    }
}


/**
 * Fetch recommendations for multiple positive and negative paperId's.
 *
 * @param {string[]} positiveIds - Array of positive paperId's to make recommendations from.
 * @param {string[]} [negativeIds=[]] - Array of negative paperId's to exclude from recommendations (optional).
 * @param {number} [limit=5] - Max number of recommendations to return (default: 5).
 * @param {string} [fields="title,url"] - Comma-separated list of fields to include for each recommended paper (paperId is always returned regardless of settings).
 * @returns {Object|undefined} Recommendations data as an object (returns undefined if an error occurs).
 */
async function fetchRecsFromMultipleIds(positiveIds, negativeIds = [], limit=5, fields="title,url") {

    const params = new URLSearchParams({
        limit: limit,
        fields: fields,
    })

    const requestURL = `${BASE_URL}/papers?${params}`;

    try {
        const response = await fetch(requestURL, {
            method: "POST",
            body: JSON.stringify({
                positivePaperIds: positiveIds,
                negativePaperIds: negativeIds,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (err) {
        console.error("Error fetching recommendations from multiple ids: ", err.message);
    }
}


async function main() {

    // Get recommendations for a single paperId
    const response1 = await fetchRecsFromSingleId("f9c602cc436a9ea2f9e7db48c77d924e09ce3c32", 2);
    console.log("Single paper recommendations:\n", JSON.stringify(response1, null, 2), "\n");

    // Get recommendations for multiple positive paperIds
    const response2 = await fetchRecsFromMultipleIds(["f9c602cc436a9ea2f9e7db48c77d924e09ce3c32"]);
    console.log("Multiple positive paperIds recommendations:\n", JSON.stringify(response2, null, 2), "\n");

    // Get recs for multiple positive and negative paperIds
    const response3 = await fetchRecsFromMultipleIds(
        ["f9c602cc436a9ea2f9e7db48c77d924e09ce3c32"],
        ["271fb7332c613b7e36bf483a9cba2dcc768c96ea"]
    );
    console.log("Multiple positive and negative paperIds recommendations:\n", JSON.stringify(response3, null, 2));
}

main();