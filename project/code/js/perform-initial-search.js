$(document).ready(function() {
	var orig = getQuerystring('origin');
	var dest = getQuerystring('destination');
	var dep = getQuerystring('departure_date');
	var ret = getQuerystring('return_date');
	var adult_num = getQuerystring('adults_num');
	var child_num = getQuerystring('kids_num');
	var infant_num = getQuerystring('infants_num');
	//aca viene la llama de ajax
	displayFlights(orig, dest, dep, ret, adult_num, child_num, infant_num);
	//aca viene el insertado de divs dinamico
});

function getQuerystring(key, default_)
{
  if (default_==null) default_="";
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return default_;
  else
    return qs[1];
}

function displayFlights(orig, dest, dep, ret, adult_num, child_num, infant_num){
	// one way flight
	if (ret == ""){
		$.ajax({
            url: "http://eiffel.itba.edu.ar/hci/service2/Booking.groovy?method=GetOneWayFlights&from="+ orig +"&to="+ dest +"&dep_date="+ dep +"&adults="+ adult_num +"&children="+ child_num +"&infants="+ infant_num,
            dataType: "json",
			success: function(data) {
                alert(JSON.stringify(error));
            },
            error: function(error) {
                alert(JSON.stringify(error));
            }
        });
	}else{
	//ida y vuelta
	}
}

