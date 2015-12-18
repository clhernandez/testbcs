(function(){
	document.getElementById("btnGraficar").addEventListener("click", makeGraficos);
	document.getElementById("fecha").value = moment().format("YYYY-MM-DD");

})();

function makeGraficos(){
	var indice = document.getElementById("indice").value;
	var periodo = document.getElementById("periodo").value;
	var fecha = document.getElementById("fecha").value;
	//$("#grafico").hide();
	if(indice!=null && periodo!=null && fecha!=null){
		//target.className="";
		if(periodo=="ME"){
			graficarMensual(indice, periodo, fecha);
		}else{
			graficarAnual(indice, periodo, fecha);
		}
	}else{
		console.log("Wrong data.");
	}
}


function graficarMensual(indice, periodo, fecha){
	fecha = (moment(fecha).startOf("month")).format("YYYY-MM-DD");
	var fechaHasta = (moment(fecha).endOf("month")).format("YYYY-MM-DD");

	if(validateDates(fecha, fechaHasta)){
		$("#titleGraph").empty().html("Índice "+indice+" para el mes de "+ moment(fecha).locale("es").format("MMMM"));
		getData(indice, "DI", fecha, fechaHasta);
	}
}

function graficarAnual(indice, periodo, fecha){
	fecha = (moment(fecha).startOf("year")).format("YYYY-MM-DD");
	var fechaHasta = (moment(fecha).endOf("year")).format("YYYY-MM-DD");

	if(validateDates(fecha, fechaHasta)){
		$("#titleGraph").empty().html("Índice "+indice+" para el año "+ moment(fecha).format("YYYY"));
		getData(indice, "ME", fecha, fechaHasta);
	}
}

function getData(indice, periodo, fechaDesde, fechaHasta){

	var endpoint = "/api" + "/" + indice + "/" + periodo +"/"+fechaDesde+"/"+fechaHasta;
	//target.className="";
	$.ajax({
	  url: endpoint,
	  context: document.body
	}).done(function(data) {
		
		if(data.resultados.code==0 && data.resultados.indicesItem.length > 0){
			var datos = data.resultados.indicesItem.sort(sortByDate);
			for(var i in datos){
				console.log(datos[i].fecha);
			}
			console.log("llamar grafico");
			graficarNew(datos);
		}
		//target.className="hide";
		//$("#grafico").show();
	});
}

function graficarNew(indices){
	$("#graficoNuevo").empty();
	console.log("indices:" + indices.length);

	if(document.getElementById("indice").value!="ALL"){
		
		var dataPlot = [];
		

		for(var i in indices){
			console.log(indices[i].fecha);
			dataPlot.push({fecha: indices[i].fecha.trim(), ind_act: indices[i].ind_act, ind_may: indices[i].ind_may, ind_men: indices[i].ind_men});
		}
		console.log(dataPlot);

		new Morris.Line({
		  // ID of the element in which to draw the chart.
		  element: "graficoNuevo",
		  // Chart data records -- each entry in this array corresponds to a point on
		  // the chart.
		  data: dataPlot,
		  // The name of the data record attribute that contains x-values.
		  xkey: 'fecha',
		  // A list of names of data record attributes that contain y-values.
		  ykeys: ['ind_act', 'ind_may', 'ind_men'],
		  // Labels for the ykeys -- will be displayed when you hover over the
		  // chart.
		  labels: ['Indice Actual', 'Mayor Valor indice','Menor valor Indice' ],
		  
		  lineColors:["red", "green", "blue"]
		});


	}
}