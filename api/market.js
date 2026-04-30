export default async function handler(req, res) {
  try {
    // BTC + XAUT
    const cryptoRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether-gold&vs_currencies=usd&include_24hr_change=true"
    );
    const crypto = await cryptoRes.json();

    // DXY（Stooq）
    let dxy = "--";
    try {
      const r = await fetch(
        "https://stooq.com/q/l/?s=dx.f&f=sd2t2ohlc&h&e=json"
      );
      const j = await r.json();
      dxy = j?.symbols?.[0]?.close ?? "--";
    } catch {}

    // US10Y（稳定 CSV 方案）
    let us10y = "--";
    try {
      const r = await fetch(
        "https://api.allorigins.win/raw?url=https://fred.stlouisfed.org/graph/fredgraph.csv?id=DGS10"
      );
      const text = await r.text();

      const lines = text.trim().split("\n");
      const last = lines[lines.length - 1];
      const value = last.split(",")[1];

      us10y = value || "--";
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

  } catch {
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
