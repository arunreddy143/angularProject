var app=angular.module('myApp',['facebook']);

app.config([
    'FacebookProvider',
    function(FacebookProvider) {
     var myAppId = '1061734093871129';
     
     // You can set appId with setApp method
     // FacebookProvider.setAppId('myAppId');
     
     /**
      * After setting appId you need to initialize the module.
      * You can pass the appId on the init method as a shortcut too.
      */
     FacebookProvider.init(myAppId);
     
    }
  ]);

app.factory('twitterService', function($q) {

    var authorizationResult = false;

    return {
        initialize: function() {
            //initialize OAuth.io with public key of the application
            OAuth.initialize('l43akv6Bi8QHabkUEdWfBuKiF', {
                cache: true
            });
            //try to create an authorization result when the page loads,
            // this means a returning user won't have to click the twitter button again
            authorizationResult = OAuth.create("twitter");
        },
        isReady: function() {
            return (authorizationResult);
        },
        connectTwitter: function() {
            var deferred = $q.defer();
            OAuth.popup("twitter", {
                cache: true
            }, function(error, result) {
                console.log(result)
                // cache means to execute the callback if the tokens are already present
                if (!error) {
                    authorizationResult = result;
                    deferred.resolve();
                } else {
                    //do something if there's an error

                }
            });
            return deferred.promise;
        },
        clearCache: function() {
            OAuth.clearCache('twitter');
            authorizationResult = false;
        },
        getLatestTweets: function(maxId) {
            //create a deferred object using Angular's $q service
            var deferred = $q.defer();
            var url = '/1.1/statuses/home_timeline.json';
            if (maxId) {
                url += '?max_id=' + maxId;
            }
            var promise = authorizationResult.get(url).done(function(data) {
                // https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
                // when the data is retrieved resolve the deferred object
                deferred.resolve(data);
            }).fail(function(err) {
                deferred.reject(err);
            });
            //return the promise of the deferred object
            return deferred.promise;
        }
    }
});

app.controller('oAuthController',['$scope','Facebook','$timeout','$q', 'twitterService',function($scope,Facebook,$timeout,$q, twitterService) {

    



    $scope.facebookLogin=function() {
        Facebook.login(function(response) {
            console.log(response);
          if (response.status == 'connected') {
            $scope.logged = true;
            $scope.me();
            
          }
        
        });
    };

     $scope.me = function() {
          Facebook.api('/me',{fields: 'first_name,last_name,birthday,gender,email,picture'}, function(response) {
            
            console.log(response);
            $scope.userResponse=response;
            /**
             * Using $scope.$apply since this happens outside angular framework.
             */
            $scope.$apply(function() {
              $scope.user = response;
            });
            
          });
        };



    //twitterService.initialize();
    $scope.twitterLogin=function() {
        console.log('twitter login');
        twitterService.connectTwitter().then(function(response) {
            console.log(response)
        });
    };
}]);