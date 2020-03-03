/* eslint-disable no-console, no-process-exit */
const michelin = require('./bibgourmand');
const maitrerestaurateurs = require('./maitrerestaurateurs');

rechercheMr = 'https://www.maitresrestaurateurs.fr/annuaire/recherche';
rechercheBib = 'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/';
maitre = 'https://www.maitresrestaurateurs.fr/profil/396';
bib = 'https://guide.michelin.com/fr/fr/centre-val-de-loire/veuves/restaurant/l-auberge-de-la-croix-blanche';

var fs = require('fs');
//var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));



async function sandbox(searchLink = rechercheBib) {

  try {
    //////////////// MICHELIN ////////////////
    console.log(`🕵️‍♀️  browsing michelin source, please wait it can takes a while`);

    // get number of pages for michelin bib gourmand restaurants
    const nbpage = await michelin.scrapeFirstSearchPage('https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/');
    
    // get a list of the url of all bib gourmand restaurants
    var linksBibRestau = [];
    for(var i = 1; i <= nbpage; i++){
      const links = await michelin.scrapeASearchPage('https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/' + String(i));
      links.forEach(element => linksBibRestau.push('https://guide.michelin.com' + element));
    }

    // get a list of informations (name + phone) for all bib gourmand restaurants
    var listOfRestauDetails = [];  
    for(var i = 0; i < linksBibRestau.length; i++){
      console.log(i);
      const restaurant = await michelin.scrapeRestaurant(linksBibRestau[i]);
      listOfRestauDetails.push(restaurant);
    }

    // write data in a json file
    var fs = require('fs');
    fs.writeFileSync('./bibRestaurants.json', JSON.stringify(listOfRestauDetails, null, 4), (err) => {
      if (err) {
        console.error(err);
        return;
      };
      console.log("File has been created");
    });



    //////////////// MAITRE RESTAURATEURS ////////////////
    console.log(`🕵️‍♀️  browsing Maire Restaurateurs source, please wait it can takes a while`);

    // get the number of pages for Maitre Restaurateurs
    const nbpage2 = await maitrerestaurateurs.scrapeFirstSearchPage(1);

    // get a list of the url of all maitre restaurateurs restaurants
    var linksMrRestau = [];
    for(var i = 1; i <= nbpage2; i++)
    {
      const links = await maitrerestaurateurs.scrapeASearchPage(i);
      links.forEach(element => linksMrRestau.push(element));
    }

    // get a list of informations (name + phone) for all maitre restaurateurs restaurants
    var listOfMrRestauDetails = [];
    for(var i = 0; i < linksMrRestau.length; i++){ // change to length linkslist
      console.log(i);
      const restau = await maitrerestaurateurs.scrapeRestaurant(linksMrRestau[i]);
      listOfMrRestauDetails.push(restau);
    }

    // write data 
    var fs = require('fs');
    fs.writeFileSync('./maitresRestaurateurs.json', JSON.stringify(listOfMrRestauDetails, null, 4), (err) => {
      if (err) {
        console.error(err);
        return;
      };
      console.log("File has been created");
    });

    //////////////// Read the two json files created before and write two files with the restaurants which got both, one file when the phone number is the same, one when the phone number is different but the name and the city are the same ////////////////
    console.log(`🕵️‍♀️  Creating two json files of restaurants regarding to the same phone number and to the same city and name if different phone number`);
 
    var mrRestau = [];
    var bibRestau = [];

    try{
      var obj = JSON.parse(fs.readFileSync('maitresRestaurateurs.json', 'utf8'));
      obj.forEach(element => {
        mrRestau.push(element);
      });
      var obj2 = JSON.parse(fs.readFileSync('bibRestaurants.json', 'utf8'))
      obj2.forEach(element => {
        bibRestau.push(element);
      });
    } catch (e) {
      console.log("error");
    }
    
    var listOfPhone = [];
    var listOfNameCity = [];
    //var listOfName = [];

    for(var i = 0; i < bibRestau.length; i++){
      for(var j = 0; j < mrRestau.length; j++){
        if(bibRestau[i].phone == mrRestau[j].phone){
          var restau = {nameBib: bibRestau[i].name, nameMr: mrRestau[j].name, phone: bibRestau[i].phone,cityBib: bibRestau[i].city, cityMr: mrRestau[j].city};
          listOfPhone.push(restau);
        }
        else if(bibRestau[i].name == mrRestau[j].name && bibRestau[i].city == mrRestau[j].city){
          var restau = {name: bibRestau[i].name, phoneBib: bibRestau[i].phone, phoneMr: mrRestau[j].phone, city: bibRestau[i].city};
          listOfNameCity.push(restau);
        }
        /*
        else if(bibRestau[i].name == mrRestau[j].name)
        {
          var restau = {name: bibRestau[i].name, phoneBib: bibRestau[i].phone, phoneMr: mrRestau[j].phone, cityBib: bibRestau[i].city, cityMr: mrRestau[j].city};
          listOfName.push(restau);
        }
        */
      }
    }

    // list of restaurants where we can find the same phone number in the both list
    fs.writeFileSync('./listOfPhone.json', JSON.stringify(listOfPhone, null, 4), (err) => {
      if (err) {
        console.error(err);
        return;
      };
      console.log("File has been created");
    });

    // list of resturants where the name and the city is the same
    fs.writeFileSync('./listOfNameCity.json', JSON.stringify(listOfNameCity, null, 4), (err) => {
      if (err) {
        console.error(err);
        return;
      };
      console.log("File has been created");
    });

  /*
    // list of restaurants where the name is the same but not the city 
    fs.writeFileSync('./listOfName.json', JSON.stringify(listOfName, null, 4), (err) => {
      if (err) {
        console.error(err);
        return;
      };
      console.log("File has been created");
    });
*/
    process.exit(0);
  } catch (e) {
    console.error(e); 
    process.exit(1);
  }
}
const [, , searchLink] = process.argv;
sandbox(searchLink);
