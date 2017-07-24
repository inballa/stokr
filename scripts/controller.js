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
    renderView();

  }

  function toggleChangeButton() {
    const state = Model.getState();
    state.ui.stockMode = (state.ui.stockMode + 1) % 2;
    renderView();
  }


  function renderView() {
    const state = Model.getState();
    const stocks = state.stocks;
    const uiState = state.ui;
    View.render(stocks, uiState);

  }

  window.Stokr.Ctrl = {
    toggleChangeButton,
    reorderStocks
  };

  renderView();


}());

