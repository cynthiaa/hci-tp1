$(document).ready(function() {	
		$.ajax({
            url: "http://eiffel.itba.edu.ar/hci/service2/Geo.groovy?method=GetCities&page_size=40",
			dataType: "jsonp",
			jsonpCallback: "fillCitiesArray",
        });
}); 

function fillCitiesArray(data){
	var myCities = new Array();
	var myCitiesId = new Array();
	if(!data.hasOwnProperty("error")){
		for (var i=0;i<data['total'];i++){
			myCities[i] = data['cities'][i]['name'];
			myCitiesId[i] = data['cities'][i]['cityId'];
		}
	}else{
		console.log(JSON.stringify(data));
	}
	
	$( "#origin" ).autocomplete({
            source: myCities
	});
	
	$( "#destination" ).autocomplete({
            source: myCities
	});
	
	$("#initial_search").click(function() {
		var origin = $("#origin").val();
		var origin_id = myCitiesId[myCities.indexOf(origin)];
		var destination = $("#destination").val();
		var destination_id = myCitiesId[myCities.indexOf(destination)];
		var departure_date = $("#departure_date").val();
		var return_date = $("#return_date").val();
		var adults_num = $("#adults_num").val();
		var kids_num = $("#kids_num").val();
		var infants_num = $("#infants_num").val();
		var query_string = "?origin="+origin_id+"&destination="+destination_id+"&departure_date="+departure_date+"&return_date="+return_date+"&adults_num="+adults_num+"&kids_num="+kids_num+"&infants_num="+infants_num+"&origin_name="+origin+"&destination_name="+destination;
		if(valid_search(origin, destination, departure_date, return_date)){
			document.location.href="results.html"+query_string;
		}
	});	
}

function valid_search(orig, dest, dep, ret){
		var error_string = "";
		if(orig == "")
			error_string = error_string+"El lugar de origen es obligatorio.\n";
		if(dest == "")
			error_string = error_string+"El lugar de destino es obligatorio.\n";
		if(dep == "" || !checkdate(dep))
			error_string = error_string+"El dia de partida es obligatorio.\n";
		if(ret != "" && !checkdate(ret))
			error_string = error_string+"El campo de llegada es obligatorio.\n";
		if(error_string != ""){
			alert(error_string);
			error_string = "";
			return false;
		}else{
			return true;
		}
}

function checkdate(input){
	var validformat=/^\d{4}\-\d{2}\-\d{2}$/; //Basic check for format validity
	if (!validformat.test(input))
		alert("Formato de fecha invalida. Usar yyyy-mm-dd.")
	else{ //Detailed check for valid date ranges
		var monthfield=input.split("-")[1];
		var dayfield=input.split("-")[2];
		var yearfield=input.split("-")[0];
		var dayobj = new Date(yearfield, monthfield-1, dayfield);
		var currentDay = new Date();
		if(dayobj-currentDay<172800000){
			alert("Debe haber al menos 2 días de diferencia entre hoy y el vuelo"); 
			return false;
		}
		if ((dayobj.getMonth()+1!=monthfield)||(dayobj.getDate()!=dayfield)||(dayobj.getFullYear()!=yearfield))
			return false;
		else
			return true;
	}
}