/**
 * POKENEXUS GLOBAL ENGINE v2.5
 * Handles Multi-Region Data Fetching for Cards & Sealed Products
 */
const Nexus = {
    API_BASE: "https://api.tcgdex.net/v2",

    async globalScan(query) {
        console.log(`📡 Nexus System: Scanning for "${query}"...`);
        
        try {
            // Fetch everything at once (Parallel Requests)
            const [enCards, jpCards, enSets, jpSets] = await Promise.all([
                fetch(`${this.API_BASE}/en/cards?name=${query}`).then(res => res.json()),
                fetch(`${this.API_BASE}/jp/cards?name=${query}`).then(res => res.json()),
                fetch(`${this.API_BASE}/en/sets`).then(res => res.json()),
                fetch(`${this.API_BASE}/jp/sets`).then(res => res.json())
            ]);

            // Filter sets to find Sealed Products (Booster Boxes/Elite Trainer Boxes)
            const sealedEn = enSets.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
            const sealedJp = jpSets.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

            return {
                cards: [
                    ...enCards.slice(0, 15).map(c => ({ ...c, region: 'ENG', type: 'CARD' })),
                    ...jpCards.slice(0, 15).map(c => ({ ...c, region: 'JPN', type: 'CARD' }))
                ],
                sealed: [
                    ...sealedEn.map(s => ({ ...s, region: 'ENG', type: 'SEALED' })),
                    ...sealedJp.map(s => ({ ...s, region: 'JPN', type: 'SEALED' }))
                ]
            };
        } catch (error) {
            console.error("Nexus Network Error:", error);
            return null;
        }
    }
};
