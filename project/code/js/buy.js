$(document).ready(function() {
	qs= new QueryString()
	// path
	var path = qs.value('path')
	//price
	var adult_quant = qs.value('adult_quant');
	var child_quant = qs.value('child_quant');
	var infant_quant = qs.value('infant_quant');
	adult_quant = parseInt(adult_quant);
	child_quant = parseInt(child_quant);
	infant_quant = parseInt(infant_quant);
	// flight data
	var outbound_flight_number = qs.value('outbound_flight_number');

	//creo mi json
	jsonData = {};
	jsonData['flightId'] = parseInt(outbound_flight_number);
	//define json structure
	jsonData['passengers'] = [];
	for (var i=0;i<adult_quant+child_quant+infant_quant; i++){
		jsonData['passengers'][i] = { "firstName":"name", "lastName":"lastName", "birthdate":"19-10-1990", "idType":1, "idNumber":"11234" };
	}
	jsonData['payment'] = { "installments":1, "creditCard": { "number":"1234", "expiration":"1234", "securityCode":"123", "firstName":"Juan", "lastName":"Perez"}};
	jsonData['billingAddress'] = { "country":"AR", "state":"bs as", "City":"cap fed", "postalcode":143, "street":"madero", "floor":"1a", "apartment":"piola"}
	jsonData['contact'] = {"email":"mail", "phones":["5555-5555"]};
	
	//create dinamic divs
	$("#passengers_container").empty();
	for(var i=1;i<=adult_quant;i++){
		$("<div id='adult"+i+"'class='inner_box passenger_div'><h3 id='passenger_title'>Pasajero adulto "+i+"</h3><div class='input_div'><label>Nombre:</label><input type='text' name='adult_name_"+i+"' id='adult_name_"+i+"'><br><label>Apellido:</label><input type='text' name='adult_surname_"+i+"' id='adult_surname_"+i+"'><br><label>Fecha de nacimiento:</label><input type='text' name='adult_birth_"+i+"' id='adult_birth_"+i+"'><br><label>DNI:</label><input type='text' name='adult_dni_"+i+"' id='adult_dni_"+i+"'><br><label>Sexo:</label><select name='adult_sex_"+i+"' id='adult_sex_"+i+"'><option id='masculino'>Masculino</option><option id='femenino'>Femenino</option></select></div></div><br>").appendTo("#passengers_container");
	}	
	for(var i=1;i<=child_quant;i++){
		$("<div id='child"+i+"'class='inner_box passenger_div'><h3 id='passenger_title'>Pasajero niño "+i+"</h3><div class='input_div'><label>Nombre:</label><input type='text' name='child_name_"+i+"' id='child_name_"+i+"'><br><label>Apellido:</label><input type='text' name='child_surname_"+i+"' id='child_surname_"+i+"'><br><label>Fecha de nacimiento:</label><input type='text' name='child_birth_"+i+"' id='child_birth_"+i+"'><br><label>DNI:</label><input type='text' name='child_dni_"+i+"' id='child_dni_"+i+"'><br><label>Sexo:</label><select name='child_sex_"+i+"' id='child_sex_"+i+"'><option id='masculino'>Masculino</option><option id='femenino'>Femenino</option></select></div></div><br>").appendTo("#passengers_container");
	}
	for(var i=1;i<=infant_quant;i++){
		$("<div id='infant"+i+"'class='inner_box passenger_div'><h3 id='passenger_title'>Pasajero infante "+i+"</h3><div class='input_div'><label>Nombre:</label><input type='text' name='infant_name_"+i+"' id='infant_name_"+i+"'><br><label>Apellido:</label><input type='text' name='infant_surname_"+i+"' id='infant_surname_"+i+"'><br><label>Fecha de nacimiento:</label><input type='text' name='infant_birth_"+i+"' id='infant_birth_"+i+"'><br><label>DNI:</label><input type='text' name='infant_dni_"+i+"' id='infant_dni_"+i+"'><br><label>Sexo:</label><select name='infant_sex_"+i+"' id='infant_sex_"+i+"'><option id='masculino'>Masculino</option><option id='femenino'>Femenino</option></select></div></div><br>").appendTo("#passengers_container");
	}
	//buy tickets
	$( "#confirm" ).click(function() {
		for(var i=1;i<=adult_quant;i++){
			jsonData['passengers'][i-1]['firstName']= $("#adult_name_"+i).val();
			jsonData['passengers'][i-1]['lastName']= $("#adult_surname_"+i).val();
			jsonData['passengers'][i-1]['birthdate']= $("#adult_birth_"+i).val();
			jsonData['passengers'][i-1]['idNumber']= $("#adult_dni_"+i).val();
		}
		for(var i=1;i<=child_quant;i++){
			jsonData['passengers'][adult_quant+i-1]['firstName']= $("#child_name_"+i).val();
			jsonData['passengers'][adult_quant+i-1]['lastName']= $("#child_surname_"+i).val();
			jsonData['passengers'][adult_quant+i-1]['birthdate']= $("#child_birth_"+i).val();
			jsonData['passengers'][adult_quant+i-1]['idNumber']= $("#child_dni_"+i).val();
		}
		for(var i=1;i<=infant_quant;i++){
			jsonData['passengers'][child_quant+adult_quant+i-1]['firstName']= $("#infant_name_"+i).val();
			jsonData['passengers'][child_quant+adult_quant+i-1]['lastName']= $("#infant_surname_"+i).val();
			jsonData['passengers'][child_quant+adult_quant+i-1]['birthdate']= $("#infant_birth_"+i).val();
			jsonData['passengers'][child_quant+adult_quant+i-1]['idNumber']= $("#infant_dni_"+i).val();
		}		
		jsonData['payment']['creditCard']['number'] = $("#creditcard_number").val();
		jsonData['payment']['creditCard']['expiration'] = $("#creditcard_expire").val();
		jsonData['payment']['creditCard']['securityCode'] = $("#creditcard_security_code").val();
		jsonData['payment']['creditCard']['firstName'] = $("#creditcard_firstname").val();
		jsonData['payment']['creditCard']['lastName'] = $("#creditcard_lastname").val();
		
		jsonData['billingAddress']['country'] = $("#country").val();
		jsonData['billingAddress']['state'] = $("#state").val();
		jsonData['billingAddress']['City'] = $("#city").val();
		jsonData['billingAddress']['postalcode'] = parseInt($("#postalcode").val());
		jsonData['billingAddress']['street'] = $("#address").val();
		jsonData['billingAddress']['floor'] = $("#floor").val();
		jsonData['billingAddress']['apartment'] = $("#apartment").val();
		
		jsonData['contact']['email'] = $("#mail").val();
		jsonData['contact']['phones'][0] = $("#telephone").val();

		validate(jsonData);
	});
});

