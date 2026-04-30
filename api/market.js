export default async function handler(req, res) {

  // 默认值（防止全挂）
  let btc = "--", btc_change = 0;
  let gold = "--", gold_change = 0;
  let dxy = "--";
  let us10y = "--";

  // 1️⃣ BTC + XAUT（必须成功率最高）
  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether-gold&vs_currencies=usd&include_24hr_change=true"
    );
    const j = await r.json();

    btc = j?.bitcoin?.usd ?? "--";
    btc_change = j?.bitcoin?.usd_24h_change ?? 0;

    gold = j?.["tether-gold"]?.usd ?? "--";
    gold_change = j?.["tether-gold"]?.usd_24h_change ?? 0;
  } catch {}

  // 2️⃣ DXY（单独隔离）
  try {
    const r = await fetch(
      "https://stooq.com/q/l/?s=dx.f&f=sd2t2ohlc&h&e=json"
    );
    const j = await r.json();
    dxy = j?.symbols?.[0]?.close ?? "--";
  } catch {}

  // 3️⃣ US10Y（彻底兜底 + 防挂）
  try {
    const r = await fetch(
      "https://stooq.com/q/l/?s=tnx.f&f=sd2t2ohlc&h&e=json"
    );
    const j = await r.json();
    us10y = j?.symbols?.[0]?.close ?? "--";
  } catch {
    try {
      const r2 = await fetch(
        "https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5ETNX"
      );
      const j2 = await r2.json();
      us10y = j2?.quoteResponse?.result?.[0]?.regularMarketPrice ?? "--";
    } catch {}
  }

  res.status(200).json({
    btc,
    btc_change,
    gold,
    gold_change,
    dxy,
    us10y
  });
}
