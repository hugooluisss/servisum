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
	onDeviceReady: function() {
		document.addEventListener("backbutton", function(){
			showPanel("home", "slow");
		}, true);
		
		showPanel("login", "slow");
		objUsuario = new TUsuario;
		if (objUsuario.isLogin())
			location.href = "inicio.html";
			
		$("[showPanel]").click(function(){
			showPanel($(this).attr("showPanel"));
		});
		
		
		$("#frmLogin").validate({
			debug: true,
			errorClass: "validateError",
			rules: {
				txtUsuario: "required",
				txtPass: "required"
			},
			wrapper: 'span',
			submitHandler: function(form){
				objUsuario.login({
					'usuario': $("#txtUsuario").val(), 
					'pass': $("#txtPass").val(), 
					fn: {
						before: function(){
							$("#frmLogin [type=submit]").prop("disabled", true);
						},
						after: function(data){
							$("#frmLogin [type=submit]").prop("disabled", false);
							
							if (data.band == true){
								location.href = "inicio.html";
							}else
								mensajes.alert({"mensaje": "Tus datos no son correctos, intenta nuevamente", "titulo": "Identificación de usuario"});
						}
					}
				});
			}
		});
	}
};

//app.initialize();


$(document).ready(function(){
	var datos = {};
	datos['username'] = "produccion";
	jQuery.ajax({
			method: 'POST',
			url: ws_login,
			data: datos,
			async: false,
			headers:{
			},
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader ('Authorization', 'Basic ' + btoa("produccion:4rfvbgt5"));
			},
			success: function(response){
				console.log(response);
			}
		});

    
    console.log('Basic ' + btoa("produccion:4rfvbgt5"));
    
	//app.onDeviceReady();
});