var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/wwii';

var menu = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/zoom/:type', function(req, res, next){
	menu.splice(0, menu.length);
	//console.log(req);
	console.log("Hello dude");
	console.log(req.params.type);

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
  		db.collection('data').insert({type: 'spots', values: {name: "Hitler's House", desc: "Lorum ipsum", country: "Germany"}});
  		db.collection('data').insert({type: 'spots', values: {name: "Anne's House", desc: "Lorum ipsum", country: "Germany"}});
  		db.collection('data').insert({type: 'events', values: {name: "Poland Invasion", desc: "Lorum lorum", country: "Poland"}});
  		db.collection('data').insert({type: 'events', values: {name: "France Invasion", desc: "Lorum lorum", country: "France"}});
  		db.close();
  	});*/

});
module.exports = router;
