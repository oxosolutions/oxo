(function(){
  "use strict";
angular.module('starter.controllers', ['ionMDRipple'])

.directive('dynamicElement', ['$compile', function ($compile) {
      return { 
        restrict: 'E',
        scope: {
            message: "="
        },
        replace: true,
        link: function(scope, element, attrs) {
            var template = $compile(scope.message)(scope);
            element.replaceWith(template);               
        },
        controller: function($scope) {
           $scope.assignId = function(item){

                $scope.$parent.qid = item.currentTarget.getAttribute("data-id");
                
                console.log(item.currentTarget.getAttribute("data-id"));
           };

           $scope.selectChange = function(item){

              $scope.$parent.qid = item;
           };
        }
      }
  }])

.directive('pressEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.pressEnter);
                });
                event.preventDefault();
            }
        });
    };
})

.controller('SurveyCtrl', function($scope, $state, $stateParams, $sce, localStorageService, config, $ionicHistory, $rootScope, $ionicLoading, $ionicPopup, $filter, $compile, Users) {

    $scope.nxt =  config.text_next;
    $scope.prev = config.text_prev;
    $scope.stop = config.text_stop;
    $scope.logout = config.text_logout;
    //console.log(AllAnswers);
    //var QuestData = SurveyQuest.all();
    if($state.params.survey == 1){

        var QuestData = localStorageService.get('QuestData');
    }else{

        var QuestData = localStorageService.get('indData');
    }
    console.log(QuestData);
    if($state.params.qid == ''){

        var questionOrder = 1;
        window.AllAnswers = {};
        window.SurveyLists = {};
    }else{

        var questionOrder = $state.params.qid;
    }
    //console.log(QuestData.data[paramQid]);
    //console.log(QuestData);
    //console.log(QuestData.data.length);
    var paramQid;
    var QuestionID;
    var QuestionKey;
    var validation;
    var pattern;
    var matchWith;
    var QuestionStatus;
    angular.forEach(QuestData.data, function(value, key) {
        if(value.question_order == questionOrder){

            paramQid = key;
            QuestionID = value.question_id;
            QuestionKey = value.question_key;
            validation = value.validations;
            pattern = value.pattern;
            matchWith = value.match_with;
        }
        //console.log(value.question_order+' '+key);
    });
    console.log(paramQid);
    console.log(QuestData.data);
    //console.log(AllAnswers);
    var types;
    var inputHidden = '<input type="text" name="other" value="" class="textOther" style="display:none;" />';
    switch(QuestData.data[paramQid].question_type){

        case'radio':
        var radioLength = QuestData.data[paramQid].answers.length;
        types = 'radio';
        var finalAnswers = '';
        for(var i = 0; i < radioLength; i++){

            finalAnswers+= '<label><input type="radio" ion-ripple ng-click="assignId($event)" class="radio_answer" name="<radio_answer></radio_answer>"  data-id="'+QuestData.data[paramQid].answers[i].option_next+'" status="'+QuestData.data[paramQid].answers[i].option_status+'" value="'+QuestData.data[paramQid].answers[i].option_value+'" /> '+QuestData.data[paramQid].answers[i].option_text+'</label>';
        }
        $scope.htmlString = finalAnswers;
        var date = new Date();
        var data = QuestData.data[paramQid].question_text;
        var month = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
        data = data.replace(/\[(.+?)\]]/g, month[date.getMonth()]+', '+(date.getFullYear()-1));
        $scope.question = data;
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;
        
        case'select':
        var selectLength = QuestData.data[paramQid].answers.length;
        types = 'select';
        var finalAnswers = '<select ng-change="selectChange('+QuestData.data[paramQid].answers[1].option_next+')" ng-model="product" class="select_answer">';
        for(var i = 1; i<selectLength; i++){
            
            finalAnswers+= '<option value="'+QuestData.data[paramQid].answers[i].option_value+'">'+QuestData.data[paramQid].answers[i].option_text+'</option>';
        }
        finalAnswers+='</select>';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'text':
        types = 'text';
        finalAnswers = '<input type="text" name="" ng-model="text_answer" class="text_answer" value="" ng-click="assignId($event)" style="border:1px solid #000;" data-id="'+QuestData.data[paramQid].answers[0].option_next+'" />';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'number':
        types = 'number';
        finalAnswers = '<input type="number" name="" ng-model="number_answer" class="number_answer" min="'+QuestData.data[paramQid].min+'" max="'+QuestData.data[paramQid].max+'" value="" ng-click="assignId($event)" data-id="'+QuestData.data[paramQid].answers[0].option_next+'" style="border:1px solid #000;" />';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'textarea':
        types = 'textarea';
        finalAnswers = '<textarea style="border: 1px solid #000;" class="textare_answer" ng-click="assignId($event)" data-id="'+QuestData.data[paramQid].answers[0].option_next+'"></textarea>';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'hh_profile':
        finalAnswers = '<textarea style="border: 1px solid #000;"></textarea>';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'message':
        types = 'message';
        finalAnswers = '';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        
        var data = QuestData.data[paramQid].question_desc;
        
        // var words = data.match(/\[(.+?)\]]/g);
        
        var pattren = data.match(/\[(.+?)\]]/g);

        if(pattren != null){

            if(pattren.length > 0){
                  var replaceWithAnswer = AllAnswers;
                  var words = data.match(/[\w]+(?=])/g);
                  for(var i = 0; i<words.length; i++){
                      var r = words[i];

                      console.log(r);
                      if(replaceWithAnswer[r] !== undefined){
                          var reg = new RegExp('\\[\\[qid:' + r +'\\]\\]');
                          data = data.replace(reg, replaceWithAnswer[r].answer);
                      }else{
                          var reg = new RegExp('\\[\\[qid:' + r +'\\]\\]');
                          data = data.replace(reg, '');
                      }
                  }
                  
                 $scope.description = $sce.trustAsHtml(data);
            }

        }else{

            $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        }
        $scope.qid=QuestData.data[paramQid].answers[0].option_next;
      
        break;

        case'checkbox':
        types = 'checkbox';
        var checkboxLength = QuestData.data[paramQid].answers.length;
        
        var finalAnswers = '';
        for(var i = 0; i < checkboxLength; i++){

            finalAnswers+= '<label><input type="checkbox" ng-click="assignId($event)" data-id="'+QuestData.data[paramQid].answers[i].option_next+'" name="'+QuestData.data[paramQid].question_id+'" value="'+QuestData.data[paramQid].answers[i].option_value+'" /> '+QuestData.data[paramQid].answers[i].option_text+'</label>';
        }
        if(QuestData.data[paramQid].others == 1){
            finalAnswers+= '<label><input type="checkbox" name="other_check" value="66" /> Lòt-di kisa</label>';
            finalAnswers+= inputHidden;
        }
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        
        break;

        case'hh_person':
        finalAnswers = '';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'hh_children':
        finalAnswers = '';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'number_number':
        finalAnswers = '<input type="text" name="" value="" style="border:1px solid #000;" />';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'repeater':
        types = 'repeater';
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        var subFields = QuestData.data[paramQid].sub_fields;
        var HtmlContentForRepeater = '<div class="appnd"><div style="border:1px solid #000; margin-top:3%;" class="cloneDiv">';
        HtmlContentForRepeater+= '<a href="javascript:;" style="float:right;margin-right:2%; font-size:18px;text-decoration:none;" class="deleteRep">X</a>';
        var radioNameGroup = 1;
        var inc = 1;
        console.log(subFields);
        if(QuestionID == 'hid_140'){

                angular.forEach(subFields, function(value, key){

                switch(value.question_type){

                    case'text':
                      HtmlContentForRepeater+= '<div>';
                      HtmlContentForRepeater+= '<p>'+value.question_text+'</p>';
                      HtmlContentForRepeater+= '<input type="text" class="text_repeater_answer" style="border:1px solid #000;" />';
                      HtmlContentForRepeater+= '</div>';
                      break;

                    case'radio':
                      HtmlContentForRepeater+= '<div>';
                      var totalRadioAnswers = value.answers.length;
                      if(inc == 2){

                          HtmlContentForRepeater+= '<p>'+value.question_text+'</p>';
                      }else{

                          HtmlContentForRepeater+= '<p style="display:none;" class="radioText">'+value.question_text+'</p>';
                      }
                      for(var i = 0; i<totalRadioAnswers; i++){

                          if(inc == 2){
                              
                              HtmlContentForRepeater+= '<label><input type="radio" name="gender" class="genderSelection" value="'+value.answers[i].option_value+'" /> '+value.answers[i].option_text+'</label>';
                          }else{
                              
                              HtmlContentForRepeater+= '<label style="display:none;" class="disHideRadio"><input type="radio" name="rep_radio'+radioNameGroup+'" value="'+value.answers[i].option_value+'" /> '+value.answers[i].option_text+'</label>';
                          }
                      }
                      HtmlContentForRepeater+= '</div>';
                      break;

                    case'number':
                      HtmlContentForRepeater+= '<div style="display:none;" class="numberAge">';
                      HtmlContentForRepeater+= '<p>'+value.question_text+'</p>';
                      HtmlContentForRepeater+= '<p>'+value.question_desc+'</p>';
                      HtmlContentForRepeater+= '<input type="text" name="number_answer" value="" style="border:1px solid #000;" />';
                      HtmlContentForRepeater+= '</div>';
                    break;
                }

                radioNameGroup++;
                inc++;
            });
            HtmlContentForRepeater+= '</div></div>';
            HtmlContentForRepeater+='<button class="button button-positive ng-binding createClone" style="margin-top:2%;">Add More</button>'
            $scope.htmlString = $compile(HtmlContentForRepeater)($scope);
            $scope.qid = QuestData.data[paramQid].sub_fields[0].answers[0].option_next;

        }else{

            angular.forEach(subFields, function(value, key){

                switch(value.question_type){

                    case'text':
                      HtmlContentForRepeater+= '<div>';
                      HtmlContentForRepeater+= '<p>'+value.question_text+'</p>';
                      HtmlContentForRepeater+= '<input type="text" class="text_repeater_answer" style="border:1px solid #000;" />';
                      HtmlContentForRepeater+= '</div>';
                      break;

                    case'radio':
                      HtmlContentForRepeater+= '<div>';
                      HtmlContentForRepeater+= '<p>'+value.question_text+'</p>';
                      var totalRadioAnswers = value.answers.length;
                      for(var i = 0; i<totalRadioAnswers; i++){

                          HtmlContentForRepeater+= '<label><input type="radio" name="rep_radio'+radioNameGroup+'" value="'+value.answers[i].option_value+'" /> '+value.answers[i].option_text+'</label>';
                      }
                      HtmlContentForRepeater+= '</div>';
                      break;

                    case'number':
                      HtmlContentForRepeater+= '<div>';
                      HtmlContentForRepeater+= '<p>'+value.question_text+'</p>';
                      HtmlContentForRepeater+= '<p>'+value.question_desc+'</p>';
                      HtmlContentForRepeater+= '<input type="text" name="number_answer" value="" style="border:1px solid #000;" />';
                      HtmlContentForRepeater+= '</div>';
                    break;
                }

                radioNameGroup++;
            });
            HtmlContentForRepeater+= '</div></div>';
            HtmlContentForRepeater+='<button class="button button-positive ng-binding createClone" style="margin-top:2%;">Add More</button>'
            $scope.htmlString = $compile(HtmlContentForRepeater)($scope);
            $scope.qid = QuestData.data[paramQid].sub_fields[0].answers[0].option_next;
        }
        //console.log(subFields);
        break;

        case'group':
          types = 'group';
          $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
          $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
          var subFields = QuestData.data[paramQid].sub_fields;
          var HtmlContentForGroup = '';
          var radioNameGroup = 1;
          var inc = 1;
          console.log(subFields);
          angular.forEach(subFields, function(value, key){

                switch(value.question_type){

                    case'month':
                      HtmlContentForGroup+= '<p>'+value.question_text+'</p>';
                      HtmlContentForGroup+= '<select name="month">';
                      for(var i = value.min; i<=value.max; i++){

                          HtmlContentForGroup+= '<option value="'+i+'">'+i+'</option>';
                      }
                      HtmlContentForGroup+='</select>'
                    break;

                    case'year':
                        HtmlContentForGroup+= '<p>'+value.question_text+'</p>';
                        HtmlContentForGroup+= '<select name="year">';
                        for(var i = value.max; i>=value.min; i--){

                            HtmlContentForGroup+= '<option value="'+i+'">'+i+'</option>';
                        }
                        HtmlContentForGroup+='</select>'
                    break;
                }

                radioNameGroup++;
            });
            
            $scope.htmlString = $compile(HtmlContentForGroup)($scope);
            $scope.qid = QuestData.data[paramQid].sub_fields[0].answers[0].option_next;
        break;

    }

    $scope.next = function(qid){

        if($scope.$$childHead.qid == 0){

            localStorageService.set('surveyResultFinal',AllAnswers);
            $state.go('dashboard');
            return false;
        }

        if($scope.$$childHead.qid === undefined && types != 'message' && types !='repeater' && types != 'checkbox'){

            $ionicLoading.show({ template: config.text_select_answer, noBackdrop: true, duration: 2000 });
            
        }else{

            $(function(){
            
                switch(types){

                    case'radio':
                      var OneAnswer = {};
                      OneAnswer['question_id'] = QuestionID;
                      OneAnswer['question_key']=QuestionKey;
                      OneAnswer['answer'] = $('.radio_answer:checked').val();
                      OneAnswer['status'] = $('.radio_answer:checked').attr('status');
                      AllAnswers[QuestionID] = OneAnswer;
                      //localStorageService.set('answer',$('.radio_answer:checked').val());
                      console.log(AllAnswers);
                    break;

                    case'select':
                      var OneAnswer = {};
                      OneAnswer['question_id'] = QuestionID;
                      OneAnswer['question_key']=QuestionKey; 
                      OneAnswer['answer'] = $('.select_answer').val();
                      AllAnswers[QuestionID] = OneAnswer;
                      console.log(AllAnswers);
                    break;

                    case'text':
                      if($scope.$$childHead.$$childHead.text_answer !== undefined){

                          var textValue = $scope.$$childHead.$$childHead.text_answer;
                          console.log(textValue);
                          
                          if(validation != '' && validation == 'pattern'){
                            
                              if(textValue.match(pattern)){
                                  if(matchWith!=''){

                                      var matchedQids = matchWith.match(/[^\[\]]+(?=])/g);
                                      if(AllAnswers[matchedQids[0]].answer == textValue){

                                          var OneAnswer = {};
                                          OneAnswer['question_id'] = QuestionID;
                                          OneAnswer['question_key'] = QuestionKey;
                                          OneAnswer['answer'] = $scope.$$childHead.$$childHead.text_answer;
                                          AllAnswers[QuestionID] = OneAnswer;
                                          console.log(AllAnswers);
                                      }else{

                                          $ionicLoading.show({ template: 'Latitude Not matched!', noBackdrop: true, duration: 2000 });
                                          return false;
                                      }
                                  }else{

                                      console.log('after match pattern');
                                      var OneAnswer = {};
                                      OneAnswer['question_id'] = QuestionID;
                                      OneAnswer['question_key'] = QuestionKey;
                                      OneAnswer['answer'] = $scope.$$childHead.$$childHead.text_answer;
                                      AllAnswers[QuestionID] = OneAnswer;
                                      console.log(AllAnswers);
                                  }

                              }else{

                                  $ionicLoading.show({ template: 'Please enter correct value', noBackdrop: true, duration: 2000 });
                                  return false;
                              }
                          }else{

                              var OneAnswer = {};
                              OneAnswer['question_id'] = QuestionID;
                              OneAnswer['question_key'] = QuestionKey;
                              OneAnswer['answer'] = $('.text_answer').val();
                              AllAnswers[QuestionID] = OneAnswer;
                              console.log(AllAnswers);
                          }
                      }else{

                          $ionicLoading.show({ template: 'Please enter the value', noBackdrop: true, duration: 2000 });
                          return false;
                      }
                    break;

                    case'number':
                      if($('.number_answer:last').val() <= Number($('.number_answer:last').attr('max')) && $('.number_answer:last').val() >= Number($('.number_answer:last').attr('min'))){
                          if(matchWith!=''){
							  
							  console.log(" = = = " + $('.number_answer:last').val());

                              //var matchedQids = matchWith.match(/[^\[\]]+(?=])/g);
                              //if(AllAnswers[matchWith].answer == $('.number_answer:last').val()){
                              if(1){
                                    var OneAnswer = {};
                                    OneAnswer['question_id'] = QuestionID;
                                    OneAnswer['question_key'] = QuestionKey;
                                    OneAnswer['answer'] = $('.number_answer').val();
                                    AllAnswers[QuestionID] = OneAnswer;
                                    console.log(AllAnswers);
                              }else{

                                  $ionicLoading.show({ template: 'Ere! 241', noBackdrop: true, duration: 1000 });
                                  return false;
                              }
                          }else{

                              var OneAnswer = {};
                              OneAnswer['question_id'] = QuestionID;
                              OneAnswer['question_key'] = QuestionKey;
                              OneAnswer['answer'] = $('.number_answer').val();
                              AllAnswers[QuestionID] = OneAnswer;
                              console.log(AllAnswers);
                          }
                      }else{

                          $ionicLoading.show({ template: 'Ere! 241', noBackdrop: true, duration: 1000 });
                          return false;
                      }
                    break;

                    case'textarea':
                      var OneAnswer = {};
                      OneAnswer['question_id'] = QuestionID;
                      OneAnswer['question_key'] = QuestionKey;
                      OneAnswer['answer'] = $('.textare_answer').val();
                      AllAnswers[QuestionID] = OneAnswer;
                      console.log(AllAnswers);
                    break;

                    case'message':
                      var OneAnswer = {};
                      OneAnswer['question_id'] = QuestionID;
                      OneAnswer['question_key'] = QuestionKey;
                      OneAnswer['answer'] = 'Text Message'
                      AllAnswers[QuestionID] = OneAnswer;
                      console.log(AllAnswers);
                    break;

                    case'repeater':
                      if(!$('input[type=radio]').is(':checked')){
                          
                      }

                      //localStorageService.set('surveyResult',AllAnswers);
                      //Users.postSurvey(AllAnswers);
                      // return false;
                      /*var OneAnswer = {};
                      var answerCollected = {};
                      OneAnswer['question_id'] = QuestionID;
                      OneAnswer['question_key'] = QuestionID;
                      OneAnswer['answer'] = QuestionID;*/
                    break;

                    case'group':
                      var OneAnswer = {};
                      var MonthYear = {};
                      OneAnswer['question_id'] = QuestionID;
                      OneAnswer['question_key'] = QuestionKey;
                      MonthYear['month'] = $('select[name=month]').val();
                      MonthYear['year'] = $('select[name=year]').val();
                      OneAnswer['answer'] = MonthYear;
                      AllAnswers[QuestionID] = OneAnswer;
                      console.log(AllAnswers);
                    break;

                    case'checkbox':
                      var OneAnswer = {};
                      var other;
                      var JoinData = {};
                      var CheckBoxAnswers = {};
                      OneAnswer['question_id'] = QuestionID;
                      OneAnswer['question_key'] = QuestionKey;
                      var index = 0;
                      $(':checkbox:checked').each(function(key, value){

                          if($(this).val() == 66){

                              other = $('input[name=other]').val();
                              JoinData['other'] = other;
                          }else{

                              CheckBoxAnswers[index] = $(this).val();
                              JoinData['other'] = '';
                          }
                          index++;
                      });
                      
                      JoinData['checkbox'] = CheckBoxAnswers;
                      OneAnswer['answer'] = JoinData;
                      AllAnswers[QuestionID] = OneAnswer;
                      console.log(AllAnswers);
                    break;


                }

                $state.go('survey',{'survey':$state.params.survey, 'qid':$scope.$$childHead.qid});
            });
        }
    };

    $scope.GoBack = function() {
      $ionicHistory.goBack();
    };

    $scope.GoDashboard = function(){

        var confirmPopup = $ionicPopup.confirm({
           title: config.text_stop_survey_title,
           template: config.text_stop_survey_template,
           cancelText: config.text_survey_no,
           okText: config.text_survey_yes
         });

         confirmPopup.then(function(res) {
           if(res) {
                $ionicHistory.nextViewOptions({
                  disableBack: true
                });
                if(typeof localStorageService.get('suerveyLists') !== 'undefined' && localStorageService.get('suerveyLists') != null){

                    var OldServeyList = localStorageService.get('suerveyLists');
                    var OldSurveyKeyLists = Object.keys(localStorageService.get('suerveyLists'));
                    if(OldSurveyKeyLists.length>0){
                        
                        angular.forEach(OldSurveyKeyLists, function(value, key) {

                            SurveyLists[value] = OldServeyList[value];
                        })
                    }
                }
                var timeStamp = $filter('date')(new Date(), 'dd-MM-yyyy-HH:mm:ss');
                SurveyLists[timeStamp] = {'answer':AllAnswers,'lastQid': $state.params.qid};
                localStorageService.set('suerveyLists',SurveyLists);
                $state.go('dashboard');
           } else {
             return true;
           }
         });
    }

})
.controller('HomeCtrl', function($scope, $state, config, $ionicHistory, localStorageService, $ionicPopover, $rootScope){

    $scope.logout = config.text_logout;
    var template = '<ion-popover-view> <ion-content> <div class="list"> <a class="item" href="http://learn.ionicframework.com/" target="_blank"> Learn Ionic </a> <a class="item" href="http://ionicframework.com/docs/" target="_blank"> Documentation </a> <a class="item" href="http://showcase.ionicframework.com/" target="_blank"> Showcase </a> <a class="item" href="http://ionicframework.com/submit-issue/" target="_blank"> Submit an Issue </a> <a class="item" href="https://github.com/driftyco/ionic" target="_blank"> Github Repo </a> </div> </ion-content> </ion-popover-view>';

   $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
   });

   $scope.openPopover = function($event) {
      $scope.popover.show($event);
   };

   $scope.closePopover = function() {
      $scope.popover.hide();
   };

   //Cleanup the popover when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.popover.remove();
   });

   // Execute action on hide popover
   $scope.$on('popover.hidden', function() {
      // Execute action
   });

   // Execute action on remove popover
   $scope.$on('popover.removed', function() {
      // Execute action
   });

    $scope.start_survey = config.text_startSuray;
    $scope.dashboard = config.text_dashboard;
    $scope.survey_list = config.text_surveyList;
    $scope.logout = config.text_logout;


    $scope.goSurveyList = function(){

        $state.go('survey-list');
    }
   
    console.log(localStorageService.get('suerveyLists'));

    $scope.goDash = function(surveyType){
        
        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        if(surveyType == 1){

            $state.go('survey',{'survey': '1'});
        }else{

            $state.go('survey',{'survey':'2'});
        }
        
    }
})

