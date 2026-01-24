// lib/getTradingData.ts
export async function getReliabilityData(coinId: string = "bitcoin") {
    try {
        const res = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        );
        const data = await res.json();

        // Map the prices into hourly buckets and calculate stability
        const formattedData = data.prices.map(([timestamp, price]: [number, number], i: number) => {
            const hour = new Date(timestamp).getHours();

            // Calculate 'Reliability' based on price stability vs previous hour
            if (i === 0) return { hour, confidence: 65 };
            const prevPrice = data.prices[i - 1][1];
            const volatility = Math.abs((price - prevPrice) / prevPrice) * 100;

            // Higher stability = Higher confidence (Scale of 0-100)
            const confidence = Math.max(20, Math.min(98, Math.round(100 - (volatility * 150))));

            return { hour, confidence };
        }).slice(-24); // Ensure we only show the last 24 data points

        return formattedData;
    } catch (error) {
        console.error("CoinGecko Fetch Error:", error);
        return [];
    }
}