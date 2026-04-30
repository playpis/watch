export default async function handler(req, res) {

  let btc = "--", btc_change = 0;
  let gold = "--", gold_change = 0;
  let dxy = "--";
  let tlt = "--";

  // BTC + XAUT（CoinGecko）
  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether-gold&vs_currencies=usd&include_24hr_change=true"
    );
    const j = await r.json();

    btc = j.bitcoin?.usd ?? "--";
    btc_change = j.bitcoin?.usd_24h_change ?? 0;

    gold = j["tether-gold"]?.usd ?? "--";
    gold_change = j["tether-gold"]?.usd_24h_change ?? 0;
  } catch {}

  // DXY（Stooq）
  try {
    const r = await fetch(
      "https://stooq.com/q/l/?s=dx.f&f=sd2t2ohlc&h&e=json"
    );
    const j = await r.json();
    dxy = j?.symbols?.[0]?.close ?? "--";
  } catch {}

  // TLT（利率替代）
  try {
    const r = await fetch(
      "https://stooq.com/q/l/?s=tlt.us&f=sd2t2ohlc&h&e=json"
    );
    const j = await r.json();
    tlt = j?.symbols?.[0]?.close ?? "--";
  } catch {}

  res.status(200).json({
    btc,
    btc_change,
    gold,
    gold_change,
    dxy,
    tlt
  });
}
