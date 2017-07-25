(function () {
  'use strict';

  window.Stokr = window.Stokr || {};

  const Model = window.Stokr.Model;
  const View = window.Stokr.View;


  function reorderStocks(symbol, direction) {
    const stocksData = Model.getState().stocks;
    const index = stocksData.findIndex((stockData) => {
      return stockData.Symbol === symbol;
    });
    console.log(index, direction);
    const tmp = stocksData[index];

    const secondIndex = direction === 'up' ? index - 1 : index + 1;
    stocksData[index] = stocksData[secondIndex];
    stocksData[secondIndex] = tmp;
    renderView(Model.getState().stocks);

  }

  function toggleChangeButton() {
    const state = Model.getState();
    state.ui.stockMode = (state.ui.stockMode + 1) % 2;
    renderView(Model.getState().stocks);
  }

  function changeFilterMode() {
    Model.getState().ui.isFiltersShown = !Model.getState().ui.isFiltersShown === true;
    renderView(Model.getState().stocks);
  }


  function filterStocks(name, gain, rangeFrom, rangeTo) {
    const stocks = Model.getState().stocks;
    Model.getState().filteredStocks = stocks.filter((stockData) => {
      const containsName = stockData.Symbol.indexOf(name) !== -1 || stockData.Name.indexOf(name) !== -1;
      const gainBool = (gain === 'Losing' && parseFloat(stockData.Change) < 0) || (gain === 'Gaining' && parseFloat(stockData.Change) > 0);
      let boolFrom = true;
      let boolTo = true;
      // const percentChange = stockData.PercentChange.substring(0, stockData.PercentChange.length - 1);
      // if (rangeFrom !== '') {
      //   boolFrom = Number(percentChange) > rangeFrom;
      // }
      // if (rangeTo !== '') {
      //   boolTo = Number(percentChange) < rangeTo;
      // }
      return containsName && gainBool && boolTo && boolFrom;
    })
    renderView(Model.getState().filteredStocks);
  }

  function fetchStocks() {
    fetch('mocks/stocks.json').then(stocksData => {
      return stocksData.json();
    }).then(stocksList => {
      Model.getState().stocks = stocksList;
      renderView(Model.getState().stocks);
    })
  }

  function renderView(stocks) {
    const state = Model.getState();
    const uiState = state.ui;
    View.render(stocks, uiState);
  }

  window.Stokr.Ctrl = {
    toggleChangeButton,
    reorderStocks,
    changeFilterMode,
    filterStocks,
  };

  fetchStocks();


}());

