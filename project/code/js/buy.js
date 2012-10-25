$(document).ready(function() {
	qs= new QueryString()
	// path
	var path = qs.value('path')
	//price
	var adult_price = qs.value('adult_price');
	var adult_quant = qs.value('adult_quant');
	var child_price = qs.value('child_price');
	var child_quant = qs.value('child_quant');
	var infant_price = qs.value('infant_price');
	var infant_quant = qs.value('infant_quant');
	var charges = qs.value('charges');
	var taxes = qs.value('taxes');
	var total = qs.value('total');
	// flight arrival information
	var	outbound_arrival_date = qs.value('outbound_arrival_date');
	var	outbound_arrival_timezone = qs.value('outbound_arrival_timezone');
	var outbound_arrival_airport = qs.value('outbound_arrival_airport');
	var outbound_arrival_city = qs.value('outbound_arrival_city');
	var outbound_arrival_country = qs.value('outbound_arrival_country');
	// flight departure information
	var	outbound_departure_date = qs.value('outbound_departure_date');
	var	outbound_departure_timezone = qs.value('outbound_departure_timezone');
	var outbound_departure_airport = qs.value('outbound_departure_airport');
	var outbound_departure_city = qs.value('outbound_departure_city');
	var outbound_departure_country = qs.value('outbound_departure_country');
	// flight data
	var outbound_flight_number = qs.value('outbound_departure_country');
	var outbound_cabin_type = qs.value('outbound_departure_country');
	var outbound_airline_name = qs.value('outbound_departure_country');
	var outbound_airline_rating = qs.value('outbound_departure_country');
	// flight arrival information
	var	inbound_arrival_date = qs.value('inbound_arrival_date');
	var	inbound_arrival_timezone = qs.value('inbound_arrival_timezone');
	var inbound_arrival_airport = qs.value('inbound_arrival_airport');
	var inbound_arrival_city = qs.value('inbound_arrival_city');
	var inbound_arrival_country = qs.value('inbound_arrival_country');
	// flight departure information
	var	inbound_departure_date = qs.value('inbound_departure_date');
	var	inbound_departure_timezone = qs.value('inbound_departure_timezone');
	var inbound_departure_airport = qs.value('inbound_departure_airport');
	var inbound_departure_city = qs.value('inbound_departure_city');
	var inbound_departure_country = qs.value('inbound_departure_country');
	// flight data
	var inbound_flight_number = qs.value('inbound_departure_country');
	var inbound_cabin_type = qs.value('inbound_departure_country');
	var inbound_airline_name = qs.value('inbound_departure_country');
	var inbound_airline_rating = qs.value('inbound_departure_country');
	// extra
	var idaString = (path == "twoWay")? ": ida": "";
	
	//new stuff

	for(var i=0;i<adult_quant;i++){
	
	}

	$( "#next_page" ).click(function() {
		document.location.href="buy.html?"+window.location.search.substring(1);
	});
});

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