(function () {
  'use strict';

  window.Stokr = window.Stokr || {};

  const state = {
    stocks: [
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
    ]
  };

  function getStockBySymbol(symbol) {
    return state.stocks.find(function (stockData) {
      return stockData.Symbol === symbol;
    });
  }

  function getState() {
    return state;
  }

  window.Stokr.Model = {
    getState,
    getStockBySymbol
  };

}());
