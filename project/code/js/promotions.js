$(document).ready(function() {
		$("#map").hide(0)
		$.ajax({
            url: "http://eiffel.itba.edu.ar/hci/service2/Geo.groovy?method=GetCities&page_size=40",
			dataType: "jsonp",
			jsonpCallback: "fillCitiesArray",
        });
}); 

function fillCitiesArray(data){
	var myCities = new Array();
	var myCitiesId = new Array();
	var mapState = false;
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
	$("#search_box").fadeOut(500).delay(500);
	return;
}

function offer_search(data){	
	$("#map").fadeIn(500).delay(1500);

	var marker = new Array();
	//DIBUJO EL MAPITA
	var mapOptions = {
		zoom: 1,
		center: new google.maps.LatLng(0, 0),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
	
	//DIBUJO LAS MARQUITAS
	for(var i=0; i<data['deals'].length; i++){
		var offer_lat = data['deals'][i]['cityLatitude'];
		var offer_long = data['deals'][i]['cityLongitude'];
		var cityId = data['deals'][i]['cityId'];
		var cityName = data['deals'][i]['cityName'];
		var countryId = data['deals'][i]['countryName'];
		var price = data['deals'][i]['price'];
		var moneda = data['currencyId'];
		//alert("oferta "+i+": "+cityName);
		marker[i] = createMarker(new google.maps.LatLng(offer_lat, offer_long), cityName+": "+price+""+moneda, map);
	}
}

//var global para ver si hay algun abierta
var curr_infw;

//crea los markers
function createMarker(point, content, map) {
	var marker = new google.maps.Marker({
		position: point,
		map: map,
	});
	var infowindow = new google.maps.InfoWindow({
		content: content
	});
	google.maps.event.addListener(marker, 'click', function() {
	if(curr_infw) { curr_infw.close();}
		curr_infw = infowindow; 
		infowindow.open(map, marker);
	});
	return marker;
};
