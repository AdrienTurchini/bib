/* eslint-disable no-console, no-process-exit */
const michelin = require('./bibgourmand');

//const michelin = require('./maitrerestaurateurs')


testMR = 'https://www.maitresrestaurateurs.fr/annuaire/recherche';
maitre = 'https://www.maitresrestaurateurs.fr/profil/396';
bib = 'https://guide.michelin.com/fr/fr/centre-val-de-loire/veuves/restaurant/l-auberge-de-la-croix-blanche';


var fs = require('fs');
//var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));



async function sandbox (searchLink = bib) {
  
  try {
    console.log(`🕵️‍♀️  browsing ${searchLink} source`);
    const restaurant = await michelin.scrapeRestaurant(searchLink);
    
    
    var fs = require('fs');
    
    /*
    try{
      var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    } catch (e) {
      var obj = []
    }

    
 
    obj.push({
      restaurant
    })
*/
   
  

    
    fs.writeFileSync('./data.json', JSON.stringify(restaurant, null, 4), (err) => {
      if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
    });
  
    process.exit(0);
    
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, searchLink] = process.argv;

sandbox(searchLink);
