<?php
define("UPLOAD_DIR", "uploads/");

if (!empty($_FILES["file"])) {
	$file = $_FILES["file"];

	if ($file["error"] !== UPLOAD_ERR_OK) {
		echo "<p>An error occurred.</p>";
		exit;
	}

    // ensure a safe filename
	$name = preg_replace("/[^A-Z0-9._-]/i", "_", $file["name"]);

    // don't overwrite an existing file
	$i = 0;
	$parts = pathinfo($name);
	while (file_exists(UPLOAD_DIR . $name)) {
		$i++;
		$name = $parts["filename"] . "-" . $i . "." . $parts["extension"];
	}

    // preserve file from temporary directory
	$success = move_uploaded_file($file["tmp_name"],
		UPLOAD_DIR . $name);


	if (!$success) { 
		echo "<p>Unable to save file.</p>";
		http_response_code(500);
		exit;
	}else{
		$host = $_SERVER['HTTP_HOST'];
		$path = dirname($_SERVER['PHP_SELF']);

		// echo "http://" . $host . $path . "/" . UPLOAD_DIR . $name;
		echo "http://dumbainfarm.co.uk/data/uploads/index-btm.jpg";
	}

    // set proper permissions on the new file
	chmod(UPLOAD_DIR . $name, 0644);
}else{
	echo "No files provided";
	http_response_code(500);
	header('HTTP/1.1 401 Unauthorized', true, 500);
}
?>