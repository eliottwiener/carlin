// Copyright (C) 2015 Eliott Wiener
$(document).ready(function(){
	"use strict";

	$('form').submit(function(e){
		e.preventDefault();
		if(validate()){
			var final_submit_data = {
				"first_name": $("#first_name").val(),
				"last_name": $("#last_name").val(),
				"phone": $("#phone").val().replace(/[^0-9]/g,""),
				"email": $("#email").val(),
				"street1": $("#street1").val(),
				"street2": $("#street2").val(),
				"city": $("#city").val(),
				"state": $("#state").val(),
				"zip": $("#zip").val(),
			}
			console.log("Successful submit:");
			console.log(JSON.stringify(final_submit_data));
			alert("Your information was successfully submitted!\n(Check the console to see the JSON that would have been submitted)");
		}
	});

	// auto-fill city and state based on zip code, but allow user to override
	$('#zip')
	.ziptastic()
	.on('zipChange', function(event, country, state, state_short, city, zip) {
		if(city){
			$("#zip-error").hide();
			$('#zip').val(zip);
			$('#city').val(city);
			$('#state').val(state_short);
		} else {
			$("#zip-error").show();
			$('#city').val("");
			$('#state').val("");
		}
	});

	var valid_email = false;
	$('#email').mailgun_validator({
		api_key: 'pubkey-8cfd55b5c104c343efbdd1facbb4f418',
		success: function(data){
			$("#email-spinner").hide();
			$("#email-error").hide();
			$("#email-did-you-mean").hide();
			if(!data["is_valid"]){
				$("#email-error").show();
			}
			valid_email = data["is_valid"];
			if(data["did_you_mean"]){
				$("#email-did-you-mean-suggestion").text(data["did_you_mean"]);
				$("#email-did-you-mean-suggestion").click(function(e){
					e.preventDefault();
					$("#email").val(data["did_you_mean"]);
					$("#email").focus().blur(); // trigger re-validate
				});
				$("#email-did-you-mean").show();
			}
		},
		error: function(error){
			// fall back to html5 validation only
			$("#email-error").hide();
			$("#email-spinner").hide();
			$("#email-did-you-mean").hide();
			valid_email = true;
		},
		in_progress: function(){
			valid_email = false;
			$("#email-error").hide();
			$("#email-did-you-mean").hide();
			$("#email-spinner").show();
		},
	});

	var validate = function(){
		if(!valid_email){
			$("#email").get(0).scrollIntoView();
			return false
		}
		return valid_zip();
	};

	var valid_zip = function(){
		var response = $.ziptastic("US", $('#zip').val()).responseJSON;
		// if we can't get a response, just rely on html5 validation
		var valid = (response && "postal_code" in response) || !response
		if(!valid){
			$("#zip").get(0).scrollIntoView();
		}
		return valid;
	}
});
