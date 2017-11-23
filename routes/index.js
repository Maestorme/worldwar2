var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/ww2';

var menu = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/zoom', function(req, res, next){
	var toFind = req; //FIND WHAT THIS IS!

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
  			
  				menu.push(doc);
  		}, function(){
  			db.close();
  			res.send(menu);
  		});
})
module.exports = router;
