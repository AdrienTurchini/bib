

const axios = require('axios');
const cheerio = require('cheerio');

module.export = async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

function start(url){
	return fetchHTML(url);
}

const $ = await module.export("https://guide.michelin.com/fr/fr/restaurants/bib-gourmand");

// Print the full HTML
console.log(`Site HTML: ${$.html()}\n\n`);

// Print some specific page content
console.log(`First h1 tag: ${$('h1').text()}`);