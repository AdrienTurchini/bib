const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
// get the restaurants informations (name + phone)
const parse = data => {
  const $ = cheerio.load(data);

  // name
  var name = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5 > span:nth-child(1) > strong').text();
  name = name.toLocaleLowerCase();
  name = name.replace('�',"o").replace('ô','o').replace(/\s/g,"").replace('-',"").replace('-',"").replace('\'',"").replace('ö','o').replace('ù','u').replace('û','u').replace('ü','u').replace("î","i").replace("ï","i").replace("à","a").replace("â","a").replace("ä","a").replace("é","e").replace("è","e").replace("ê","e").replace("ë","e").replace("ç","c");

  // phone number
  var phone = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5').text();
  phone = phone.replace(/\s/g,"");
  phone = phone.replace('+',"");
  phone = phone.replace('.',"").replace('.',"").replace('.',"").replace('.',"");
  reg = /\d+/g;
  phone = phone.match(reg);
  try{
    if(phone[0].length == 10){
      phone = phone[0];
    }
    else if(phone[1].length == 10){
      phone = phone[1];
    }
    else if(phone[2].length == 10){
      phone = phone[2];
    }
    else {
      phone = "no phone";
    }
  }catch{
    phone = "no phone";
  }

  if(name == null || name == ""){
    name = "no name";
  }  

  // city
  var city = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5 > span:nth-child(3)').text();


  while(city[city.length-1] == ' ')
  {

    city = city.substring(0,city.length-1);
  }
  city = city.split(" ");
  city = city[city.length-1]
  city = city.replace(/\s/g,"");
  city = city.toLocaleLowerCase();
  city = city.replace('�',"o").replace('ô','o').replace(/\s/g,"").replace('-',"").replace('-',"").replace('\'',"").replace('ö','o').replace('ù','u').replace('û','u').replace('ü','u').replace("î","i").replace("ï","i").replace("à","a").replace("â","a").replace("ä","a").replace("é","e").replace("è","e").replace("ê","e").replace("ë","e").replace("ç","c");  
  
  return {name, phone, city};
};



// get the url for every restaurants of the page
const searchPage = data => {
  const $ = cheerio.load(data);
  var numbers = [];
  var links = [];
  $('body > div.col-md-9 > div.annuaire_result_list > div').each((i, elem)=>{
    numbers.push($(elem).attr("class"));
  });
  numbers.forEach(element => {
    reg = /\d+/g;
    result = element.match(reg);
    if(result != null){
      links.push("https://www.maitresrestaurateurs.fr/profil/" + result)
    }
  });
  return links;
}

// total numeber of restaurants 
const firstPage = data => {
  const $ = cheerio.load(data);
  var nbOfRestau = $('body > div.col-md-3.annuaire_sidebar > form.form_facet > div.filters-wrapper > div.filters-inner > div.row > div.col-md-12 > div.bloc_filters > div.filter_content > ul > li').text();
  reg = /\d+/g;
  result = nbOfRestau.match(reg);
  nbOfRestau = parseInt(result[0])
  nbOfPages = nbOfRestau / 10;
  nbOfPages = Math.ceil(nbOfPages)
  return nbOfPages;
}




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

module.exports.scrapeASearchPage = async page_nb => {
  var string_nb = String(page_nb);
    const response = await axios({
      method: 'post',
      url: 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult#',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: 'page='+string_nb+'&sort=undefined&request_id=20c7c49652f88dff6c582475fc96d990&annuaire_mode=standard'
    });
    const {data, status} = response;
    if (status >= 200 && status < 300) {
      return searchPage(data);
    }
    console.error(status);
    return null;
}

module.exports.scrapeFirstSearchPage = async page_nb => {
  var string_nb = String(page_nb);
    const response = await axios({
      method: 'post',
      url: 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult#',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: 'page='+string_nb+'&sort=undefined&request_id=20c7c49652f88dff6c582475fc96d990&annuaire_mode=standard'
    });
    const {data, status} = response;
    if (status >= 200 && status < 300) {
      return firstPage(data);
    }
    console.error(status);
    return null;
}

/**
 * Get all France located Maitre Restaurateurs restaurants
 * @return {Array} restaurants
 */
module.exports.get = () => {
  return [];
};
