
/* Dependencies */
var mongoose = require('mongoose'), 
    Listing = require('../models/listings.server.model.js'),
	bcrypt = require('bcrypt-nodejs'),
	Match = require('../models/matching.server.model.js');
	

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions, refer back to this tutorial 
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */
/*==================ALGORITHM================
exports.algorithm = function(req,res){

get mentee with -> req.session.passport.user
findOne to get mentee (see profile fucntion)

//find to get all mentees

loop through mentors check where usertype.mentor = true

comapre it if match

MatchSchema{
	mentee_id = req.session.passport.user
	mentor = get from query
	status = pending
}

var match = new Match();
match (set values)
match.save
};

===============================================*/

//do i need to implement a callback?? maybe 

/* Matching Algorithm */
exports.algorithm = function(req, res){
	console.log(">>>>>>>>>>>>got here");
  //variables
  var mentee;
  var users = [];
  var mentor;
  //var matchingMentorid;

  var isMatch = true;


  //get mentee
  Listing.findOne({_id : req.session.passport.user, "usertype.mentee" : true }, function(err, mentee) {
    if (err){
      res.status(400).send(err);
    };
	
  console.log("Mentee \n" + mentee);
	
	  //get ALL users
	Listing.find({"usertype.mentor": true, _id : { $ne: mentee._id}}, function(err, mentors) {
    if (err){
      res.status(400).send(err);
    };
    //users = listings;
	console.log("Mentors \n" + mentors);
	
	  //loop through users and find where usertype.mentor = true
  //also check to make sure it isn't our current mentee
  for(var userCount = 0; userCount < mentors.length; userCount++){
    //console.log("inside forloop");
    var user = mentors[userCount];
    //console.log("Mentors: \n" + user);
    
      //check and see if mentor is available 
      //if(mentor.available == true){
        //console.log("mentor is available");
          
        /* Begin Matching! */
        //check if mentee and mentor topics match
        var menteeTopic = mentee.mentee_topic;
        var mentorTopic = user.mentor_topic;
        if(menteeTopic.localeCompare(mentorTopic) != 0){
          isMatch = false;
        } else{
          //console.log("mentee and mentor topics match\n");
          isMatch = true;
          //put mentee hours in my variable so i can check its length
          var menteeHours = [];
          menteeHours = mentee.hours;
  
          var mentorHours = [];
          mentorHours = user.hours;
  
          var matchingHours = [];
          var falseCount = 0;
          var count = 0;
  
          //check for matching hours
          for(var i = 0; i < mentorHours.length; i++){
            for(var j = 0; j < menteeHours.length; j++){
              //var torHours = mentorHours[i];
              //var teeHours = menteeHours[j];
              //console.log("MentorHours length is: ", mentorHours.length);
              //console.log("MenteeHours length is: ", menteeHours.length);
              //menteeHours[j].localeCompare(mentorHours[i]) == 0
              if((Object.is(menteeHours[j], mentorHours[i])) == true){
                //console.log("mentee hours and mentor horus matched at this point");
                matchingHours[count] = true;
                //console.log("matchingHours now has ", matchingHours[count]);
                count++;
              } else{
                //console.log("no match");
                matchingHours[count] = false;
                count++;
              }
            }
          }
          //console.log("matchingHours: ", matchingHours);
          //count number of false in matchingHours
          //console.log("count number of false in matchingHours");
          for(var i = 0; i < matchingHours.length; i++){
            if(matchingHours[i] != true){
              falseCount++;
            }
          }
  
          //if all the matchingHours is false, then none of the times matched
          if(falseCount == matchingHours.length){
            isMatch = false;
          } else{
            isMatch = true;
          }
        }
  
        //check if match is still true then check for communication
        if(isMatch != false){
          
          var matchingComm = 0;;
          var falseComm = 0;
          var menteeComm = mentee.communication;
          var mentorComm = user.communication;

          //check matching communication
          for (var i = 0; i < menteeComm.length; i++) {
            for (var j = 0; j < mentorComm.length; j++) {
              //var teeComm = menteeComm[j];
              //var torComm = mentorComm[i];
              //(Object.is(menteeComm[j], mentorComm[i])) == true
              if ((Object.is(menteeComm[j], mentorComm[i])) == true) {
                //console.log("mentor and mentee comm matched at this point");
                //update what communications match with mentor and mentee
                //matchingComm[commCount] = true;
                matchingComm++;
                //falseComm++;
              }
            }
          }

          //check if false exists in matchingComm
          if(matchingComm >= 1){
            isMatch = true;
          } else{
            isMatch = false;
          }
        }
      //}
    

    //

    //thi what match schema looks like
    /* MatchSchema({
      mentee_id = req.session.passport.user;
      //mentor = get from query
      status = pending
    }); */
    
    //if mentor and mentee matches, update matchSchema
    if(isMatch == true){
    console.log("Got a match!");
    console.log("You", mentee.username, "matched with", user.username);
      var match = new Match();
      match.mentor_id = user._id;
      match.status = "pending"
      match.save(function(err){
        if (err){
          console.log(err);
          throw err;
        }
      });
    }
    
    
  }

	});

  });

  //get ALL users
  /*Listing.find({_id : req.session.passport.user }, function(err, listings) {
    if (err){
      res.status(400).send(err);
    };
    users = listings;
	


  });*/

  



};

/* Create a listing */
exports.create = function(req, res) {
	
  /* Instantiate a Listing */
	var listing = new Listing(req.body);
	//console.log(req.body);
	//add user name check
	Listing.findOneAndUpdate({_id : req.session.passport.user }, {$set:{username: listing.username, availaeble: true, mentor_topic: listing.mentor_topic, 
	mentee_topic: listing.mentee_topic, topic_level: listing.topic_level, hours: listing.hours, city: listing.city, communication: listing.communication, 
	add_info: listing.add_info}}, {new: true}, function(err,updated){
		if (err)
			res.status(400).send(err);
	   res.send();
	});
};

exports.profile = function(req,res){
	Listing.findOne({_id : req.session.passport.user }, { id: 0, local: 0, google:0 }, function(err,updated){
		if (err)
		res.status(400).send(err);
		//console.log(updated);
	   res.json(updated);
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
