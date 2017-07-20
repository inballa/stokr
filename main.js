(function () {
  const stockSymbbole = [
    "WIX",
    "MSFT",
    "YHOO"
  ];

  const stocksData = [
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

  const situationMap = {
    PercentChange: 'Change',
    Change: 'PercentChange'
  }

  function generateStockList(stockDataList) {
    let stockListElm = stockDataList.map(function (stock) {
      return `<li id="${stock.Symbol}">${createStock(stock)}</li>`

    });

    stockListElm = stockListElm.join('');
    console.log(stockListElm);
    return `<ul class="reset-list stock-list">${stockListElm}</ul>`;
  }

  function createStock(stockData) {
    return `
      <span class="stock-name">
        <span>${stockData.Symbol}</span>
        <span> (${stockData.Name})</span>
      </span>
      <div class="stock-info">
        <span class="stock-data">${(Math.round(stockData.LastTradePriceOnly * 100) / 100).toFixed(2)}</span>
        <button class="${buttonColor(stockData)} change-button" data-changeable="PercentChange" id="${stockData.Symbol}">${stockData.PercentChange}</button>
        <span class="upDown">
          <button class="icon-arrow up"></button>
          <button class="icon-arrow down"></button>
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
        <button><img src="assets/svg/search.svg"></button>
      </li>
      <li>
        <button><img src="assets/svg/refresh.svg"></button>
      </li>
      <li>
        <button><img src="assets/svg/filter.svg"></button>
      </li>
      <li>
        <button><img src="assets/svg/settings.svg"></button>
      </li>
    </ul>
  </header>`;
  }

  function createMain(stockData) {
    return `<main>${generateStockList(stockData)}</main>`;
  }

  function init(stockData) {
    return `${createHeader()}
          ${createMain(stockData)}`;
  }

  function addEventListener() {
    //on click => switch the daily change
    const buttons = document.querySelectorAll('.change-button');
    Array.prototype.forEach.call(buttons, function (buttonElm) {
      buttonElm.addEventListener('click', changeButtonHandler);
    });
  }

  function getStockBySymbol(symbol) {
    return stocksData.find(function (stockData) {
      return stockData.Symbol === symbol;
    });
  }

  function changeButtonHandler(event) {
    const buttonElm = event.currentTarget;
    const selectedStockItem = getStockBySymbol(buttonElm.id);

    const curDisplayedData = buttonElm.dataset.changeable;
    const nextDisplayedData = situationMap[curDisplayedData];

    buttonElm.dataset.changeable = nextDisplayedData;
    let nextValToDisplay = selectedStockItem[nextDisplayedData];
    if(nextDisplayedData !== 'PercentChange') {
      nextValToDisplay = (Math.round(selectedStockItem[nextDisplayedData] * 100) / 100).toFixed(2);
    }
    buttonElm.innerHTML = nextValToDisplay;

  }

  const divElm = document.querySelector('.stock-list-page');
  divElm.innerHTML = init(stocksData);
  addEventListener();


}())
