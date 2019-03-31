
/* Dependencies */
var mongoose = require('mongoose'), 
    Listing = require('../models/listings.server.model.js'),
	bcrypt = require('bcrypt-nodejs');

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions, refer back to this tutorial 
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */

/* Create a listing */
exports.signup = function(req, res) {
	
	console.log("GOT TO WRONG FUNCTION");

  /* Instantiate a Listing */
	var listing = new Listing(req.body);
	listing.password = bcrypt.hashSync(listing.password);
	

	//bcrypt.compareSync("my password", hash)); // true
  /* Then save the listing */
  Listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(listing);
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  res.json(req.listing);
};

/* Update a listing */
exports.update = function(req, res) {
  var listing = req.body;
  /** TODO **/
  /* Replace the article's properties with the new properties found in req.body */
  /* Save the article */
  var id = req.params.listingId;
	Listing.findOneAndUpdate({_id : id}, {$set:{code: listing.code, name: listing.name, latitude: listing.latitude, 
	longitude: listing.longitude, address: listing.address}}, {new: true}, function(err,updated){
		if (err)
			res.status(400).send(err);
	   res.json(updated);
	});
};

/* Delete a listing */
exports.delete = function(req, res) {
  var id = req.params.listingId;
  /** TODO **/
  /* Remove the article */
   Listing.deleteOne({_id: id}, function(err,listing){
	   if (err)
			res.status(400).send(err);
	   res.json(listing);
   });
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
  /** TODO **/
  /* Your code here */
   Listing.find({}, function(err,listing){
    if (err) throw err;
    res.json(listing);
   }).sort( { code: 1 } );

};

/* 
  Middleware: find a listing by its ID, then pass it to the next request handler. 

  Find the listing using a mongoose query, 
        bind it to the request object as the property 'listing', 
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.listing = listing;
      next();
    }
  });
};