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
    let stockListElm = stockDataList.map(function (stock, index) {
      return `<li id="${stock.Symbol}">${createStock(stock, index, stockDataList.length)}</li>`

    });

    stockListElm = stockListElm.join('');
    console.log(stockListElm);
    return `<ul class="reset-list stock-list">${stockListElm}</ul>`;
  }

  function isDisabled(direction, index, lastIndex) {
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
        <button class="${buttonColor(stockData)} change-button" data-changeable="PercentChange" id="${stockData.Symbol}">${stockData.PercentChange}</button>
        <span class="upDown">
          <button class="icon-arrow up-button" ${isDisabled('up', index, last - 1)} ></button>
          <button class="icon-arrow down-button" ${isDisabled('down', index, last - 1)}></button>
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
        <button class="icon-search-place-holder"></button>
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

  function init(stockData) {
    return `${createHeader()}
          ${createMain(stockData)}`;
  }

  function addChangeEventListener() {
    //on click => switch the daily change
    const buttons = document.querySelectorAll('.change-button');
    Array.prototype.forEach.call(buttons, function (buttonElm) {
      buttonElm.addEventListener('click', changeButtonHandler);
    });
  }

  function addUpEventListener(){
    const buttons = document.querySelectorAll('.down-button');
    Array.prototype.forEach.call(buttons, function (buttonElm) {
      buttonElm.addEventListener('click', upButtonHandler);
    });
  }

  function getStockBySymbol(symbol) {
    return stocksData.find(function (stockData) {
      return stockData.Symbol === symbol;
    });
  }

  function changeButtonHandler(event) {
    const buttonElmList = document.querySelectorAll('.change-button');
    Array.prototype.forEach.call(buttonElmList, changeButtonData);
  }

  function upButtonHandler(event) {
    //get element
    //get containing li
    //get brother li from bottom
    //change the order
    //if last li change disabled
    const buttonElm = event.currentTarget;
    const containingLi = buttonElm.parentNode.parentNode.parentNode;
    const brotherLi = containingLi.nextSibling;
    const listElm = containingLi.parentNode;
    listElm.insertBefore(brotherLi, containingLi);

    if(containingLi.nextSibling === null){
      buttonElm.disabled = true;
      brotherLi.querySelector('.down-button').disabled = false;
    }

    const upButton = containingLi.querySelector('.up-button');
    if(upButton.disabled === true){
      upButton.disabled = false;
      brotherLi.querySelector('.up-button').disabled = true;
    }
  }

  function changeButtonData(changeButton) {
    const selectedStockItem = getStockBySymbol(changeButton.id);

    const curDisplayedData = changeButton.dataset.changeable;
    const nextDisplayedData = situationMap[curDisplayedData];

    changeButton.dataset.changeable = nextDisplayedData;
    let nextValToDisplay = selectedStockItem[nextDisplayedData];
    if (nextDisplayedData !== 'PercentChange') {
      nextValToDisplay = (Math.round(selectedStockItem[nextDisplayedData] * 100) / 100).toFixed(2);
    }
    changeButton.innerHTML = nextValToDisplay;
  }

  const divElm = document.querySelector('.stock-list-page');
  divElm.innerHTML = init(stocksData);
  addChangeEventListener();
  addUpEventListener();


}())
