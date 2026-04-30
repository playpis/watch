export default async function handler(req, res) {

  let btc = "--", btc_change = 0;
  let gold = "--", gold_change = 0;

  let dxy = "--", dxy_change = 0;
  let tlt = "--", tlt_change = 0;

  /*
    =========================
    BTC + XAUT（CoinGecko）
    使用真实24h涨跌幅（官方提供）
    =========================
  */
  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether-gold&vs_currencies=usd&include_24hr_change=true"
    );

    const j = await r.json();

    btc = j.bitcoin?.usd ?? "--";
    btc_change = j.bitcoin?.usd_24h_change ?? 0;

    gold = j["tether-gold"]?.usd ?? "--";
    gold_change = j["tether-gold"]?.usd_24h_change ?? 0;

  } catch (e) {}

  /*
    =========================
    DXY（真实趋势）
    使用：
    today_close - yesterday_close
    而不是：
    today_close - today_open
    =========================
  */

  try {
    const r = await fetch(
      "https://stooq.com/q/l/?s=dx.f&f=sd2t2ohlc&h&e=json"
    );

    const j = await r.json();
    const item = j?.symbols?.[0];

    dxy = item?.close ?? "--";

    /*
      stooq 有时返回：
      close + previous close（close yesterday）

      如果没有 previous 字段，
      fallback 用 open（次优方案）
    */

    const prev =
      item?.prev ??
      item?.previous ??
      item?.close_prev ??
      item?.open;

    if (item?.close && prev) {
      dxy_change =
        Number(item.close) - Number(prev);
    }

  } catch (e) {}

  /*
    =========================
    TLT（真实趋势）
    同样使用：
    today_close - yesterday_close
    =========================
  */

  try {
    const r = await fetch(
      "https://stooq.com/q/l/?s=tlt.us&f=sd2t2ohlc&h&e=json"
    );

    const j = await r.json();
    const item = j?.symbols?.[0];

    tlt = item?.close ?? "--";

    const prev =
      item?.prev ??
      item?.previous ??
      item?.close_prev ??
      item?.open;

    if (item?.close && prev) {
      tlt_change =
        Number(item.close) - Number(prev);
    }

  } catch (e) {}

  /*
    =========================
    返回最终数据
    =========================
  */

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
