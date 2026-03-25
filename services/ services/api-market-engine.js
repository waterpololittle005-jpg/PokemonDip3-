console.log("✅ Market Engine is LOADED and ready!");
alert("If you see this, the file is connected!");
/**
 * POKEMARKET GLOBAL - API ENGINE (2026 Edition)
 * Handles: English Cards, Japanese Cards, and Sealed Products
 */

const API_CONFIG = {
    TCGDEX: "https://api.tcgdex.net/v2",
    POKEMON_TCG: "https://api.pokemontcg.io/v2" // Backup for High-Res ENG images
};

/**
 * The Master Search: Pulls from English and Japanese databases simultaneously
 */
async function searchGlobalMarket(query) {
    console.log(`🔍 Scanning international markets for: ${query}...`);

    try {
        // We fetch both languages in parallel for maximum speed
        const [enResponse, jpResponse] = await Promise.all([
            fetch(`${API_CONFIG.TCGDEX}/en/cards?name=${query}`),
            fetch(`${API_CONFIG.TCGDEX}/jp/cards?name=${query}`)
        ]);

        const enCards = await enResponse.json();
        const jpCards = await jpResponse.json();

        // We also want to find SETS (this is where we find Boxes/Packs)
        const setResponse = await fetch(`${API_CONFIG.TCGDEX}/en/sets`);
        const allSets = await setResponse.json();
        const matchedSets = allSets.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

        return {
            cards: {
                english: enCards.slice(0, 20), // Top 20 results
                japanese: jpCards.slice(0, 20)
            },
            sealed: matchedSets.map(set => ({
                name: `${set.name} Booster Box`,
                id: set.id,
                logo: `${set.logo}.png`,
                type: 'Sealed Product'
            })),
            timestamp: new Date().toLocaleString()
        };
    } catch (error) {
        console.error("❌ Market Engine Error:", error);
        return null;
    }
}

/**
 * Formats currency based on region (USD for EN, JPY for JP)
 */
function formatPrice(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}
