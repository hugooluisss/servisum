<div id="winScan" class="modal form-horizontal" tabindex="-1" role="dialog">
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
					<label class="control-label col-xs-3" for="selFacturaScan">Factura</label>
					<div class="col-xs-9">
						<select id="selFacturaScan" name="selFacturaScan" class="form-control">
						</select>
					</div>
				</div>
				
				<div class="form-group">
					<label class="control-label col-xs-3" for="selUbicacion">Ubicación</label>
					<div class="col-xs-9">
						<select id="selUbicacionScan" name="selUbicacionScan" class="form-control">
						</select>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" id="btnScanCamera" class="btn btn-primary">Iniciar</button>
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
			</div>
		</div>
	</div>
</div>