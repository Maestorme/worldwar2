var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/wwii';

var menu = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  menu.splice(0, menu.length);

  mongo.connect(url, function(err, db){
			if(err){
				res.send('Database failed to open');
			}

			var cursor = db.collection('data').find({type: 'events'});

			cursor.forEach(function(doc, err){
				
  				if(err){
  					db.close();
  					res.send('Failed to get data');
  				}
  				
  				menu.push(doc.values);
  		}, function(){
  			db.close();
  			var menu1939 = [];
  			for(var i = 0; i < menu.length; i++){
  				if(menu[i].year == 1939){
  					menu[i].path = '#'+(menu[i].name).replace(/\s+/g, '').replace(/\'+/g, '');
  					menu[i].hashid = menu[i].name.replace(/\s+/g, '').replace(/\'+/g, '');
  					menu1939.push(menu[i]);
  				}
  			}
  			res.render('index', { title: 'Express' , items: menu1939});
  		});

  });
//res.render('index', { title: 'Express'});
 
});

router.get('/zoom/:type', function(req, res, next){
	menu.splice(0, menu.length);


	var toFind = req.params.type; //FIND WHAT THIS IS!

	mongo.connect(url, function(err, db){
			if(err){
				res.send('Database failed to open');
			}

			var cursor = db.collection('data').find({type: toFind});

			cursor.forEach(function(doc, err){
				
  				if(err){
  					db.close();
  					res.send('Failed to get data');
  				}
  				
  				menu.push(doc.values);
  		}, function(){
  			db.close();
  			res.send(menu);
  		});

	});
  	/*mongo.connect(url, function(err, db){
  		db.collection('data').insert({type: 'spots', values: {name: "Dachau Concentration Camp", iconurl: "images/icons/dachau.jpg", imgurl: "images/dachau.jpg", desc: "Dachau concentration camp was the first of the Nazi concentration camps opened in Germany, intended to hold political prisoners. It is located on the grounds of an abandoned munitions factory northeast of the medieval town of Dachau, about 16 km (10 mi) northwest of Munich in the state of Bavaria, in southern Germany. Opened in 1939 by Heinrich Himmler, its purpose was enlarged to include forced labor, and eventually, the imprisonment of Jews, German and Austrian criminals, and eventually foreign nationals from countries that Germany occupied or invaded.", country: "Germany", year: '1939'}});
  		db.collection('data').insert({type: 'spots', values: {name: "Nanjing Massacre", iconurl: "images/icons/nanjing.jpg", imgurl: "images/nanjing.jpg", desc: "The Nanking Massacre was an episode of mass murder and mass rape committed by Japanese troops against the residents of Nanjing. The massacre occurred over a period of six weeks starting on December 13, 1938, the day that the Japanese captured Nanjing. During this period, soldiers of the Imperial Japanese Army murdered Chinese civilians and disarmed combatants who numbered an estimated 40,000 to over 300,000, and perpetrated widespread rape and looting.", country: "China", year: '1939'}});
  		db.collection('data').insert({type: 'events', values: {name: "Poland Invasion", iconurl: "images/icons/polinv.jpg", imgurl: "images/polinv.jpg", desc: "The Invasion of Poland, known in Poland as the September Campaign or the 1939 Defensive War, and in Germany as the Poland Campaign or Fall Weiss, was a joint invasion of Poland by Nazi Germany, the Soviet Union, the Free City of Danzig, and a small Slovak contingent, that marked the beginning of World War II. The German invasion began on 1 September 1939, one week after the signing of the Molotov–Ribbentrop Pact, while the Soviet invasion commenced on 17 September following the Molotov-Tōgō agreement that terminated the Russian and Japanese hostilities in the east on 16 September.", country: "Poland", year: '1939'}});

  		db.collection('data').insert({type: 'spots', values: {name: "Auschwitz Concentration Camp", iconurl: "images/icons/auschwitz.jpg", imgurl: "images/auschwitz.jpg", desc: "Lorum lorum", country: "France", year: '1940'}});
  		db.collection('data').insert({type: 'spots', values: {name: "Warshaw Ghetto", iconurl: "images/icons/warshaw.jpg", imgurl: "images/warshaw.jpg", desc: "Lorum lorum", country: "France", year: '1940'}});
  		db.collection('data').insert({type: 'events', values: {name: "Dunkirk Evacuation", iconurl: "images/dunkirk.jpg", imgurl: "images/dunkirk.jpg", desc: "Lorum lorum", country: "France", year: '1940'}});

  		db.collection('data').insert({type: 'spots', values: {name: "Fort Vallorbe", iconurl: "images/icons/vallorbe.jpg", imgurl: "images/vallorbe.jpg", desc: "Lorum lorum", country: "France", year: '1941'}});
  		db.collection('data').insert({type: 'spots', values: {name: "Krakow Ghetto", iconurl: "images/icons/krakow.jpg", imgurl: "images/krakow.jpg", desc: "Lorum lorum", country: "France", year: '1941'}});
  		db.collection('data').insert({type: 'events', values: {name: "Pearl Harbor Attack", iconurl: "images/icons/pearlharbor.jpg", imgurl: "images/pearlharbor.jpg", desc: "Lorum lorum", country: "France", year: '1941'}});

  		db.close();
  	});*/

});
module.exports = router;
