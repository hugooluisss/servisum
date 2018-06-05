TUsuario = function(){
	var self = this;
	self.idUsuario = window.localStorage.getItem("session");
	self.datos = {};
	
	this.isLogin = function(){
		if (self.idUsuario == '' || self.idUsuario == undefined || self.idUsuario == null) return false;
		if (self.idUsuario != window.localStorage.getItem("session")) return false;
		
		return true;
	};
	
	this.login = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		//window.localStorage.setItem("session", true);
		
		//if (datos.fn.after !== undefined) datos.fn.after({band: true});
				
		/*
		$.post(server + 'clogin', {
			"usuario": datos.usuario,
			"pass": datos.pass, 
			"action": 'login',
			"movil": 'true'
		}, function(resp){
			if (resp.band == false)
				console.log(resp.mensaje);
			else{
				window.localStorage.setItem("session", resp.datos.usuario);
				self.idUsuario = resp.datos.idUsuario;
			}
				
			if (datos.fn.after !== undefined)
				datos.fn.after(resp);
		}, "json");
		*/
		
		var datos = {};
		d['username'] = datos.usuario;
		jQuery.ajax({
			method: 'POST',
			url: ws_login,
			data: d,
			async: false,
			headers:{
			},
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader ('Authorization', 'Basic ' + btoa(datos.usuario + ":" + datos.pass));
			},
			success: function(response){
				if (response == true){
					window.localStorage.setItem("session", btoa("produccion:4rfvbgt5"));
					if (datos.fn.after !== undefined) datos.fn.after({band: true});
				}else
					if (datos.fn.after !== undefined) datos.fn.after({band: false});
			}
		});
	};
};