jQuery(document).ready(function() {
	setDirectory(jQuery('#sis_directory').val());
	//loadFirstPhoto(true); // done in set directory
});

function loadPreviousPhoto() {
    var currentPhoto = jQuery('#sis_photo').attr('alt');
    loadPhoto('previous', currentPhoto);
}

function loadNextPhoto() {
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

    var width = jQuery('#simpleimageslider').width();
    var height = jQuery('#simpleimageslider').height();

    jQuery('#sis_arrow-left').css('display', 'none');
    jQuery('#sis_arrow-right').css('display', 'none');

    jQuery.ajax({
        dataType: 'json',
        type: 'GET',
        url: jQuery('#sis_basepath').val() + 'plugins/content/simpleimageslider/photo.php',
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
            stopSlideshow();
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

            /*if (height == data.photoHeight) {
                photo.css('border-width', '0 3px');
            } else {
                photo.css('border-width', '3px 0');
            }
            photo.css('border-style', 'solid');
            photo.css('border-color', '#FFFFFF');*/

            photo.load(function() {
                photo.fadeIn(1000);
            });

        })
    })
}

var slideshowTimer;
var firstPhoto = false;
var lastPhoto = false;

function toggleSlideshow() {
    if (slideshowTimer) {
        stopSlideshow();
    } else {
        startSlideshow();
    }
}

function startSlideshow() {
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

    var category = jQuery('#sis_category');
    var categoryButton = jQuery('#sis_category-button');

    if (directory == '') {
        category.text('All Photos');
    } else {
		var lastIndex = directory.lastIndexOf('/');

		if (lastIndex >= 0) {
			directory = directory.substring(lastIndex + 1, directory.length);
		}
        category.text(directory);
    }
    loadFirstPhoto(false);
}
