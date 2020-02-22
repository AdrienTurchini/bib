const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data);

  // name
  var name = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5 > span:nth-child(1) > strong').text();
  name = name.replace('�',"").replace(/\s/g,"").replace('\'',"").replace(/[ùûü]/g,"u").replace(/[îï]/g,"i").replace(/[àâä]/g,"a").replace(/[ôö]/g,"o").replace(/[éèêë]/g,"e").replace(/ç/g,"c");
  name = name.toLocaleLowerCase();

  // phone number
  var phone = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5').text();
  phone = phone.replace(/\s/g,"");
  phone = phone.replace('+',"");
  reg = /\d+/g;
  result = phone.match(reg);
  phone = result[2];

  // tab with the informations for each restaurant
  var maitreRestaurateurs = [];

  // push the restaurant info
  maitreRestaurateurs.push({name, phone});

  return {maitreRestaurateurs};
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
module.exports.scrapeRestaurant = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
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
