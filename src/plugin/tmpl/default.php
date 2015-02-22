<div id="simpleimageslider" class="simpleimageslider">
	<div id="sis_photo-frame">
		<img id="sis_photo" alt="SIS_LOADING" src="">
	</div>

	<div id="sis_control">
		<div class="pull-left control-left">
			<a id="sis_arrow-left" href="#" data-slide="prev" onclick="loadPreviousPhoto()">&lsaquo;</a>
		</div>
		<div class="pull-right control-right">
			<a id="sis_arrow-right" href="#" data-slide="next" onclick="loadNextPhoto()">&rsaquo;</a>
		</div>
		<div>
			SIS_IMAGE <span id="sis_photo-position"></span> SIS_OF <span id="sis_number-of-photos"></span>
		</div>
	</div>

	<input id="sis_directory" type="hidden" value="$1" />
	<input id="sis_basepath" type="hidden" value="SIS_BASEPATH" />
</div>
