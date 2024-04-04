
const URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
const list = document.getElementById("list");
console.log(list);
let data;

function fetchData() {
    console.log('Api called');
  fetch(URL).then(async (response) => {
    data = await response.json();
    console.log(data);
    data.forEach((item) => {
      addItemtoList(item);
    });
  }).catch(err=>{
    console.error(err);
  });
}
fetchData();

function fetchSearchData(data) {
  list.innerHTML = "";
  data.forEach((item) => {
    addItemtoList(item);
  });
}
function addItemtoList(item) {
  const row = document.createElement("tr");
  row.classList.add("row");
  let imageSrc = item.image;
  let id = item.id;
  let name = item.name;
  let symbol = item.symbol.toUpperCase();
  let current_price = item.current_price;
  let total_volume = item.total_volume;
  let price_change = item.price_change_percentage_24h;
  let market_cap = item.market_cap;
  let market_cap_rank = item.market_cap_rank;
  row.id = id;
  row.innerHTML = `
                <td class="col1">
                    <img src="${imageSrc}" id="symbol" class="logo" alt="logo">
                    ${name}
                </td>
                <td class="text-left">${symbol.toUpperCase()}</td>
                <td class="text-right">$${current_price}</td>
                <td class="text-right">$${total_volume}</td>
                <td class="percentage text-center">${price_change}%</td>
                <td class="mcap text-right">Mkt Cap:$${market_cap}</td>
                `;

  list.append(row);
  let percent = row.querySelector(".percentage");
  if (price_change < 0) {
    percent.classList.add("red");
  } else {
    percent.classList.add("green");
  }
}

let decMkt = true;
let decPer = false;
//market cap
function Sort(criteria) {
  console.log("in sort");
  if (criteria === "mkt_cap") {
    console.log("in mcap sort");
    data.sort((item1, item2) => {
      if (decMkt) {
        //inc
        return item1.market_cap_rank - item2.market_cap_rank;
      } else {
        //dec
        return item2.market_cap_rank - item1.market_cap_rank;
      }
    });
    if (decMkt) decMkt = false;
    else decMkt = true;
  } else {
    data.sort((item1, item2) => {
      if (decPer) {
        //inc
        return (
          item1.price_change_percentage_24h - item2.price_change_percentage_24h
        );
      } else {
        //dec
        return (
          item2.price_change_percentage_24h - item1.price_change_percentage_24h
        );
      }
    });
    if (decPer) decPer = false;
    else decPer = true;
  }
  data.forEach((obj) => console.log(obj.market_cap_rank));

  fetchSearchData(data);
}

function Search(input) {
  list.innerHTML = "";
  if (input == "") fetchSearchData(data);

  let searchData = data.filter((item) => {
    return (
      item.id.toLowerCase().includes(input.toLowerCase()) ||
      item.symbol.toLowerCase().includes(input.toLowerCase())
    );
  });
  fetchSearchData(searchData);
}

let sortByPerBtn = document.getElementById("sortPer");
let sortByMktBtn = document.getElementById("sortMkt");
sortByPerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("percentage sort clicked");
  Sort("percentage");
});
sortByMktBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("mcap sort clicked");
  Sort("mkt_cap");
});

let searchInput = document.getElementById("search");
searchInput.addEventListener("input", (e) => {
  e.preventDefault();
  let value = searchInput.value;
  Search(value);
});
searchInput.addEventListener("click", (e) => {
  e.preventDefault();
  let value = searchInput.value;
  Search(value);
});