function validate(jsonData){
	$.ajax({
		url: "http://eiffel.itba.edu.ar/hci/service2/Booking.groovy?method=ValidateCreditCard&number="+jsonData['payment']['creditCard']['number']+"&exp_date="+jsonData['payment']['creditCard']['expiration']+"&sec_code="+jsonData['payment']['creditCard']['securityCode'],
		dataType: "jsonp",
		jsonpCallback: "validateFinish",
		beforeSend: function(){
			loading();
		},
		complete: function(data){
			if(data['statusText']=="success"){
				buy(jsonData);
			}
		},
		error: function(error){
			console.log(error);
		}
	});
}

function validateFinish(data){
	var loadDiv = $("#container").children("#loading");
	loadDiv.delay(800).hide(800);
	if(data.hasOwnProperty("error")){
		$("#container").append("<br><div class='inner_box' id='error'><h3>Error "+data.error.code+": "+data.error.message+"</h3></div>");
		var errorDiv = $("#container").children("#error");
		errorDiv.hide(0).delay(1000);
		errorDiv.fadeIn(500);
		return false;;
	}else if(!data['valid']){
		$("#container").append("<div id='no_comments' class='inner_box'><h3>La compra no pudo ser realizada<br>Su tarjeta de crédito no es válida</h3></div>");
		var errorDiv = $("#container").children("#no_comments");
		errorDiv.hide(0).delay(1000);
		errorDiv.fadeIn(500);
		return false;
	}else if(data['valid']){
		$("#container").append("<div id='no_comments' class='inner_box'><h3>Su tarjeta de crédito es válida<br>Registrando vuelo</h3></div>");
		var errorDiv = $("#container").children("#no_comments");
		errorDiv.hide(0).delay(1000);
		errorDiv.fadeIn(500);
		return false;
	}
}

