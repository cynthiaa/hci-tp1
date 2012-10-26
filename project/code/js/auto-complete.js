$(document).ready(function() {	
		$.ajax({
            url: "http://eiffel.itba.edu.ar/hci/service2/Geo.groovy?method=GetCities&page_size=500",
			dataType: "jsonp",
			jsonpCallback: "fillCitiesArray",
        });
	
}); 



function fillCitiesArray(data){
	var myCities = new Array();
	var myCitiesId = new Array();
	alert(data['total']);
	if(!data.hasOwnProperty("error")){
		for (var i=0;i<data['total'];i++){
			myCities[i] = data['cities'][i]['name'];
			myCitiesId[i] = data['cities'][i]['cityId'];
			console.log(myCities[i]);
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
}