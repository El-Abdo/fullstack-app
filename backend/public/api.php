<?php
header("Content-Type: application/json");

$response = [
    "status" => "success",
    "message" => "aloooo from AlwaysData!"
];

echo json_encode($response);
