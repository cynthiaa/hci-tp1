$(document).ready(function() {
		var lang = getCookie("lang");
		if(lang == null){
			lang = "ES";
		}
		$("#languageSelector option[value="+lang+"]").attr("selected",true);
		loadLanguage(lang);	
		translate();
	   $("#languageSelector").change(function() {
		   var lid = $("option:selected",this).attr('value');
		   loadLanguage(lid);
		   $("#destination_label").text($(language).find("destination_label").text());
		   setCookie("lang",lid,3);
		   translate();	      
	});	
});

function loadLanguage(lid) {
	var url = "languages/" + lid + ".xml";
	
	$.ajax({
		type : "GET",
		url : url,
		dataType : "xml",
		async: false,
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(errorThrown);
		},
		success : function(xml) {
			language = xml;
			}
	});
}

function translate(){
	$('[id^="translate"]').each(function(){
		var idStr = $(this).attr('id');
		
		var code=idStr.replace(/.*translate_([^\s]*)[\s.*]?/,'$1');		
			   $(this).text($(language).find(code).text());
		   });
	$('[class*="translate"]').each(function(){
		var id = $(this).attr('id');
		var code=id.replace(/.*translate_([^\s]*)[\s.*]?/,'$1');
		if(this.nodeName.toLowerCase() == 'input' || this.nodeName.toLowerCase() == 'textarea') {
			if($(this).attr('type') != 'submit' ) {
			   $(this).attr('placeholder',($(language).find(code).text()));
		   }
		   
			else {
			 $(this).attr('value',($(language).find(code).text()));
			}
		}
			 
		else {
			$(this).text($(language).find(code).text());
		}
		});
	
	//$('[id^="translate"]').each(function(){
		//var classStr=$(this).attr('class');
		//alert(classStr);
		//var code=classStr.replace(/.*translate_([^\s]*)[\s.*]?/,'$1');
		//alert(code);
		//if(this.nodeName.toLowerCase() == 'input' && ($(this).attr('type') == 'submit' || $(this).attr('type')=="button"|| $(this).attr('type') == 'text')) {
			//$(this).attr('value', $(language).find(code).text());
		//} else {
			//$(this).text($(language).find(code).text());
		//}
		
	//});
}

function translateElem(idElem) {
	alert(language);
	if(language == null){
		loadLanguage(getCookie("lang"));
	}
	var resp;
	resp = ($(language).find(idElem).text());
	return resp;
}

function setCookie(c_name,value,exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name) {
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name) {
			return unescape(y);
		}
	}
}
