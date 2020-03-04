const axios = require('axios');
const cheerio = require('cheerio');


// return number of pages containing bib restaurants 
const firstPage = data => {
  const $ = cheerio.load(data);

  // num of bib restaurants
  var numOfBib = $('body > main > section.section-main.search-results.search-listing-result > div > div > div.search-results__count > div.d-flex.align-items-end.search-results__status.box-placeholder > div.flex-fill.js-restaurant__stats > h1').contents().filter(function () {
    if (this.type === 'text') {
      varArr = [];
      varArr.push(this.data);
      return this.data;
    }
  }).text();


  numOfBib = numOfBib.replace(/\s/g, "");
  numOfBib = numOfBib.replace('+', "");
  reg = /\d+/g;
  result = numOfBib.match(reg);
  numOfBib = result[0];
  numOfBib = parseInt(numOfBib);

  var numOfPages
  // num of pages containing bib restaurant
  numOfPages = numOfBib / 40;
  numOfPages = Math.ceil(numOfPages);

  

  return numOfPages;
}

// get links from search page
const searchPage = data => {
  const $ = cheerio.load(data);
  var links = [];
  // get all the restaurant links for one page
  $("body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation.js-restaurant__list_items > div.col-md-6.col-lg-6.col-xl-3 > div > a").each((i, elem) => {
    links.push($(elem).prop("href"));
  });
  return links;
}


/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
// return restaurants details
const restauDetails = data => {
  const $ = cheerio.load(data);

  // get name
  var name = $('.section-main h2.restaurant-details__heading--title').text();
  var fullName = name;
  name = name.toLocaleLowerCase();
  name = name.replace('�',"o").replace('ô','o').replace(/\s/g,"").replace('-',"").replace('-',"").replace('\'',"").replace('ö','o').replace('ù','u').replace('û','u').replace('ü','u').replace("î","i").replace("ï","i").replace("à","a").replace("â","a").replace("ä","a").replace("é","e").replace("è","e").replace("ê","e").replace("ë","e").replace("ç","c");

  // get phone number
  var phone = $('span.flex-fill').first().text();
  phone = phone.replace(/\s/g, "");
  phone = phone.replace('+33', "0");
  phone = phone.replace('.',"").replace('.',"").replace('.',"").replace('.',"");

  // get city
  var city = $('body > main > div.restaurant-details > div.container > div > div.col-xl-8.col-lg-7 > section.section.section-main.restaurant-details__main > div.restaurant-details__heading.d-none.d-lg-block > ul').text();
  city = city.toLocaleLowerCase();
  city = city.replace(/\s/g, "");
  city = city.split(",");
  city = city[1]
  city = city.replace('�',"o").replace('ô','o').replace(/\s/g,"").replace('-',"").replace('-',"").replace('-',"").replace('\'',"").replace('ö','o').replace('ù','u').replace('û','u').replace('ü','u').replace("î","i").replace("ï","i").replace("à","a").replace("â","a").replace("ä","a").replace("é","e").replace("é","e").replace("é","e").replace("è","e").replace("ê","e").replace("ë","e").replace("ç","c");  
  city = city.replace(/é/g, "");
  city = city.replace(/-/g, "");

  // get address
  var address = $('body > main > div.restaurant-details > div.container > div > div.col-xl-8.col-lg-7 > section.section.section-main.restaurant-details__main > div.restaurant-details__heading.d-none.d-lg-block > ul > li:nth-child(1)').text().trim();
  var testGoodAddress = address.split(" ");
  if(testGoodAddress[testGoodAddress.length - 1] != "France")
  {
    var address = $('body > main > div.restaurant-details > div.container > div > div.col-xl-8.col-lg-7 > section.section.section-main.restaurant-details__main > div.restaurant-details__heading.d-none.d-lg-block > ul > li:nth-child(2)').text().trim();
  }

  return { name, phone, city, address, fullName};
};

// return links of restaurants for one page
module.exports.scrapeASearchPage = async url => {
  const response = await axios(url);
  const { data, status } = response;
  if (status >= 200 && status < 300) {
    return searchPage(data);
  }
  console.error(status);
  return null;
};

// return number of page to scrap
module.exports.scrapeFirstSearchPage = async url => {
  const response = await axios(url);
  const { data, status } = response;
  if (status >= 200 && status < 300) {
    return firstPage(data);
  }
  console.error(status);
  return null;
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
// return restaurants details
module.exports.scrapeRestaurant = async url => {
  const response = await axios(url);
  const { data, status } = response;
  if (status >= 200 && status < 300) {
    return restauDetails(data);
  }
  console.error(status);
  return null;
};

/**
 * Get all France located Maitre Restaurateurs restaurants
 * @return {Array} restaurants
 */
module.exports.get = () => {
  return [];
};
