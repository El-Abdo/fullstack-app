<?php

require __DIR__ . '/../vendor/autoload.php';

use Abdelrahman\Backend\Config\DB;
use Abdelrahman\Backend\Controller\GraphQLController;
use Abdelrahman\Backend\Repository\ProductRepository;
use FastRoute\RouteCollector;

use function FastRoute\simpleDispatcher;

$dispatcher = simpleDispatcher(function (RouteCollector $r) {
    $r->post('/', [GraphQLController::class, 'handle']);
});

$routeInfo = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        http_response_code(404);
        echo json_encode(['error' => 'Not Found']);
        break;

    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;

    case FastRoute\Dispatcher::FOUND:
        [$class, $method] = $routeInfo[1];
        $vars = $routeInfo[2];

        // Setup dependencies
        $db = DB::createConnection();
        $repository = new ProductRepository($db);
        $controller = new $class($repository);

        header('Content-Type: application/json');
        echo $controller->$method($vars);
        break;
}
