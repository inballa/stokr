(function () {
  'use strict';

  window.Stokr = window.Stokr || {};


  const state = {
      ui: {
        stockMode: 0,
        isFiltersShown: false,
        filters: {
          name: '',
          gain: 'All',
          rangeFrom: '',
          rangeTo: '',
          // name, gain, rangeFrom, rangeTo
        }
      },
      filteredStocks: [],
      symbols: ['WIX', 'MSFT', 'AAPL', 'GOOG', 'AMZN', 'SBUX', 'NKE'],
      stocks: [],
    }
  ;


  function getState() {
    return state;
  }

  window.Stokr.Model = {
    getState,
  };

}());
