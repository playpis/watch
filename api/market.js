export default async function handler(req, res) {

  let btc = "--", btc_change = 0;
  let gold = "--", gold_change = 0;

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

  res.status(200).json({
    btc,
    btc_change,
    gold,
    gold_change
  });
}
