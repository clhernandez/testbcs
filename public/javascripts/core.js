var target;

$(document).ready(function(){
	//select active page
	$("li").removeClass("active");
	var url = document.URL.toString();
	(url.indexOf("graficos")>0? document.getElementById("graficos").className="active":document.getElementById("indices").className="active");

	//fallback html5 datepicker with jquery-ui
	$('input[type=date]').datepicker({
	  	dateFormat: 'yy-mm-dd',
	    changeMonth: true,
	    changeYear: true
	});

	//create loading spinner
	target = document.getElementById('spinner');
	var spinner = new Spinner(opts).spin(target);
});

function validateDates(fechaDesde, fechaHasta){
	if(moment(fechaDesde).isBefore(fechaHasta) || moment(fechaDesde).isSame(fechaHasta))
		return true;
	else
		return false;
}

function sortByDate(a,b){
	var aDate = a.fecha;
	var bDate = b.fecha;
	return (( moment(aDate).isBefore(bDate)) ? -1 : ((moment(aDate).isAfter(bDate)) ? 1 : 0));
}

