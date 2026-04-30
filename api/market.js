export default async function handler(req, res) {
  try {
    // BTC + XAUT（CoinGecko）
    const cryptoRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether-gold&vs_currencies=usd&include_24hr_change=true"
    );
    const crypto = await cryptoRes.json();

    // DXY（Stooq：美元指数期货 DX）
    let dxy = "--";
    try {
      const dxyRes = await fetch(
        "https://stooq.com/q/l/?s=dx.f&f=sd2t2ohlc&h&e=json"
      );
      const dxyJson = await dxyRes.json();
      dxy = dxyJson?.symbols?.[0]?.close ?? "--";
    } catch {
      dxy = "--";
    }

    // US10Y（Stooq：10年美债 TNX）
    let us10y = "--";
    try {
      const us10yRes = await fetch(
        "https://stooq.com/q/l/?s=tnx.f&f=sd2t2ohlc&h&e=json"
      );
      const us10yJson = await us10yRes.json();
      us10y = us10yJson?.symbols?.[0]?.close ?? "--";
    } catch {
      us10y = "--";
    }

    res.status(200).json({
      btc: crypto.bitcoin?.usd ?? "--",
      btc_change: crypto.bitcoin?.usd_24h_change ?? 0,

      gold: crypto["tether-gold"]?.usd ?? "--",
      gold_change: crypto["tether-gold"]?.usd_24h_change ?? 0,

      dxy,
      us10y
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
