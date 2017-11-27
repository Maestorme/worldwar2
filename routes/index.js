var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://heroku_s5cxwch8:gqdan5b2nmod3dfcd3dsjjtcuv@ds121696.mlab.com:21696/heroku_s5cxwch8';
//var url = 'mongodb://localhost:27017/wwii';
var menu = [];

router.get('/', function(req, res, next){
	res.render('home');
});
/* GET home page. */
router.get('/app', function(req, res, next) {
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
  			res.render('index', { title: 'The Map-zi Conquest' , items: menu1939});
  		});

  });
//res.render('index', { title: 'Express'});
 
});
router.get('/read/:toFind/:id', function(req, res, next){
	var sending = [];
	mongo.connect(url, function(err, db){
			if(err){
				res.send('Database failed to open');
			}

			var cursor = db.collection('data').find({type: req.params.toFind});
			
			cursor.forEach(function(doc, err){
				
  				if(doc.values.name == req.params.id){
  					
  					sending.push(doc)
  				}
  				
  				
  		}, function(){
  			db.close();
  			if(sending.length == 0){
  				console.log("Not found");
  				res.send("Not found");
  			}
  			else{
  				console.log(sending[0]);
  				res.send(sending[0]);
  			}
  		});

	});
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


});


router.post('/modify/:id', function(req, res, next){
	console.log(req.body);
	

	//FIND THE ITEM WITH THE NAME
	mongo.connect(url, function(err, db){
			if(err){
				res.send('Database failed to open');
			}
			var cursor = db.collection('data').update({_id: objectId(req.params.id)}, {$set: {values : req.body}});
			db.close();
			res.send("Success");
	});

});

router.post('/insert/:type', function(req, res, next){
	console.log(req.body);
	
	var item = {type: req.params.type, values: req.body};
	
	mongo.connect(url, function(err, db){
			if(err){
				res.send('Database failed to open');
			}
			db.collection('data').insertOne(item, function(err, result){
				console.log("Inserted");
				db.close();
				res.send("Inserted");
			});
			
	});

});

router.get('/marker/:lat/:lng', function(req, res, next){
	var marker_details = "";
	mongo.connect(url, function(err, db){
			if(err){
				res.send('Database failed to open');
			}
			var cursor = db.collection('data').find({"values.lat" : req.params.lat, "values.lng": req.params.lng});

			cursor.forEach(function(doc, err){
				console.log(doc.values.hashid);
				marker_details = doc.values.hashid;
			}, function(){
				db.close();
				res.send(marker_details);
			});
			
	});
});

module.exports = router;
