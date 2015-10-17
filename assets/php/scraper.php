<?php

include('simple_html_dom.php');

if($_SERVER['REQUEST_METHOD'] != "GET"){
    error();
}


$parts = parse_url($_SERVER['REQUEST_URI']);
parse_str($parts['query'], $exploded);

$paramNo = count($exploded);
if($paramNo != 1){
    error("Incorrect number of parameters " . $paramNo);
}

if(!isset($exploded['url'])){
    error("Only accept url params");
}

$url = $exploded['url'];

if (filter_var($url, FILTER_VALIDATE_URL) === FALSE) {
    error('Not a valid URL');
}

scrape_url($url);

function error($msg){
    header('HTTP/1.1 404 Not Found');
    echo $msg;
    exit;
}

function scrape_url($url){
    $content = open_url($url);

    $html =  get_html_contents($content);
    $results =  get_full_result_block($html);
    $results = array_reverse($results);

    $response = array();

    foreach($results as $e) {
      $result = new stdClass();

      $link = $e->find('h3 a', 0);
      $result->title = $link->innertext;
      $result->url = $link->href;
      $result->cite = $e->find('cite', 0)->innertext;
      $result->description = $e->find('span.st', 0)->innertext;

      array_push($response, $result);
  }

  header('Content-Type: application/json');
  echo json_encode($response);
}

function get_html_contents($full_url) {
        return str_get_html($full_url); // simplehtmldom's function
    }

    function get_full_result_block($html) {
        return $html->find('div#search .srg .rc');
    }


    function open_url($img_url){
        $full_url = "https://www.google.com/searchbyimage?&image_url=" . $img_url;
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $full_url);
        curl_setopt($curl, CURLOPT_HEADER, 0);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_REFERER, 'http://www.kaizern.com');
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11");
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        $content = utf8_decode(curl_exec($curl));
        curl_close($curl);
        return $content;
    }

    
    ?>

