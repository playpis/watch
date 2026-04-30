export default async function handler(req, res) {
  try {
    /*
      BTC + XAUT（CoinGecko）
    */
    const cryptoRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether-gold&vs_currencies=usd"
    );

    const crypto = await cryptoRes.json();

    /*
      DXY + US10Y（Yahoo Finance）
    */
    const macroRes = await fetch(
      "https://query1.finance.yahoo.com/v7/finance/quote?symbols=DX-Y.NYB,^TNX"
    );

    const macro = await macroRes.json();

    const dxy =
      macro.quoteResponse?.result?.[0]?.regularMarketPrice ?? "--";

    const us10y =
      macro.quoteResponse?.result?.[1]?.regularMarketPrice ?? "--";

    res.status(200).json({
      btc: crypto.bitcoin?.usd ?? "--",
      gold: crypto["tether-gold"]?.usd ?? "--",
      dxy,
      us10y
    });

  } catch (error) {
    res.status(500).json({
      btc: "--",
      gold: "--",
      dxy: "--",
      us10y: "--"
    });
  }
}
