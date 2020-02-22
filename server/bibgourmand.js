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
  var name = $('.section-main h2.restaurant-details__heading--title').text();
  name = name.replace('�',"").replace(/\s/g,"").replace('\'',"").replace(/[ùûü]/g,"u").replace(/[îï]/g,"i").replace(/[àâä]/g,"a").replace(/[ôö]/g,"o").replace(/[éèêë]/g,"e").replace(/ç/g,"c");
  name = name.toLocaleLowerCase();

  // phone number
  var phone = $('span.flex-fill').first().text();
  phone = phone.replace(/\s/g,"");
  phone = phone.replace('+',"");

  // tab with the informations for each restaurant
  var bib = [];

  // push the restaurant info
  bib.push({name, phone});




return {bib};
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
