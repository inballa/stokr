// add event listener to filter
//add event handler that calls the ctrl
//ctrl change data filter
//rerender

(function () {
  'use strict';

  window.Stokr = window.Stokr || {};

  const situationMap = {
    0: 'PercentChange',
    1: 'Change'
  };

  function createHeader(isFilterShown) {
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
          <button class="icon-filter filter"></button>
        </li>
        <li>
          <button class="icon-settings"></button>
        </li>
      </ul>
      <!--?????????/del?????-->
      ${isFilterShown ? renderForm(): ''}
    </header>`;
  }

  function createMain(stockData, uiState) {
    return `<main>${generateStockList(stockData, uiState)}</main>`;
  }

  function setupEventListeners() {
    const mainElm = document.querySelector('main');
    const filterButton = document.querySelector('.filter');
    const applyButton = document.querySelector('apply-filter')

    mainElm.addEventListener('click', handelMainClick);
    filterButton.addEventListener('click', filterModeHandler);
    //change to submit?????????????????????????/
    applyButton.addEventListener('click', filterHandler)
  }

  // function filterHandler() {
  //   const formElm =
  // }


  function filterModeHandler() {
    window.Stokr.Ctrl.changeFilterMode();
  }

  function handelMainClick(event) {
    const clickedElm = event.target;

    if (clickedElm.classList.contains('js-change-button')) {
      changeButtonHandler();
      return;
    }

    if (clickedElm.dataset.type === 'arrow') {
      const symbol = clickedElm.closest('li').dataset.id;
      window.Stokr.Ctrl.reorderStocks(symbol, clickedElm.dataset.direction);
      return;
    }
  }

  function changeButtonHandler() {
    const buttonElmList = document.querySelectorAll('.js-change-button');
    const Ctrl = window.Stokr.Ctrl;
    buttonElmList.forEach(Ctrl.toggleChangeButton);
  }

  function generateStockList(stockDataList, uiState) {
    let stockListElm = stockDataList.map(function (stock, index) {
      return `<li data-id="${stock.Symbol}">${createStock(stock, index, stockDataList.length, uiState)}</li>`

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

  function getStockChange(stockMode) {
    return situationMap[stockMode];
  }

  function createStock(stockData, index, last, uiState) {
    const stockChange = getStockChange(uiState.stockMode);
    let change = stockData[stockChange];
    if (uiState.stockMode !== 0) {
      change = (Math.round(change * 100) / 100).toFixed(2);
    }
    return `
      <span class="stock-name">
        <span>${stockData.Symbol}</span>
        <span> (${stockData.Name})</span>
      </span>
      <div class="stock-info">
        <span class="stock-data">${(Math.round(stockData.LastTradePriceOnly * 100) / 100).toFixed(2)}</span>
        <button class="${buttonColor(stockData)} js-change-button"
                id="${stockData.Symbol}">
          ${change}
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

  function renderForm() {
    return `<form class="filter-fields">
              <div class="filter-criteria">
                <label for="nameFilter">ByName</label>
                <input type="text" id="nameFilter">
              </div>
              <div class="filter-criteria">
                <label for="select-gain">By Gain</label>
                <select id="select-gain"> 
                  <option value="All" selected>All</option> 
                  <option value="Losing" >Losing</option>
                  <option value="Gaining">Gaining</option>
                </select>
              </div>
              <div class="filter-criteria">
                <label for="range-from">By Range: From</label>
                <input type="number" id="range-from">
              </div>
              <div class="filter-criteria">
                <label for="range-to">By Range: To</label>
                <input type="number" id="range-to">
              </div>
              <button class="apply-filter">Apply</button>
            </form>`
  }

  function buttonColor(stockData) {
    if (stockData.Change >= 0) {
      return 'green';
    }
    else {
      return 'red';
    }
  }

  function render(stocks, uiState) {
    const divElm = document.querySelector('.stock-list-page');
    divElm.innerHTML = `${createHeader(uiState.isFiltersShown)} ${createMain(stocks, uiState)}`;
    setupEventListeners();
  }

  window.Stokr.View = {
    render
  };
}());
