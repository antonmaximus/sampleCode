<?php
//This is my server side parser sample.  It's only been tested with my example. 

//get the parameters from URL
$input=$_GET["input"];
$callback=$_GET["callback"];


//send a "VALID" json file
$string = file_get_contents("employees2.json"); //only VALID JSON format please.  Check JSONLINT.com
$stringSample = '{"entries":[{"id": "29","name":"John", "age":"36"},{"id": "30","name":"Jack", "age":"23"}]}';


$jsonOrig = json_decode($string);
$jsonSample = json_decode($stringSample);

//Create JSON string
$toPass = "{"; 
foreach($jsonOrig as $key1 => $val1) {
    $toPass = $toPass . " ".  $key1 . ": ["; 
    
    foreach($jsonOrig->data as $row)
    {  
        $fullName = ""; 
        $testName = "";
        foreach($row as $key => $val)
        { 
            $newVal = ""; 
            $val = str_replace(" ", "", $val); 
            if (ctype_digit($val)) {
                    // Your Convert logic
                    $newVal = $val; 
                } else {
                    // Do not convert print error message
                    $newVal = "'" . $val . "'"; //add quotes.
                }

            $fullName = $fullName . " " . $key . ": " .  $newVal . ","; 
            $testName = $testName . $val . " "; 
        }

        if (strpos(strtoupper($testName), strtoupper($input)) != false)  {
            $toPass =  $toPass . " {" . rtrim($fullName, ",") . "},"; 
        }
    }
    $toPass = rtrim($toPass, ",") . "]"; 
}
 $toPass = rtrim($toPass, ",") . "}"; 

echo $toPass; 
//echo $string; 



?>