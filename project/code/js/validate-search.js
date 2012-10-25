$(document).ready(function() {
	$("#search_form").validate({
        rules:{
            origin: "required",
            destination: "required",
            departure_date: {
				date: true,
				required: true
			},
			return_date: {
				date:true
			}
        },
        messages : {
            origin: "Lugar de origin erroneo",
            destination: "Lugar de destino erroneo",
            departure_date: "Fecha de partida erronea",
            return_date: "Fecha de regreso erronea"
        },
		errorPlacement: function(error, element) { 
			error.appendTo ( element.next() );
		}
    });
});

$(document).ready(function() {
		$("#initial_search").click(function () {	
			if (!$("#search_form").valid())
                alert("Error en el formulario. Revise los elementos resaltados.");
			return;
        });
});