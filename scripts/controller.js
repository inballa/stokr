(function () {
  'use strict';

  window.Stokr = window.Stokr || {};

  const Model = window.Stokr.Model;

  const situationMap = {
    PercentChange: 'Change',
    Change: 'PercentChange'
  };

  function generateStockList(stockDataList) {
    let stockListElm = stockDataList.map(function (stock, index) {
      return `<li data-id="${stock.Symbol}">${createStock(stock, index, stockDataList.length)}</li>`

    });

    stockListElm = stockListElm.join('');
    console.log(stockListElm);
    return `<ul class="reset-list stock-list">${stockListElm}</ul>`;
  }

  function toggleDisabled(direction, index, lastIndex) {
    if (direction === 'up' && index === 0) {
      return 'disabled';
    }

    if (direction === 'down' && index === lastIndex) {
      return 'disabled';
    }
    return "";
  }

  function createStock(stockData, index, last) {
    return `
      <span class="stock-name">
        <span>${stockData.Symbol}</span>
        <span> (${stockData.Name})</span>
      </span>
      <div class="stock-info">
        <span class="stock-data">${(Math.round(stockData.LastTradePriceOnly * 100) / 100).toFixed(2)}</span>
        <button class="${buttonColor(stockData)} js-change-button"
                data-changeable="PercentChange"
                id="${stockData.Symbol}">
          ${stockData.PercentChange}
        </button>
        <span class="upDown">
          <button class="icon-arrow up-button" ${toggleDisabled('up', index, last - 1)}
                  data-type="arrow" data-direction="up"></button>
          <button class="icon-arrow down-button" ${toggleDisabled('down', index, last - 1)} 
                  data-type="arrow" data-direction="down"></button>
        </span>
       </div>
   `;
  }

  function buttonColor(stockData) {
    if (stockData.Change >= 0) {
      return 'green';
    }
    else {
      return 'red';
    }
  }

  function createHeader() {
    return `<header>
    <h1>STOKR</h1>
    <ul class="menu reset-list">
      <li>
        <button class="icon-search"></button>
      </li>
      <li>
        <button class="icon-refresh"></button>
      </li>
      <li>
        <button class="icon-filter"></button>
      </li>
      <li>
        <button class="icon-settings"></button>
      </li>
    </ul>
  </header>`;
  }

  function createMain(stockData) {
    return `<main>${generateStockList(stockData)}</main>`;
  }

  function changeButtonHandler() {
    const buttonElmList = document.querySelectorAll('.js-change-button');
    Array.prototype.forEach.call(buttonElmList, changeButtonData);
  }

  function reorderStocks(index, direction) {
    console.log(index, direction);
    const tmp = stocksData[index];

    const secondIndex = direction === 'up' ? index - 1 : index + 1;
    stocksData[index] = stocksData[secondIndex];
    stocksData[secondIndex] = tmp;
    render();

  }

  function setupEventListeners() {
    const mainElm = document.querySelector('main');

    mainElm.addEventListener('click', window.Stokr.Ctrl.handelMainClick);
  }

  function handelMainClick(event) {
    const clickedElm = event.target;

    if (clickedElm.classList.contains('js-change-button')) {
      changeButtonHandler();
      return;
    }

    if (clickedElm.dataset.type === 'arrow') {
      const symbol = clickedElm.closest('li').dataset.id;
      const index = stocksData.findIndex((stockData) => {
        return stockData.Symbol === symbol;
      });
      reorderStocks(index, clickedElm.dataset.direction);
      return;
    }
  }


  function changeButtonData(changeButton) {
    const selectedStockItem = Model.getStockBySymbol(changeButton.id);

    const curDisplayedData = changeButton.dataset.changeable;
    const nextDisplayedData = situationMap[curDisplayedData];

    changeButton.dataset.changeable = nextDisplayedData;

    let nextValToDisplay = selectedStockItem[nextDisplayedData];

    if (nextDisplayedData !== 'PercentChange') {
      nextValToDisplay = (Math.round(selectedStockItem[nextDisplayedData] * 100) / 100).toFixed(2);
    }
    changeButton.innerHTML = nextValToDisplay;
  }

  function render() {
    const state = Model.getState();
    const stocksData = state.stocks;

    const divElm = document.querySelector('.stock-list-page');
    divElm.innerHTML = `${createHeader()} ${createMain(stocksData)}`;

    setupEventListeners();
  }

  render();

  window.Stokr.Ctrl = {

  }

}());

