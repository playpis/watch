export default async function handler(req, res) {
  try {
    // BTC + XAUT（CoinGecko，无 key）
    const cryptoRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether-gold&vs_currencies=usd&include_24hr_change=true"
    );
    const crypto = await cryptoRes.json();

    // DXY（UUP ETF 近似）
    const dxyRes = await fetch(
      "https://query1.finance.yahoo.com/v7/finance/quote?symbols=UUP"
    );
    const dxyJson = await dxyRes.json();

    const dxy =
      dxyJson.quoteResponse?.result?.[0]?.regularMarketPrice ?? "--";

    // US10Y（用公开 FRED 代理源）
    const us10yRes = await fetch(
      "https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&api_key=demo&file_type=json"
    );

    const us10yJson = await us10yRes.json();

    const latest = us10yJson.observations?.slice(-1)[0]?.value ?? "--";

    res.status(200).json({
      btc: crypto.bitcoin?.usd ?? "--",
      btc_change: crypto.bitcoin?.usd_24h_change ?? 0,

      gold: crypto["tether-gold"]?.usd ?? "--",
      gold_change: crypto["tether-gold"]?.usd_24h_change ?? 0,

      dxy,
      us10y: latest
    });

  } catch (e) {
    res.status(500).json({
      btc: "--",
      btc_change: 0,
      gold: "--",
      gold_change: 0,
      dxy: "--",
      us10y: "--"
    });
  }
}
