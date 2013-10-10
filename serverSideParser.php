<?php
//This is my server side parser sample.  It's only been tested with my example. 

//get the parameters from URL
$input=$_GET["input"];
$callback=$_GET["callback"];

//Clean input
$input = trim($input);
$input = preg_replace( '/\s+/', ' ', $input);

//Only use valid JSON format.  Check jsonlint.com for info.
$string = file_get_contents("characters.json"); 
$jsonObj = json_decode($string);


$jsonp = $callback . '({ "data": ['; 
foreach($jsonObj->data as $row)
{  
    $fullname = "";
    foreach($row as $key => $val)
    { 
        $fullname = $fullname . " " . $val;
    }
    
    //Check if input exists: 
    $fullname = trim($fullname);
    if (strpos(strtoupper($fullname), strtoupper($input)) !== false)  {
        $jsonp = $jsonp . '{"fullname":"' . $fullname . '"},';
    }

}
$jsonp = rtrim($jsonp, ",") . "]});";  //remove trailing comma and close brackets
echo $jsonp;
?>

