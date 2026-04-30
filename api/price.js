export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether-gold&vs_currencies=usd&include_24hr_change=true"
    );

    const data = await response.json();

    res.status(200).json({
      btc: data.bitcoin?.usd ?? "--",
      btc_24h: data.bitcoin?.usd_24h_change?.toFixed(2) ?? "0.00",

      gold: data["tether-gold"]?.usd ?? "--",
      gold_24h: data["tether-gold"]?.usd_24h_change?.toFixed(2) ?? "0.00"
    });

  } catch (error) {
    res.status(500).json({
      btc: "--",
      btc_24h: "0.00",
      gold: "--",
      gold_24h: "0.00"
    });
  }
}
