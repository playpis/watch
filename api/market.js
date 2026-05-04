export default async function handler(req, res) {

  let btc = "--", btc_change = 0;
  let gold = "--", gold_change = 0;

  let dxy = "--", dxy_change = 0;
  let tlt = "--", tlt_change = 0;

  // BTC + XAUT
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

  // ===== DXY =====
  try {
    const r = await fetch(
      "https://stooq.com/q/d/l/?s=dx.f&i=d"
    );
    const text = await r.text();

    const lines = text.trim().split("\n");

    // ⭐ 正确：最新在上面
    if (lines.length >= 3) {
      const today = lines[1].split(",");
      const yesterday = lines[2].split(",");

      const todayClose = Number(today[4]);
      const yesterdayClose = Number(yesterday[4]);

      if (!isNaN(todayClose) && !isNaN(yesterdayClose)) {
        dxy = todayClose;
        dxy_change = todayClose - yesterdayClose;
      }
    }
  } catch {}

  // ===== TLT =====
  try {
    const r = await fetch(
      "https://stooq.com/q/d/l/?s=tlt.us&i=d"
    );
    const text = await r.text();

    const lines = text.trim().split("\n");

    if (lines.length >= 3) {
      const today = lines[1].split(",");
      const yesterday = lines[2].split(",");

      const todayClose = Number(today[4]);
      const yesterdayClose = Number(yesterday[4]);

      if (!isNaN(todayClose) && !isNaN(yesterdayClose)) {
        tlt = todayClose;
        tlt_change = todayClose - yesterdayClose;
      }
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
