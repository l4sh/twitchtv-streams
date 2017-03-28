const twitch = {
  api: {
    url: 'https://wind-bow.glitch.me/twitch-api',
    routes: {
      users: '/users/',
      channels: '/channels/',
      streams: '/streams/'
    }
  },
  users: ['freecodecamp', 'pokemon', 'playhearthstone', 'scglive', 'vainglory',
    'beyondthesummit', 'geekygoonsquad', 'tru3ta1ent', 'orzanel',
    'widgitybear', 'rendhammertv', 'ninja', 'lirik', 'cohhcarnage',
    'firedragon764', 'atk', 'teamsp00ky', 'eddieruckus',
    'themexicanrunner', 'utorak007', 'aydren', 'relicentertainment',
    'kakeninja', 'tangentgaming', 'ign', 'elajjaz', 'ESL_SC2',
    'OgamingSC2', 'cretetion', 'comster404', 'storbeck', 'habathcx',
    'RobotCaleb', 'noobs2ninjas', 'brunofin', 'PokerStarsSpain'
  ]
};

///twitch.users = ['Thasselhof', 'freecodecamp'];

var twitchViewer = angular
  .module('twitchViewer', ['ngResource'])

/** Filters **/
.filter('trustAsResourceUrl', ['$sce', trustAsResourceUrl])

/** Factories **/
.factory('User', ['$resource', apiGet('users')])
  .factory('Stream', ['$resource', apiGet('streams')])
  .factory('UserWithStream', ['User', 'Stream', UserWithStream])

/** Directives **/
.directive('expand', [expand])

/** Controllers **/
.controller('UserListController', ['UserWithStream', 'User', UserListController])
  .controller('ExpandController', [ExpandController]);
/**  ----  **/

/**
 * Trust URL as resource filter
 */
function trustAsResourceUrl($sce) {
  return function(val) {
    return $sce.trustAsResourceUrl(val);
  };
}

/**
 * Get user resource from API
 */
function apiGet(apiRoute) {
  // Return function to be used as factory
  return function($resource) {
    return $resource(
      twitch.api.url + twitch.api.routes[apiRoute] + ':userId', {
        userId: '@id'
      });
  };
}

/**
 * Get and combine user and stream information
 */
function UserWithStream(User, Stream) {

  return {
    get: function(params) {

      var user;
      return User

        .get({
        userId: params.userId
      })

      // Get stream
      .$promise.then(function(userInfo) {
        user = userInfo;
        return Stream
          .get({
            userId: params.userId
          })

        // Add stream to User object
        .$promise.then(function(streamInfo) {
          user.stream = streamInfo.stream;
          return user;
        });
      });
    }
  };
}

/**
 * User list controller
 */
function UserListController(UserWithStream, User) {

  var userlist = this;
  userlist.users = [];

  populateUserList();

  function populateUserList() {
    twitch.users.map(function(userId) {
      UserWithStream.get({
        userId: userId
      }).then(function(userInfo) {
        userlist.users.push(userInfo);
      });
    });
  }
};

/**
 * Expand directive
 */
function expand() {

  var template = '<div class="ng-expand" ng-show="show">' +
    '<div class="expand" ng-show="show">' +
    '<div ng-transclude></div>' +
    '</div></div>';

  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true,
    transclude: true,
    template: template
  };
}

/**
 * Modal controller
 */
function ExpandController() {
  var expand = this;
  expand.shown = false;
  expand.toggle = function() {
    console.log('toggle');
    this.shown = !this.shown;
  };
}