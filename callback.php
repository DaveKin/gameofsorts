<?php
 
 
if ( ! empty ($_POST['connection_token']))
{
  $oa_application_domain = 'INSERT YOUR APPLICATION SUBDMOAIN';
  $oa_application_public_key = 'INSERT YOUR APPLICATION PUBLIC KEY';
  $oa_application_private_key = 'INSERT YOUR APPLICATION PRIVATE KEY';;
 
  //Connection Resource
  $connection_resource = 'https://'.$oa_application_domain.'/connections/'.$_POST['connection_token'].'.json';
   
  $curl = curl_init();
  curl_setopt($curl, CURLOPT_URL, $connection_resource);
  curl_setopt($curl, CURLOPT_HEADER, 0);
  curl_setopt($curl, CURLOPT_USERPWD, $oa_application_public_key . ":" . $oa_application_private_key);
  curl_setopt($curl, CURLOPT_TIMEOUT, 15);
  curl_setopt($curl, CURLOPT_VERBOSE, 0);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
  curl_setopt($curl, CURLOPT_FAILONERROR, 0);
 
  //Error
  if ( ($json = curl_exec($curl)) === false)
  {
    echo 'Curl error: ' . curl_error($curl);
  }
  //Success
  else
  {
    //Close connection
    curl_close($curl);
 
    //Decode
    $social_data = json_decode($json);
 
    //Output
    print_r ($social_data);
  }
}
   
?>