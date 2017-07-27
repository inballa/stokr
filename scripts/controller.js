(function () {
    'use strict';

    window.Stokr = window.Stokr || {};

    const Model = window.Stokr.Model;
    const View = window.Stokr.View;


    function reorderStocks(symbol, direction) {
      const stocksData = Model.getState().stocks;
      const stocksSymbol = Model.getState().symbols;
      const index = stocksData.findIndex((stockData) => {
        return stockData.Symbol === symbol;
      });
      const tmp = stocksData[index];
      const symbolTmp = stocksSymbol[index];
      const secondIndex = direction === 'up' ? index - 1 : index + 1;
      stocksData[index] = stocksData[secondIndex];
      stocksData[secondIndex] = tmp;
      stocksSymbol[index] = stocksSymbol[secondIndex];
      stocksSymbol[secondIndex] = symbolTmp;
      renderView(Model.getState().stocks);

    }

    function toggleChangeButton() {
      const state = Model.getState();
      updateUi('stockMode', (state.ui.stockMode + 1) % 2);
      // state.ui.stockMode = (state.ui.stockMode + 1) % 2;
      renderView(Model.getState().stocks);
    }

    function changeFilterMode() {
      updateUi('isFiltersShown', !Model.getState().ui.isFiltersShown === true)

      // Model.getState().ui.isFiltersShown = !Model.getState().ui.isFiltersShown === true;
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


    function filterStocks() {
      const filters = Model.getState().ui.filters;
      const stocks = Model.getState().stocks;
      if (filters.name === '' && filters.gain === 'All'
        && filters.rangeTo === '' && filters.rangeFrom === '') {
        return stocks;
      }

      Model.getState().filteredStocks = stocks.filter((stockData) => {
        const containsName = passNameFilter(stockData, filters.name);
        const gainBool = passGainFilter(stockData, filters.gain);
        const range = inRange(stockData, filters.rangeFrom, filters.rangeTo);
        return containsName && gainBool && range;
      })
      return Model.getState().filteredStocks;
    }

    // function filterStocks(filter) {
    //   const stocks = Model.getState().stocks;
    //
    //   Model.getState().filteredStocks = stocks.filter((stockData) => {
    //     const containsName = passNameFilter(stockData, filter.name);
    //     const gainBool = passGainFilter(stockData, filter.gain);
    //     const range = inRange(stockData, filter.rangeFrom, filter.rangeTo);
    //     // const filterConditions = [containsName, gainBool, range];
    //     //Array.every/////////////
    //     // return filterConditions.every(val => {val === true});
    //     return containsName && gainBool && range;
    //   })
    // }

    function filtersUpdate(filter){
      updateUi('filters', filter);
      renderView();
    }

    function onRouteChange() {
      renderView();
    }

    function renderView() {
      const state = Model.getState();
      const uiState = state.ui;
      let stocks = state.stocks;
      if(uiState.isFiltersShown){
        stocks = filterStocks();
      }
      View.render(stocks, uiState);
    }

    window.Stokr.Ctrl = {
      toggleChangeButton,
      reorderStocks,
      changeFilterMode,
      filtersUpdate,
      onRouteChange,
    };
    function fetchStocks() {
      let stockSymbol = Model.getState().symbols.join(',');
      return fetch(`http://localhost:7000/quotes?q=${stockSymbol}`)
        .then(res => {
          //add testing ok 200
          if (res.ok) {
            return res.json();
          }
        });
    }

    function buildStock(stock) {
      return {
        "Symbol": stock.symbol,
        "Name": stock.Name,
        "PercentChange": stock.realtime_chg_percent,
        "Change": stock.Change,
        "LastTradePriceOnly": stock.LastTradePriceOnly,
        "MarketCapitalization": stock.MarketCapitalization,
      }
    }

    function initUi() {
      Model.getState().ui = {
        stockMode: 0,
        isFiltersShown: false,
        filters: {
          name: '',
          gain: 'All',
          rangeFrom: '',
          rangeTo: '',
        }
      }
    }

    function updateUi(property, value) {
      Model.getState().ui[property] = value;
      console.log(property);
      console.log(value);
      console.log(Model.getState().ui[property]);
      localStorage.setItem('stokr-state', JSON.stringify(Model.getState().ui));
    }

    function init() {
      const ui = localStorage.getItem('stokr-state');
      if (ui === null) {
        localStorage.setItem('stokr-state', JSON.stringify(Model.getState().ui));
      }
      else {
        Model.getState().ui = JSON.parse(localStorage.getItem('stokr-state'));
      }
      fetchStocks()
        .then(stocksData => {
          let stockList = stocksData.query.results.quote;
          let length = stocksData.query.count;
          if (length === 1) {
            stockList = [stockList];
          }
          Model.getState().stocks = stockList.map(buildStock);
          renderView();
        })

    }

    init();

  }
  ()
);

