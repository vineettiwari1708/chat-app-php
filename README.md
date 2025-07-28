# chat-app-php

send.php

<?php
$key = $_POST['key'] ?? '';
if ($key !== 'your-valid-api-key') die('Unauthorized');

$conn = new mysqli("localhost", "dbuser", "dbpass", "dbname");

$username = $_POST['username'] ?? '';
$message = $_POST['message'] ?? '';

if ($username && $message) {
  $stmt = $conn->prepare("INSERT INTO messages (username, message) VALUES (?, ?)");
  $stmt->bind_param("ss", $username, $message);
  $stmt->execute();
  $stmt->close();
}

$conn->close();

get.php

<?php
$key = $_GET['key'] ?? '';
if ($key !== 'your-valid-api-key') die('Unauthorized');

$conn = new mysqli("localhost", "dbuser", "dbpass", "dbname");

$result = $conn->query("SELECT username, message FROM messages ORDER BY id DESC LIMIT 30");

$messages = [];
while ($row = $result->fetch_assoc()) {
  $messages[] = $row;
}

echo json_encode(array_reverse($messages));
$conn->close();


database

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  message TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



