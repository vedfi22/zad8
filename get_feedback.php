<?php
require_once 'db_connect.php';

$sql = "SELECT name, message, created_at FROM feedback ORDER BY created_at DESC LIMIT 5";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo '<div class="card mb-3">';
        echo '<div class="card-body">';
        echo '<h5 class="card-title">' . htmlspecialchars($row['name']) . '</h5>';
        echo '<p class="card-text">' . nl2br(htmlspecialchars($row['message'])) . '</p>';
        echo '<small class="text-muted">' . date('d.m.Y H:i', strtotime($row['created_at'])) . '</small>';
        echo '</div></div>';
    }
} else {
    echo '<p>Пока нет отзывов. Будьте первым!</p>';
}

$conn->close();
?>