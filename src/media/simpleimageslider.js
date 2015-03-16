jQuery(document).ready(function() {
	setDirectory(jQuery('#sis_directory').val());
	loadData();
	//loadFirstPhoto(true); // done in set directory
});

function loadPreviousPhoto() {
    var currentPhoto = jQuery('#sis_photo').attr('alt');
    loadPhoto('previous', currentPhoto);
}

function loadNextPhoto() {

	if (lastPhoto && loopMode) {
		return loadFirstPhoto(false);
	}

    var currentPhoto = jQuery('#sis_photo').attr('alt');
    loadPhoto('next', currentPhoto);
}

function loadRandomPhoto(firstCall) {
    firstCall = firstCall || false;
    loadPhoto('random', null, firstCall);
}

function loadFirstPhoto(firstCall) {
    firstCall = firstCall || false;
    loadPhoto('first', null, firstCall);
}

function loadLastPhoto(firstCall) {
    firstCall = firstCall || false;
    loadPhoto('last', null, firstCall);
}

function loadPhoto(mode, currentPhoto, firstCall) {

    mode = mode || 'random';
    currentPhoto = currentPhoto || null;
    firstCall = firstCall || false;

    var width = jQuery('#sis_photo-frame').width();
    var height = jQuery('#sis_photo-frame').height();

    jQuery('#sis_arrow-left').css('display', 'none');
    jQuery('#sis_arrow-right').css('display', 'none');

    jQuery.ajax({
        dataType: 'json',
        type: 'GET',
        url: jQuery('#sis_basepath').val() + 'index.php?option=com_ajax&plugin=simpleimageslider&format=raw',
        data: {width: width, height: height, mode: mode, currentPhoto: currentPhoto, directory: directory}

    }).done(function(data) {

        var photo = jQuery('#sis_photo');
        var fadeOutTime = 1000;
        if (firstCall) {
            fadeOutTime = 0;
        }

        if (!data.isFirst && !slideshowTimer) {
            jQuery('#sis_arrow-left').css('display', '');
        }
        if (!data.isLast && !slideshowTimer) {
            jQuery('#sis_arrow-right').css('display', '');
        }

        firstPhoto = data.isFirst;
        lastPhoto = data.isLast;

        if (data.isLast && slideshowTimer) {

			if (!loopMode) {
				stopSlideshow();
			}
        }

        jQuery('#sis_photo-position').text(data.currentPhotoPosition);
        jQuery('#sis_number-of-photos').text(data.numberOfPhotos);

        photo.fadeOut(fadeOutTime, function() {

            photo.attr('src', jQuery('#sis_basepath').val() + data.photoPath);
            photo.attr('alt', data.photoOriginalPath);

            var marginTop = 0
            if (height != data.photoHeight) {
                marginTop = (height - data.photoHeight - 6)/2;
            }
            photo.css('margin-top', marginTop + 'px');

            photo.load(function() {
                photo.fadeIn(1000);
				setCaption(data.photoOriginalPath);
            });

        })
    })
}

var slideshowTimer;
var firstPhoto = false;
var lastPhoto = false;
var loopMode = false;

function toggleSlideshow() {
    if (slideshowTimer) {
        stopSlideshow();
    } else {
        startSlideshow(false);
    }
}

function startSlideshow(loopModeParam) {

	loopMode = loopModeParam;

    if (!lastPhoto) {
        slideshowTimer = setInterval('loadNextPhoto()', 5000);

        jQuery('#sis_slideshow-icon').attr('class', 'icon-stop icon-white');
        jQuery('#sis_category-button').addClass('disabled');
        jQuery('#sis_photos-button').addClass('disabled');

        jQuery('#sis_arrow-left').css('display', 'none');
        jQuery('#sis_arrow-right').css('display', 'none');
    }
}

function stopSlideshow() {
    clearInterval(slideshowTimer);
    slideshowTimer = undefined;

    jQuery('#sis_slideshow-icon').attr('class', 'icon-play icon-white');
    jQuery('#sis_category-button').removeClass('disabled');
    jQuery('#sis_photos-button').removeClass('disabled');

    jQuery('#sis_arrow-left').css('display', 'none');
    jQuery('#sis_arrow-right').css('display', 'none');

    if (!firstPhoto) {
        jQuery('#sis_arrow-left').css('display', '');
    }
    if (!lastPhoto) {
        jQuery('#sis_arrow-right').css('display', '');
    }
}

var directory = '';

function setDirectory(directory) {

    this.directory = directory;
    loadFirstPhoto(false);
}

var data;

function loadData() {

	jQuery.getJSON('images/' + directory + '/data.json', function(data) {
		parent.data = data;
	});
}

function setCaption(photoOriginalPath) { // TODO rename to updateCaption?

	if (this.data != undefined && this.data != null) {

		var lastIndex = photoOriginalPath.lastIndexOf('/');
		if (lastIndex >= 0) {
			var filename = photoOriginalPath.substring(lastIndex + 1, photoOriginalPath.length);
		}

		var caption = jQuery('#sis_photo-caption');
		if (filename != undefined && this.data[filename] != undefined) { // TODO does data.filename work?
			caption.text(this.data[filename]);
    		caption.css('display', '');
		} else {
			caption.text('');
    		caption.css('display', 'none');
		}

	}
}