.controller('ServeyListCtrl', function($scope, $state, config, $ionicHistory, localStorageService){

      $scope.logout = config.text_logout;
      $scope.dashboard = config.text_survel_list;
      $scope.items = localStorageService.get('suerveyLists');
      $scope.listCanSwipe = true;
      var serveyLists = localStorageService.get('suerveyLists');
      $scope.StartSurvey = function(SurveyDate){

          var storedSurveys = localStorageService.get('suerveyLists');
          angular.forEach(storedSurveys, function(value, key){

              if(key == SurveyDate){

                  window.AllAnswers = {};
                  window.SurveyLists = {};
                  AllAnswers = value.answer;
                  delete storedSurveys[key];
                  localStorageService.set('suerveyLists',storedSurveys);
                  $ionicHistory.nextViewOptions({
                      disableBack: true
                  });
                  $state.go('survey',{'qid':value.lastQid});
              }
          })
      }

      $scope.goDash = function(){

          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('dashboard');
      }
})

.controller('LoginCtrl', function($scope, $http, $ionicLoading, localStorageService, Users, $state, $window, config, $ionicHistory) {
    $scope.t_username = config.text_username;
    $scope.t_password = config.text_password;
    $scope.t_login = config.text_login;
    $scope.user_login = config.text_userLogin;
    $scope.t_activate = config.text_activate;

    if(localStorageService.get('userId') != null){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('dashboard');
        //console.log(localStorageService.get('userId'));
    }
  
    $scope.clearData = function(){

        localStorageService.clearAll();
        $ionicLoading.show({ template: config.text_activate_success, noBackdrop: true, duration: 2000 });
        $window.location.reload();
    }
    $scope.login = function(username, password){

        var users = Users.all();
        if(angular.isUndefined(username) || angular.isUndefined(password)){
            $ionicLoading.show({ template: config.text_fill_error, noBackdrop: true, duration: 2000 });
            return false;
        }
        for(var i = 0; i < users.length; i++){

              if(users[i].username == username && users[i].password == password){
                  
                  localStorageService.set('userId',users[i].username);
                  $ionicHistory.nextViewOptions({
                    disableBack: true
                  });
                  $state.transitionTo('dashboard');
                  return true;
              }
          }
        $ionicLoading.show({ template: config.text_wrong_user, noBackdrop: true, duration: 2000 });
    }

})

.controller('LogoutCtrl', function($scope, $state, $ionicLoading, localStorageService, $location, config, $ionicHistory, $ionicPopup){

    $scope.logout = function(){
          //console.log($state.current.name);
          if($state.current.name == 'survey'){

              var alertPopup = $ionicPopup.alert({
               title: 'Unable to logout',
               template: 'Unable to logout while survey is running!'
             });

          }else{

              localStorageService.clearAll();
              $ionicHistory.nextViewOptions({
                        disableBack: true
                      });
              $state.go("login");
              $ionicLoading.show({ template: config.text_signout_success, noBackdrop: true, duration: 2000 });
          }
    }
          
})


}());