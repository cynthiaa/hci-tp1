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
		document.location.href="results.html"+query_string;
	});	
}