var express = require('express');
var request = require('request');
var router = express.Router();

var endpoint = "http://bcs-test.cloudapp.net/bcstest/rest/indices/consultaIndices";
var timeoutGlobal = 100000;

/* GET home page. */
var cache=null;

router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express'});
});

router.get("/api/:indice/:periodo/:fechaDesde/:fechaHasta", function(req, res, next){
	var data = {};
	var indice = req.params.indice;
	var periodo = req.params.periodo;
	var fechaDesde = req.params.fechaDesde;
	var fechaHasta = req.params.fechaHasta;

	request.get({url: endpoint, qs:{indice:indice, periodo:periodo, f_desde:fechaDesde, f_hasta:fechaHasta},timeout:timeoutGlobal}, function(err,response,body){
		

		if (!err && response.statusCode == 200) {
			data.resultados = JSON.parse(body);
			console.log(data.resultados);
			res.json(data);
	  	}
	  	
	}).on('error', function(err){
		console.log(err);
		data.resultados = {codigo:-1, mensaje: "An error happened :(" };
		res.json(data);
	});
});

router.get("/api/:periodo/:fechaDesde/:fechaHasta", function(req, res, next){
	console.log("Filter by periodo");
	var data = {};
	var periodo = req.params.periodo;
	var fechaDesde = req.params.fechaDesde;
	var fechaHasta = req.params.fechaHasta;

	request.get({url: endpoint, qs:{periodo:periodo, f_desde:fechaDesde, f_hasta:fechaHasta},timeout:timeoutGlobal}, function(err,response,body){

		if (!err && response.statusCode == 200) {
			data.resultados = JSON.parse(body);
			console.log(data.resultados);
			res.json(data);
	  	}
	  	
	}).on('error', function(err){
		console.log(err);
		data.resultados = {codigo:-1, mensaje: "An error happened :(" };
		res.json(data);
	});
});



module.exports = router;