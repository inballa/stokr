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

  function passNameFilter(stock, name) {
    const symbol = stock.Symbol.toLowerCase();
    const stockName = stock.Name.toLowerCase();
    const nameFilter = name.toLowerCase();
    return symbol.indexOf(nameFilter) !== -1 || stockName.indexOf(nameFilter) !== -1;
  }

  function passGainFilter(stock, gain) {
    return gain === "All" || (gain === 'Losing' && parseFloat(stock.Change) < 0) ||
      (gain === 'Gaining' && parseFloat(stock.Change) > 0);
  }

  function inRange(stock, from, to) {
    let rangeFrom = true;
    let rangeTo = true;
    if (from !== '') {
      rangeFrom = Number(stock.PercentChange) > Number(from);
    }
    if (to !== '') {
      rangeTo = Number(stock.PercentChange) < Number(rangeTo);
    }

    return rangeFrom && rangeTo;
  }

  //refactor to outer func
  // function filterStocks(name, gain, rangeFrom, rangeTo) {
  function filterStocks(filter) {
    Model.getState().ui.filters = filter;

    const stocks = Model.getState().stocks;

    Model.getState().filteredStocks = stocks.filter((stockData) => {
      const containsName = passNameFilter(stockData, filter.name);
      const gainBool = passGainFilter(stockData, filter.gain);
      const range = inRange(stockData, filter.rangeFrom, filter.rangeTo);
      // const filterConditions = [containsName, gainBool, range];
      //Array.every/////////////
      // return filterConditions.every(val => {val === true});
      return containsName && gainBool && range;
    })
    console.log(Model.getState().filteredStocks);
    renderView(Model.getState().filteredStocks);
  }

  function onRouteChange() {
    Model.getState().stocks = stocksList;
    renderView(Model.getState().stocks);
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
    onRouteChange,
  };

  function fetchStocks() {
    return fetch('mocks/stocks.json').then(stocksData => {
      return stocksData.json();
    });
  }

  function init() {
    fetchStocks().then(stocksList => {
      Model.getState().stocks = stocksList;
      renderView(Model.getState().stocks);
    })
  }

  init();


}());