function buy(data){
	console.log(JSON.stringify(data));
	$.ajax({
		url: "http://eiffel.itba.edu.ar/hci/service2/Review.groovy?method=ReviewAirline",
		data: JSON.stringify(data),
		dataType: "json",
		contentType: "application/json",			
		type: "POST",
		beforeSend: function(){
			loading();
		},
		success: function(data){
			done(data);
		},
		error: function(error){
			console.log(error);
		}
	});
}

function loading(){
	$("#container").empty();
	$("#container").append("<div id='loading'><p><img src='images/ajax-loader.gif'/></p></div>").hide(0);
	$("#container").fadeIn(500).delay(500);
	return;
}

function done(data){
	var loadDiv = $("#container_box").children("#loading");
	loadDiv.delay(800).hide(800);	
	if(data.hasOwnProperty("error")){
		$("#container_box").append("<br><div class='inner_box' id='search_error'><h3>Error "+data.error.code+": "+data.error.message+"</h3></div>");
		var errorDiv = $("#container_box").children("#search_error");
		errorDiv.hide(0).delay(1000);
		errorDiv.fadeIn(500);
		return;
	}
	if(!data['booking']){
		$("#container_box").append("<div id='fail' class='inner_box'><h3>La compra no pudo ser realizada<br>Disculpe las molestias ocasionadas</h3></div><br>");
		var errorDiv = $("#container_box").children("#fail");
		errorDiv.hide(0).delay(1000);
		errorDiv.fadeIn(500);
	}else{
		$("#container_box").append("<div id='success' class='inner_box'><h3>La compra ha sido un éxito<br>Disfrute de su vuelo</h3></div><br>");
		var success_div = $("#container_box").children("#success");
		success_div.hide(0).delay(1000);
		success_div.fadeIn(500);	
	}
	return;
}

function QueryString(qs)
{
    this.dict= {};

    // If no query string  was passed in use the one from the current page
    if (!qs) qs= location.search;

    // Delete leading question mark, if there is one
    if (qs.charAt(0) == '?') qs= qs.substring(1);

    // Parse it
    var re= /([^=&]+)(=([^&]*))?/g;
    while (match= re.exec(qs))
    {
	var key= decodeURIComponent(match[1].replace(/\+/g,' '));
	var value= match[3] ? QueryString.decode(match[3]) : '';
	if (this.dict[key])
	    this.dict[key].push(value);
	else
	    this.dict[key]= [value];
    }
}

QueryString.decode= function(s)
{
    s= s.replace(/\+/g,' ');
    s= s.replace(/%([EF][0-9A-F])%([89AB][0-9A-F])%([89AB][0-9A-F])/g,
	function(code,hex1,hex2,hex3)
	{
	    var n1= parseInt(hex1,16)-0xE0;
	    var n2= parseInt(hex2,16)-0x80;
	    if (n1 == 0 && n2 < 32) return code;
	    var n3= parseInt(hex3,16)-0x80;
	    var n= (n1<<12) + (n2<<6) + n3;
	    if (n > 0xFFFF) return code;
	    return String.fromCharCode(n);
	});
    s= s.replace(/%([CD][0-9A-F])%([89AB][0-9A-F])/g,
	function(code,hex1,hex2)
	{
	    var n1= parseInt(hex1,16)-0xC0;
	    if (n1 < 2) return code;
	    var n2= parseInt(hex2,16)-0x80;
	    return String.fromCharCode((n1<<6)+n2);
	});
    s= s.replace(/%([0-7][0-9A-F])/g,
	function(code,hex)
	{
	    return String.fromCharCode(parseInt(hex,16));
	});
    return s;
};

QueryString.prototype.value= function (key)
{
    var a= this.dict[key];
    return a ? a[a.length-1] : undefined;
};

QueryString.prototype.values= function (key)
{
    var a= this.dict[key];
    return a ? a : [];
};

QueryString.prototype.keys= function ()
{
    var a= [];
    for (var key in this.dict)
	a.push(key);
    return a;
};