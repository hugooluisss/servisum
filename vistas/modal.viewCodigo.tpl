<form class="form-horizontal" id="frmCodigo">
	<div id="winCodigo" class="modal" tabindex="-1" role="dialog">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Detalle <span campo="codigo"></span></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="form-group">
						<label class="control-label col-xs-3" for="txtCodigo">Código</label>
						<div class="col-xs-6">
							<input type="text" class="form-control" id="txtCodigo" name="txtCodigo" campo="codigo" readonly="true" />
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-xs-3" for="txtNombre">Nombre</label>
						<div class="col-xs-9">
							<input type="text" class="form-control" id="txtNombre" name="txtNombre" campo="nombre" readonly="true" />
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-xs-3" for="txtCantidad">Cantidad</label>
						<div class="col-xs-5">
							<input type="text" class="form-control text-right" id="txtCantidad" name="txtCantidad" campo="cantidad"/>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-xs-3" for="selFactura">Factura</label>
						<div class="col-xs-9">
							<select id="selFactura" name="selFactura" class="form-control">
							</select>
						</div>
					</div>
					
					<div class="form-group">
						<label class="control-label col-xs-3" for="selUbicacion">Ubicación</label>
						<div class="col-xs-9">
							<select id="selUbicacion" name="selUbicacion" class="form-control">
							</select>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="submit" class="btn btn-primary">Guardar cambios</button>
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
				</div>
			</div>
		</div>
	</div>
</form>