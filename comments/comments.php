<?php
$scriptInvokedFromCli = isset($_SERVER['argv'][0]) && $_SERVER['argv'][0] === 'comments.php';
if($scriptInvokedFromCli) {
  $port = getenv('PORT');
  if (empty($port)) {
    $port = "3000";
  }
  echo 'starting server on port '. $port . PHP_EOL;
  exec('php -S localhost:'. $port . ' -t . comments.php');
} else {
  return routeRequest();
}

function routeRequest()
{
  $comments = file_get_contents('comments.json');
  $uri = $_SERVER['REQUEST_URI'];
  if ($uri == '/') {
    echo file_get_contents('./index.html');
  } elseif (preg_match('/\/api\/comments(\?.*)?/', $uri)) {
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
      $commentsDecoded = json_decode($comments, true);
      $commentsDecoded[] = [
        'id'      => round(microtime(true) * 1000),
        'author'  => $_POST['author'],
        'text'    => $_POST['text']
      ];
      $comments = json_encode($commentsDecoded, JSON_PRETTY_PRINT);
      file_put_contents('comments.json', $comments);
    }
    header('Content-Type: application/json');
    header('Cache-Control: no-cache');
    echo $comments;
  } else {
    return false;
  }
}