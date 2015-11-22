<?php
define("UPLOAD_DIR", "uploads/");

if(isset($_POST["file"])){

	$file_base64 = $_POST["file"];
	$decoded = getImageData($file_base64);
	$name = generate_name($decoded);

	$path = UPLOAD_DIR . $name;

	$wasWritten = file_put_contents($path, $decoded);

	if($wasWritten === false){
		error("File wasn't written");
	}

	chmod($path, 0644);

	echo getSavedImageUrl($path);


}else{
	error("No files provided");
}

function generate_name($data){
	$fileType = getFileType($data);
	$base = "temp";
	if(isset($_POST["guid"])){
		$base = $_POST["guid"];
	}

	$date = new DateTime();
	$timestamp =  $date->getTimestamp();

	return $base . "-" . $timestamp . $fileType;
}

function getImageData($file_base64){
	$file_base64_extracted = preg_replace('#^data:image/\w+;base64,#i', '', $file_base64);

	$decoded = base64_decode($file_base64_extracted);
	return $decoded;
}

function getFileType($image_data){
	$f = finfo_open();
	$mime_type = finfo_buffer($f, $image_data, FILEINFO_MIME_TYPE);
	$ext = get_extension($mime_type);
	if($ext === false){
		error("Unsupported filetype: " . $mime_type);
	}
	return $ext;
}

function get_extension($imagetype)
{
	if(empty($imagetype)) return false;
	switch($imagetype)
	{
		case 'image/bmp': return '.bmp';
		case 'image/gif': return '.gif';
		case 'image/jpeg': return '.jpg';
		case 'image/tiff': return '.tif';
		case 'image/png': return '.png';
		default: return false;
	}
}

function error($msg){
	echo $msg;
	http_response_code(500);
	header('HTTP/1.1 401 Unauthorized', true, 500);
	exit;
}

function getSavedImageUrl($image_path){
	$host = $_SERVER['HTTP_HOST'];
	$path = dirname($_SERVER['PHP_SELF']);

	return "http://" . $host . $path . "/" . $image_path;
	//return "http://dumbainfarm.co.uk/data/uploads/index-btm.jpg";
}
?>