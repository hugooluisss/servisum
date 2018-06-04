/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var db = null;
var objUsuario;
var plantillas = {};
var codigosScaneados = null;
var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function(){
		try{
			//db = openDatabase({name: "tracking.db"});
			db = window.sqlitePlugin.openDatabase({name: 'tracking.db', location: 1, androidDatabaseImplementation: 2});
			console.log("Conexión desde phonegap OK");
			crearBD(db);
		}catch(err){
			alertify.error("No se pudo crear la base de datos con sqlite... se intentará trabajar con web");
			db = openDatabase("tracking.db", "1.0", "Just a Dummy DB", 200000);
			crearBD(db);
			console.log("Se inicio la conexión a la base para web");
		}
		crearBD();
		
		$("[setPanel]").click(function(){
			switch($(this).attr("setPanel")){
				case 'download':
					panelDownload();
				break;
				case 'upload':
					panelUpload();
				break;
			}
		});
		
		objUsuario = new TUsuario;
		if (!objUsuario.isLogin())
			location.href = "index.html";
		
		getPlantillas()
		setTimeout (function(){
			showCodigos();
			
			$("#winCodigo").on('shown.bs.modal', function(){
				var id = $("#winCodigo").attr("idCodigo");
				if (id == "" || id == undefined){
					mensajes.alert({"mensaje": "No se pudo identificar el código"});
					$("#winCodigo").modal("hide");
				}else{
					db.transaction(function(tx){
						tx.executeSql("select * from codigo where idCode = ?", [id], function(tx, res){
							var localizacion = res.rows.item(0).localizacion;
							var factura = res.rows.item(0).factura;
							
							$("#selFactura").find("option").remove();
							$("#selFactura").append('<option value="">Ninguna</option>');
							tx.executeSql("select * from factura", [], function(tx, res){
								for(i = 0 ; i < res.rows.length ; i++){
									var opt = $("<option />", {
										value: res.rows.item(i).numero,
										text: res.rows.item(i).numero + " - " + res.rows.item(i).monto
									});
									$("#selFactura").append(opt);
									
									if (factura == res.rows.item(i).numero)
										$("#selFactura").val(factura);
								}
							});
							
							$("#selUbicacion").find("option").remove();
							$("#selUbicacion").append('<option value="">Ninguna</option>');
							
							tx.executeSql("select * from localizacion", [], function(tx, res){
								for(i = 0 ; i < res.rows.length ; i++){
									var opt = $("<option />", {
										value: res.rows.item(i).idLocal,
										text: res.rows.item(i).nombre
									});	
									$("#selUbicacion").append(opt);
									if (localizacion == res.rows.item(i).idLocal)
										$("#selUbicacion").val(localizacion);
								}
							});
							
							$.each(res.rows.item(0), function(key, valor){
								$("#winCodigo").find("[campo=" + key + "]").html(valor);
								$("#winCodigo").find("[campo=" + key + "]").val(valor);
							});
						}, errorDB);
					});
				}
			});
			
			$("#winScan").on('shown.bs.modal', function(){
				codigosScaneados = new Array;
				db.transaction(function(tx){
					tx.executeSql("select * from factura", [], function(tx, res){
						for(i = 0 ; i < res.rows.length ; i++){
							var opt = $("<option />", {
								value: res.rows.item(i).numero,
								text: res.rows.item(i).numero + " - " + res.rows.item(i).monto
							});
							$("#selFacturaScan").append(opt);
						}
					});
					
					$("#selUbicacionScan").find("option").remove();
					$("#selUbicacionScan").append('<option value="">Ninguna</option>');
					
					tx.executeSql("select * from localizacion", [], function(tx, res){
						for(i = 0 ; i < res.rows.length ; i++){
							var opt = $("<option />", {
								value: res.rows.item(i).idLocal,
								text: res.rows.item(i).nombre
							});	
							$("#selUbicacionScan").append(opt);
						}
					});
				});
			});
			
			
			$("#frmCodigo").validate({
				debug: true,
				rules: {
					txtCantidad: "required"
				},
				errorElement : 'span',
				debug: true,
				messages: {
					txtNombre: "Este campo es necesario"
				},
				submitHandler: function(form){
					db.transaction(function(tx){
						tx.executeSql("update codigo set cantidad = ?, factura = ?, localizacion = ? where idCode = ?", [
								$("#txtCantidad").val(),
								$("#selFactura").val(),
								$("#selUbicacion").val(),
								$("#winCodigo").attr("idCodigo")
							], 
						function(tx, res){
							console.log("Guardado");
							$("#winCodigo").modal("hide");
							showCodigos();
							if ($("#scaner").val() == 1)
								initScan();
						}, errorDB);
					});
		        }
		
		    });
		    
		    $("#btnCamara").click(function(){
				$("#winScan").modal();
			});
			
			$("#getCodigos").click(function(){
				showCodigos();
			});
			
			$("#btnScanCamera").click(function(){
				initScan();
				$("#winScan").modal("hide");
			});
			
			$("#btnSalir").click(function(){
				mensajes.confirm({"mensaje": "¿Seguro?", "funcion": function(e){
		    		if(e == 1) {
			    		window.localStorage.removeItem("session");
			    		location.href = "index.html";
			    	}
		    	}});
			});
		}, 100); 
	}
};

app.initialize();

$(document).ready(function(){
	//app.onDeviceReady();	
});


