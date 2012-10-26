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
	
	$( "#city_offers" ).autocomplete({
            source: myCities
	});
	
	$("#search_offers").click(function() {
		var origin = $("#city_offers").val();
		var origin_id = myCitiesId[myCities.indexOf(origin)];
		var my_lat = data['cities'][myCities.indexOf(origin)]['longitude'];
		var my_long = data['cities'][myCities.indexOf(origin)]['longitude'];
		$.ajax({
            url: "http://eiffel.itba.edu.ar/hci/service2/Booking.groovy?method=GetFlightDeals&from="+origin_id,
			dataType: "jsonp",
			beforeSend: function(){
				loading();
			},
			jsonpCallback: "offer_search",
        });
	});	
}

function loading(){
	$("#container").append("<div id='loading'><p><img src='images/ajax-loader.gif'/></p></div>").hide(0);
	$("#container").fadeIn(500).delay(500);
	return;
}

function offer_search(data){
	$("#loading").delay(800).hide(800);
	$("<br><div id='map_container'class='inner_box'><div id='map'></div></div>").appendTo("#container");
	$("#map_container").hide(0).delay(1000);
	$("#map_container").fadeIn(500);
	//DIBUJO EL MAPITA

	//DIBUJO LAS MARQUITAS
	for(var i=0; i<data['deals'].length; i++){
		var offer_lat = data['deals'][i]['cityLatitude'];
		var offer_long = data['deals'][i]['cityLongitude'];
		var cityId = data['deals'][i]['cityId'];
		var cityName = data['deals'][i]['cityName'];
		var countryId = data['deals'][i]['countryName'];
		var price = data['deals'][i]['price'];
		var monesa = data['currencyId'];
		alert("oferta "+i+": "+cityName);
	}
}