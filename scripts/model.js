(function () {
  'use strict';

  window.Stokr = window.Stokr || {};

  const state = {
    ui: {
      stockMode: 0,
      isFiltersShown: false,
      filters: {
        // name, gain, rangeFrom, rangeTo
      }
    },
    filteredStocks: [],

    stocks:[],
  };


  function getState() {
    return state;
  }

  window.Stokr.Model = {
    getState,
  };

}());