function initScan(){
	cordova.plugins.barcodeScanner.scan(function(result){
		if (!result.cancelled){
			if (codigosScaneados.indexOf(result.text) == -1){
				console.log("Código escaneado");
				db.transaction(function(tx){
					tx.executeSql("select * from codigo where codigo = ?", [result.text], function(tx, res){
						if (res.rows.length > 0){
							tx.executeSql("update codigo set factura = ?, localizacion = ? where idCode = ?", [
									$("#selFacturaScan").val(),
									$("#selUbicacionScan").val(),
									result.text
								], 
							function(tx, res){
								console.log("Guardado");
								$("#winCodigo").modal("hide");
								showCodigos();
								initScan();
							}, errorDB);
							
							console.log("Código actualizado");
						}else
							mensajes.alert({mensaje: "Código no encontrado", "funcion": function(){
								initScan();
							}, "titulo": "Error"});
					});
				});
				console.log(codigosScaneados);
				codigosScaneados.push(result.text);
			}else{
				mensajes.alert({"mensaje": "Código duplicado", "funcion": function(){
					initScan();
				}, "titulo": "Error"});
			}
		}	
	},function(error){
		showCodigos();
	}, {
		disabledSuccessBeep: false,
		prompt: "Scanea tu código",
		preferFrontCamera: false,
		resultDisplayDuration: 1000
	});
}

function panelDownload(){
	mensajes.confirm({
		"mensaje": "Esto borrará los datos actuales ¿Seguro?",
		"funcion": function(result){
			if (result == 1){
				var modulo = $("[panel=home]");
				modulo.html("");
				
				$.get(ws_batchcodes, function(resp){
					var i = 0;
					db.transaction(function(tx){
						tx.executeSql("delete from codigo", [], function(tx, res){
							$.each(resp, function(i, codigo){
								data = [];
								data.push(codigo.batch_code);
								data.push(codigo.part_name);
								data.push(codigo.quantity);
								
								tx.executeSql("INSERT INTO codigo(codigo, nombre, cantidad) VALUES (?, ?, ?)", data, function(tx, res){
									if (i == resp.length - 1){
										showCodigos();
										mensajes.log({"mensaje": "Códigos cargados"});
									}
									i++;
								}, errorDB);
							});
						}, errorDB);
					});
				}, "json");
				
				$.get(ws_bills, function(resp){
					var i = 0;
					db.transaction(function(tx){
						tx.executeSql("delete from factura", [], function(tx, res){
							$.each(resp, function(i, codigo){
								data = [];
								data.push(codigo.bill_id);
								data.push(codigo.bill_name);
								
								tx.executeSql("INSERT INTO factura(numero, monto) VALUES (?, ?)", data, function(tx, res){
									if (i == resp.length - 1)
										mensajes.log({"mensaje": "Facturas cargadas"});
									i++;
								}, errorDB);
							});
						}, errorDB);
					});
				}, "json");
				
				$.get(ws_localizations, function(resp){
					var i = 0;
					db.transaction(function(tx){
						tx.executeSql("delete from localizacion", [], function(tx, res){
							$.each(resp, function(i, codigo){
								data = [];
								data.push(codigo.local_id);
								data.push(codigo.clave);
								
								tx.executeSql("INSERT INTO localizacion(idLocal, nombre) VALUES (?, ?)", data, function(tx, res){
									if (i == resp.length - 1)
										mensajes.log({"mensaje": "Localizaciones cargadas"});
									i++;
								}, errorDB);
							});
						}, errorDB);
					});
				}, "json");
			}
		}
	});
}

function showCodigos(){
	$("[panel=home]").html(plantillas['codigos']);
	
	db.transaction(function(tx){
		tx.executeSql("select * from codigo", [], function(tx, res){
			for(i = 0 ; i < res.rows.length ; i++){
				var pl = $(plantillas['itemCodigo']);
				$.each(res.rows.item(i), function(campo, valor){
					pl.find("[campo=" + campo + "]").html(valor);
				});
				
				pl.attr("idCodigo", res.rows.item(i).idCode);
				
				pl.click(function(){
					var el = $(this);
					$("#winCodigo").attr("idCodigo", el.attr("idCodigo"));
					$("#scaner").val(0);
					$("#winCodigo").modal();
				});
				
				$("[panel=home]").find("tbody").append(pl);
				
				if (i == res.rows.length - 1) 
					$('#tblCodigos').DataTable({
						"language": espaniol
					});
			}
			
			if (res.rows.length == 0)
				$('#tblCodigos').DataTable({
						"language": espaniol
					});
		});
	});
	
	showPanel("home");
}

function panelUpload(){
	var modulo = $("[panel=home]");
	modulo.html("");
	mensajes.confirm({
		"mensaje": "Estás por enviar la información al servidor ¿seguro?",
		"funcion": function(result){
			if (result == 1){
				db.transaction(function(tx){
					tx.executeSql("select * from codigo", [], function(tx, res){
						var datos = [];
						for(i = 0 ; i < res.rows.length ; i++){
							var data = {};
							
							data.batch_code = res.rows.item(i).codigo;
							data.quantity = res.rows.item(i).cantidad;
							data.local_id = res.rows.item(i).localizacion;
							data.factura = res.rows.item(i).factura;
							datos.push(data);
						}
						
						$.post(ws_upload, {
							"data": JSON.stringify(datos),
						}, function(result){
							modulo.html(result.result);
						}, "json");
					});
				});
			}
		}
	});
}