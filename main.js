const stockSymbbole = [
  "WIX",
  "MSFT",
  "YHOO"
];

const stockData = [
  {
    "Symbol": "WIX",
    "Name": "Wix.com Ltd.",
    "Change": "0.750000",
    "PercentChange": "+1.51%",
    "LastTradePriceOnly": "76.099998"
  },
  {
    "Symbol": "MSFT",
    "Name": "Microsoft Corporation",
    "PercentChange": "-2.09%",
    "Change": "-0.850006",
    "LastTradePriceOnly": "69.620003"
  },
  {
    "Symbol": "YHOO",
    "Name": "Yahoo! Inc.",
    "Change": "0.279999",
    "PercentChange": "+1.11%",
    "LastTradePriceOnly": "50.599998"
  }
];

function generateStockList(stockDataList) {
  let stockListElm = stockDataList.map(function(stock) {
    return `<li>${createStock(stock)}</li>`

  });

  stockListElm = stockListElm.join('');
  console.log(stockListElm);
  return `<ul>${stockListElm}</ul>`;
}

function createStock(stockData) {
  return `
      <span>${stockData['Symbol']}</span>
      <span> (${stockData['Name']})</span>
      <div>
        <span>${stockData['Change']}</span>
        <button>${stockData['PercentChange']}</button>
        <span>
          <button class="up">^</button>
          <button class="down">V</button>
        </span>
       </div>
   `;
}

const mainElm = document.querySelector('main');
mainElm.innerHTML = generateStockList(stockData);
