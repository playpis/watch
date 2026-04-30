export default async function handler(req, res) {

  let btc = "--", btc_change = 0;
  let gold = "--", gold_change = 0;

  let dxy = "--", dxy_change = 0;
  let tlt = "--", tlt_change = 0;

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

  // DXY（价格 + 涨跌）
  try {
    const r = await fetch(
      "https://stooq.com/q/l/?s=dx.f&f=sd2t2ohlc&h&e=json"
    );
    const j = await r.json();

    const item = j?.symbols?.[0];

    dxy = item?.close ?? "--";

    if (item?.open && item?.close) {
      dxy_change =
        Number(item.close) - Number(item.open);
    }
  } catch {}

  // TLT（价格 + 涨跌）
  try {
    const r = await fetch(
      "https://stooq.com/q/l/?s=tlt.us&f=sd2t2ohlc&h&e=json"
    );
    const j = await r.json();

    const item = j?.symbols?.[0];

    tlt = item?.close ?? "--";

    if (item?.open && item?.close) {
      tlt_change =
        Number(item.close) - Number(item.open);
    }
  } catch {}

  res.status(200).json({
    btc,
    btc_change,

    gold,
    gold_change,

    dxy,
    dxy_change,

    tlt,
    tlt_change
  });
}
