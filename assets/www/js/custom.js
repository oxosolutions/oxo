$(document).ready(function(){
	//var cloneData;
	$.fn.follow = function (event, callback) {
	  $(document).on(event, $(this).selector, callback);  
	}

	$('.createClone').follow('click', function(){

		var cloneData = $('.cloneDiv:first').clone();
		
       	$('.appnd').append(cloneData);
    });

    $('.deleteRep').follow('click',function(e){
    	if($('.deleteRep').length == 1){

    		e.preventDefault();
    	}else{

    		$(this).parent('.cloneDiv').remove();
    	}
    });

    $('.genderSelection').follow('click', function(){

    	if($(this).val() == 1){

    		$(this).parents('.cloneDiv').find('.numberAge').slideUp(300);
    	}else{

    		//$(this).parent('label').parent('div').parent('.cloneDiv').find('.numberAge').fadeIn(300);
    		$(this).parents('.cloneDiv').find('.numberAge').slideDown(300);
    	}
    });

    $('input[name=number_answer]').follow('keyup', function(){

    	if($(this).val()<=55 && $(this).val().trim() != ''){

    		$('.disHideRadio').fadeIn(300);
    		$('.radioText').fadeIn(300);

    	}else{

    		$('.disHideRadio').fadeOut(300);
    		$('.radioText').fadeOut(300);
    	}
    });



    $('input[name=other_check]').follow('click', function(){
        if($(this).is(':checked')){

            $('input[name=other]').slideDown(300);
        }else{
            $('input[name=other]').slideUp(300);

        }
    });
});