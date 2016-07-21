// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','LocalStorageModule','angular-cache'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        $ionicPopup.confirm({
          title: 'No Internet Connection',
          content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
        })
        .then(function(result) {
          if(!result) {
            ionic.Platform.exitApp();
          }
        });
      }
    }
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.constant('config', {
      text_username: 'Non itilizatè',
      text_password: 'Modpas',
      text_login: 'Konektè',
      text_activate :'aktive',
    
      text_dashboard : 'Dashboard',
      text_startSuray : 'Nouvo kay la',
      text_surveyList : 'Lis kay yo ou deja komansè men poko fini avek yo',
      text_logout : 'Logout',
      text_survey : 'Survey',
      text_userLogin : 'User Login',
      text_next : 'Kontinye',
      text_stop: 'Kanpe ankèt la',
      text_prev: 'Retounen',
      text_stop_survey_title: 'Stop Survey',
      text_stop_survey_template: 'Eske ou si ou vle kanpe ankèt la?',
      text_survey_yes: 'Wi',
      text_survey_no: 'non',
      text_activate_success: 'Siksè',
      text_fill_error: 'Erè',
      text_wrong_user: 'Erè',
      text_signout_success: 'Sign out successfully',
      text_select_answer: 'Erè',
      text_survel_list: 'Survey List',
    })
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
      .state('logout', {
        url: '/logout',
        controller: 'LogoutCtrl'
      })
      .state('login', {
      	cache: false,
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('dashboard', {
      cache: false,
      url: '/dashboard',
      templateUrl: 'templates/tab-dashboard.html',
      controller: 'HomeCtrl'
    })
    .state('survey', {
	    url: '/survey/:survey/:qid',
	    templateUrl: 'templates/tab-dash.html',
	    controller: 'SurveyCtrl'
	  })
    .state('survey-list',{
    	cache: false,
		url:'/survey',
		templateUrl: 'templates/servey-list.html',
		controller: 'ServeyListCtrl'
    })
      
  // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
