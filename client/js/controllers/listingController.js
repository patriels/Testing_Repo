angular.module('listings').controller('ListingsController', ['$scope', '$window','Listings', 
  function($scope, $window, Listings) {
    $scope.Math = window.Math;
	
	$scope.errors = [];
	
	$scope.existingProfile = undefined;
	
	$scope.newProfile = undefined;
	
	$scope.comm = [];
	
	$scope.time = [];
	
	$scope.userProfile= undefined;
	
	$scope.changedProfile = undefined;
	
    $scope.ratings = [{
        current: 0,
        max: 5
    }];
	$scope.size = [1,2,3,4,5];
	
	$scope.rating ={
		username: String,
		matchname: String,
		rating: Number
	};
	
	$scope.displayRating = 5;
	
	
	$scope.signUp = function() {
		$scope.errors = [];
		
		if(!$scope.newProfile){
			$scope.errors.push("Please fill out the form below.");
		}else{
			if(!$scope.newProfile.username)
				$scope.errors.push("Please enter a username.");
			
			if(!$scope.newProfile.email)
				$scope.errors.push("Please enter an email.");

			if(!$scope.newProfile.emailCheck)
				$scope.errors.push("Please confirm your email.");
			
			if(!angular.equals($scope.newProfile.email,$scope.newProfile.emailCheck))
				$scope.errors.push("The emails you entered are different.");
			
			if(!$scope.newProfile.password)
				$scope.errors.push("Please enter a password.");

			if(!$scope.newProfile.password)
				$scope.errors.push("Please confirm your password.");
			
			if(!angular.equals($scope.newProfile.password,$scope.newProfile.passwordCheck))
				$scope.errors.push("The passwords you entered are different.");
			
			if(!$scope.newProfile.age)
				$scope.errors.push("Please enter your age.");
			
			if(!$scope.newProfile.gender)
				$scope.errors.push("Please enter your gender.");
			
			if(!$scope.newProfile.ethnicity)
				$scope.errors.push("Please enter your Ethinicty/Race.");
				
		}
			
		if($scope.errors.length > 0){
			console.log();
			return;
		}
	    Listings.signUp($scope.newProfile).then(function(response) {
		  $window.location.href = '/dashboard';
		}, function(error) {
		  
		  $scope.errors.push("Email or username is already in use.");
		});

    };

	$scope.googleRegister = function() {
		$scope.errors = [];
		
		if(!$scope.newProfile){
			$scope.errors.push("Please fill out the form below.");
		}else{
			if(!$scope.newProfile.username)
				$scope.errors.push("Please enter a username.");
			
			if(!$scope.newProfile.age)
				$scope.errors.push("Please enter your age.");
			
			if(!$scope.newProfile.gender)
				$scope.errors.push("Please enter your gender.");
			
			if(!$scope.newProfile.ethnicity)
				$scope.errors.push("Please enter your Ethinicty/Race.");
				
		}
			
		if($scope.errors.length > 0){
			console.log();
			return;
		}
    Listings.google($scope.newProfile).then(function(response) {
	  $window.location.href = '/dashboard';
    }, function(error) {
      
	  $scope.errors.push("Email or username is already in use.");
	  
	  //console.log('Unable to update listings:', error);
    });

    };
	
	
	$scope.login = function() {
		$scope.errors = [];
		
		if(!$scope.existingProfile){
			$scope.errors.push("Please enter an email and password");
		}else{
			if(!$scope.existingProfile.email)
				$scope.errors.push("Please enter an email.");
			
			if(!$scope.existingProfile.password)
				$scope.errors.push("Please enter a password.");
		}
			
		if($scope.errors.length > 0){
			return;
		}
	
    Listings.login($scope.existingProfile).then(function(response) {
		$scope.getMentors();
	  $window.location.href = '/dashboard';
    }, function(error) {
		$scope.errors.push("Email or password is wrong.");
      //console.log('Unable to update listings:', error);
	  
    });

    };
	
	$scope.addComm = function(e) {
		if(!$scope.comm){
			$scope.comm.push(e);
			return;
		}
		
		if($scope.comm.indexOf(e) == -1)
			$scope.comm.push(e);
		else
			$scope.comm.splice($scope.comm.indexOf(e),1);
	};
	
	$scope.addTime = function(e) {
		if(!$scope.time){
			$scope.time.push(e);
			return;
		}
		
		if($scope.time.indexOf(e) == -1)
			$scope.time.push(e);
		else
			$scope.time.splice($scope.time.indexOf(e),1);
	};
	
	$scope.profileUpdate = function() {
		
		//need to add validation
		$scope.errors = [];
		if(!$scope.userProfile){
			$scope.errors.push("Please fill out the required information.");
		}
		
		if(!$scope.userProfile.age)
			$scope.errors.push("Please enter an age.");

		if(!$scope.userProfile.gender)
			$scope.errors.push("Please select your gender information.");
		
		if(!$scope.userProfile.ethnicity)
			$scope.errors.push("Please select your ethnicity information.");
		
		if(!$scope.userProfile.age)
			$scope.userProfile.usertype.mentee = false;

		if(!$scope.userProfile.usertype.mentor)
			$scope.userProfile.usertype.mentor = false;
		
		if(!$scope.userProfile.usertype.mentee)
			$scope.userProfile.usertype.mentee = false;

		$scope.userProfile.communication = $scope.comm;
		
		$scope.userProfile.hours = $scope.time;
		if($scope.errors.length > 0)
			return;
			
		Listings.update($scope.userProfile).then(function(response) {
			if($scope.userProfile.usertype.mentee){
				Listings.algorithm().then(function(response) {
				  console.log("Updated matches.");
				  $window.location.href = '/profile';
				}, function(error) {
				  	$scope.errors.push("Error with algorithm.");
				});
			}else{
				$window.location.href = '/profile';
			}
			}, function(error) {
				$scope.errors.push("There was an error updating your profile.");
			  
			});

    };
	
	$scope.profileLoad = function() {
		$scope.errors = [];
		Listings.profile().then(function(response) {
			$scope.userProfile = response.data;
			if(!$scope.userProfile.username){
				$window.location.href = '/google';
			}
			$scope.comm = $scope.userProfile.communication;
			$scope.time = $scope.userProfile.hours;
			$scope.rating.username = $scope.userProfile.username;
			if($scope.userProfile.curr_rating){
				if($scope.userProfile.ratings.length > 5)
					$scope.displayRating = Math.floor($scope.userProfile.curr_rating);
			}
			console.log("rating " + $scope.userProfile.curr_rating);
		}, function(error) {
			$scope.errors.push("There was an error loading your profile.");
		});

    };
	
	$scope.getSignUp = function(){
		$window.location.href = '/signup.html';
	};
	
		
	$scope.getSelectedRating = function (newRating, username, matchname) {
		$scope.rating.rating = newRating;
		$scope.rating.username = username;
		$scope.rating.matchname = matchname;
		console.log($scope.rating);
		Listings.rating($scope.rating).then(function(response) {
			console.log(response);
		}, function(error) {
			$scope.errors.push("There was an error saving your rating.");
		});
	};
	
	$scope.viewOtherUser = function(username, matchStat){
		$scope.errors = [];
		Listings.getProfile(username).then(function(response) {
			//console.log(response);
			response.data.status = matchStat;
			Listings.viewProfile(response.data).then(function(){
				$window.location.href = '/viewprofile';
			});
		}, function(error) {
			$scope.errors.push("There was an error getting mentor/mentee.");
		});
	}
	
	$scope.getMentors = function(){
		Listings.profile().then(function(response) {
			$scope.userProfile = response.data;
			if(!$scope.userProfile.usertype.mentee){
				$scope.errors.push("You're not registered as a mentee. Update your profile and try again.");
			}else{
				Listings.algorithm().then(function(response) {
					Listings.mentors().then(function(response) {
						console.log(response);
						$scope.mentors = response.data;
					}, function(error) {
						$scope.errors.push("There was an error loading your mentors.");
					});
				}, function(error) {
					$scope.errors.push("There was an error loading your mentors.");
				});
			}
		}, function(error) {
			$scope.errors.push("There was an error loading your profile.");
		});
	}
	
	$scope.getMentees = function(){
		$scope.errors = [];
		Listings.profile().then(function(response) {
			$scope.userProfile = response.data;
			if(!$scope.userProfile.usertype.mentor){
				$scope.errors = [];
				$scope.errors.push("You're not registered as a mentor. Update your profile and try again.");
			}else{
				Listings.mentees().then(function(response) {
					console.log(response);
					$scope.mentees = response.data;
				}, function(error) {
					$scope.errors.push("There was an error loading your mentees.");
				});
			}
		}, function(error) {
			$scope.errors.push("There was an error loading your profile.");
		});
		
	}

	$scope.getMatches = function(){
		$scope.errors = [];
		Listings.profile().then(function(response) {
			$scope.userProfile = response.data;
			$scope.errors = [];
			if(!$scope.userProfile.usertype.mentee){
				$scope.errors.push("You're not registered as a mentee. Update your profile and try again.");
			}else{
				Listings.matches().then(function(response) {
					console.log(response);
					$scope.matches = response.data;
				}, function(error) {
					$scope.errors.push("There was an error loading your mentors.");
				});
			}
		}, function(error) {
			$scope.errors.push("There was an error loading your profile.");
		});
		
	}
  
  	$scope.makeRequest = function(id){
		$scope.errors = [];
		Listings.makeRequest({'id': id}).then(function(response) {
			$window.location.href = '/mentors';
		}, function(error) {
			$scope.errors.push("There was an error making your request.");
		});
		
	}
	
  	$scope.acceptRequest = function(id){
		$scope.errors = [];
		Listings.acceptRequest({'id': id}).then(function(response) {
			$window.location.href = '/mentees';
		}, function(error) {
			$scope.errors.push("There was an error accepting your request.");
		});
		
	}
	
  	$scope.rejectRequest = function(id){
		$scope.errors = [];
		Listings.rejectRequest({'id': id}).then(function(response) {
			$window.location.href = '/mentees';
		}, function(error) {
			$scope.errors.push("There was an error accepting your request.");
		});
		
	}
	  
  }
]);

/*-------------------http://embed.plnkr.co/1esaGq/----------*/
angular.module('listings').directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});