angular.module('starter.services', [])

.factory('Users', function($http, $ionicLoading, localStorageService){

    //console.log(isOnline());
    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner>'
    });
    if(localStorageService.get('userDetails') == null){

        $http.get('http://174.129.11.69/haiti/api/?action=activate&apikey=CAX4RYDJBUKM8BSYQEZP').then(function(res){

            localStorageService.set('userDetails', res);
            window.response = res;
            $ionicLoading.hide();
        });
        $http.get('http://174.129.11.69/haiti/api/?action=import&apikey=CAX4RYDJBUKM8BSYQEZP&id=1').then(function(res){

            localStorageService.set('QuestData', res);
            window.response = res;
            $ionicLoading.hide();
        });
        $http.get('http://174.129.11.69/haiti/api/?action=import&apikey=CAX4RYDJBUKM8BSYQEZP&id=2').then(function(res){

            localStorageService.set('indData', res);
            window.response = res;
            $ionicLoading.hide();
        });

        $http.get('http://174.129.11.69/haiti/api/?action=import&apikey=CAX4RYDJBUKM8BSYQEZP&id=4').then(function(res){

            localStorageService.set('StopData', res);
            window.response = res;
            $ionicLoading.hide();
        });
    }else{

        $ionicLoading.hide();
    }
    return {
      all: function(){
          if(localStorageService.get('userDetails') != null){

              var userdata = localStorageService.get('userDetails');
              var totalUsers = userdata.data.users.length;
              var users = userdata.data.users;
              return users;

          }else{

              var userdata = window.response;
              var totalUsers = userdata.data.users.length;
              var users = userdata.data.users;
              return users;
          }          
      },

      postSurvey: function(AllAnswers){

          $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
          $http({
              url: 'http://174.129.11.69/haiti/api/?action=export&apikey=CAX4RYDJBUKM8BSYQEZP',
              method: 'POST',
              data: 'data='+JSON.stringify(AllAnswers),
          }).then(function(response){

            console.log(response);

          },function(response){

          });
      },
    };
});

/*.factory('SurveyQuest', function($http, $ionicLoading, localStorageService){

    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner>'
    });
    if(localStorageService.get('QuestData') == null){

        $http.get('http://174.129.11.69/haiti/api/?action=import&apikey=CAX4RYDJBUKM8BSYQEZP&id=1').then(function(res){

            localStorageService.set('QuestData', res);
            window.response = res;
            $ionicLoading.hide();
        });
    }else{

        $ionicLoading.hide();
    }

    return {

        all: function(){
            if(localStorageService.get('QuestData')!=null){

                var questData = localStorageService.get('QuestData');
                //var users = userdata.data.users;
                return questData;
            }else{

                var questData = window.response;
                return questData;
            }
        }
    }
});*/
