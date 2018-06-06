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
		
		var d = {};
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
					window.localStorage.setItem("session", btoa(datos.usuario + ":" + datos.pass));
					if (datos.fn.after !== undefined) datos.fn.after({band: true});
				}else{
					alert("False");
					if (datos.fn.after !== undefined) datos.fn.after({band: false});
					
				}
			}
		});
	};
};