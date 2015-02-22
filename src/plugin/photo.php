<?php
// TODO check if get vars are set, otherwise return false

if (!(isset($_GET['width']) && isset($_GET['height']) && isset($_GET['mode']))) {
    return false;
}

$width = (int) $_GET['width'];
$height = (int) $_GET['height'];

$isFirst = false;
$isLast = false;

$directory = $_GET['directory'];
unset($_GET['directory']);

if (preg_match('/^(([a-z]+)(\/[a-z]+)?)*$/i', $directory) !== 1) {
    return false;
}

if ($directory != '') {
    $directory .= '/';
} 

function getPhotos($searchPath) {

    $photos = array();

    // TODO fix duplicate code
    foreach (glob($searchPath . '/*.jpg') as $photoPath) {
        $filename = substr($photoPath, strrpos($photoPath, '/') + 1); 
        $photos[$filename] = $photoPath;
    }   

    foreach (glob($searchPath . '*', GLOB_ONLYDIR) as $currentPath) {

        foreach (glob($currentPath . '/*.jpg') as $photoPath) { 
            $filename = substr($photoPath, strrpos($photoPath, '/') + 1); 
            $photos[$filename] = $photoPath;
        }   
        $photos = array_merge($photos, getPhotos($currentPath . '/'));
    }   

    return $photos; 
}

$photos = getPhotos('../../../images/' . $directory);

ksort($photos);
$keysOfPhotoArray = array_keys($photos);

switch ($_GET['mode']) {
case 'first':
    $key = 0;
    break;
case 'random':
    $key = array_rand($keysOfPhotoArray);
    break;
case 'last':
    $key = count($photos) - 1;
    break;
case 'previous':
    $keyCurrent = array_search($_GET['currentPhoto'], $photos);
    $keyCurrent = array_search($keyCurrent, $keysOfPhotoArray);
    if ($keyCurrent > 0) {
        $key = $keyCurrent - 1;
        break;
    }
    return false;
case 'next':
    $keyCurrent = array_search($_GET['currentPhoto'], $photos);
    $keyCurrent = array_search($keyCurrent, $keysOfPhotoArray);
    if (count($photos) > ($keyCurrent + 1)) {
        $key = $keyCurrent + 1;
        break;
    }
    return false;
default:
    return false;
}
unset($_GET['mode']); // NOT sanitised
unset($_GET['currentPhoto']);

if ($key == 0) {
    $isFirst = true;
}
if ($key == (count($photos) - 1)) {
    $isLast = true;
}

$photoPath = $photos[$keysOfPhotoArray[$key]];

// TODO check if resized image already exists

$photo = new Imagick($photoPath);

if ($width > $photo->getImageWidth() || $width < 0) {
    $width = $photo->getImageWidth();
}
if ($height > $photo->getImageHeight() || $height < 0) {
    $height = $photo->getImageHeight();
}
$photo->resizeImage($width, $height, null, 1, 1);
$resizedPhotoWidth = $photo->getImageWidth();
$resizedPhotoHeight = $photo->getImageHeight();

$cacheUpDirs = '../../..';
$cachePath = 'cache/simpleimageslider'; // TODO use JPATH_CACHE
$cachePathWithUpDirs = $cacheUpDirs . '/' . $cachePath;

if (!file_exists($cachePathWithUpDirs)) {
	mkdir($cachePathWithUpDirs);
}

$filename = sha1($photoPath . $resizedPhotoWidth . $resizedPhotoHeight) . '.jpg';

$resizedPhotoPath = $cachePathWithUpDirs . '/' . $filename;
if (!file_exists($resizedPhotoPath)) {
    $photo->writeImage($resizedPhotoPath);
}
$photo->destroy();

$returnArray = array(
    'photoPath' => $cachePath . '/' . $filename,
    'photoHeight' => $resizedPhotoHeight,
	'photoOriginalPath' => $photoPath,
    'isFirst' => $isFirst,
    'isLast' => $isLast,
    'currentPhotoPosition' => $key + 1,
    'numberOfPhotos' => count($photos));

echo json_encode($returnArray);
return true;
?>
