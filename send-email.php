<?php
// Включаем обработку ошибок
header('Content-Type: application/json');

// Получаем данные из POST запроса
$data = json_decode(file_get_contents('php://input'), true);

// Валидация данных
if (!isset($data['fullName']) || !isset($data['email']) || !isset($data['adminType']) || !isset($data['reason'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Не все поля заполнены']);
    exit;
}

// Адрес вашей почты для получения заявок
$recipientEmail = 'timosha2040@gmail.com'; // ИЗМЕНИТЕ НА ВАШУ ПОЧТУ!

// Формируем данные
$fullName = htmlspecialchars($data['fullName']);
$email = htmlspecialchars($data['email']);
$telegram = htmlspecialchars($data['telegram']);
$adminType = htmlspecialchars($data['adminType']);
$experience = htmlspecialchars($data['experience']);
$reason = htmlspecialchars($data['reason']);

// Формируем заголовки письма
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: <no-reply@nightheart.site>\r\n";

// Формируем тему письма
$subject = "Новая заявка в админы - Ночное сердце от " . $fullName;

// Формируем текст письма
$emailBody = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ff1493, #ff69b4); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px; }
        .content { color: #333; line-height: 1.6; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #ff1493; }
        .value { padding: 10px; background-color: #f9f9f9; border-left: 3px solid #ff1493; margin-top: 5px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>❤️ Новая заявка в админы</h2>
            <p>Ночное сердце - Бот поддержки Telegram</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Полное имя:</div>
                <div class='value'>$fullName</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>$email</div>
            </div>
            <div class='field'>
                <div class='label'>Telegram аккаунт:</div>
                <div class='value'>$telegram</div>
            </div>
            <div class='field'>
                <div class='label'>Тип админа:</div>
                <div class='value'><strong>$adminType</strong></div>
            </div>
            <div class='field'>
                <div class='label'>Опыт в модерации:</div>
                <div class='value'>$experience</div>
            </div>
            <div class='field'>
                <div class='label'>Причина присоединения:</div>
                <div class='value'>$reason</div>
            </div>
        </div>
        <div class='footer'>
            <p>Это автоматическое письмо с формы подачи заявки на сайте nightheart.site</p>
            <p>Отправлено: " . date('Y-m-d H:i:s') . "</p>
        </div>
    </div>
</body>
</html>
";

// Отправляем письмо
if (mail($recipientEmail, $subject, $emailBody, $headers)) {
    // Также отправляем письмо подтверждения пользователю
    $userSubject = "Ваша заявка в админы получена - Ночное сердце";
    $userBody = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ff1493, #ff69b4); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px; }
        .content { color: #333; line-height: 1.6; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>❤️ Заявка получена!</h2>
        </div>
        <div class='content'>
            <p>Привет, $fullName!</p>
            <p>Спасибо за вашу заявку в админы проекта <strong>Ночное сердце</strong>! 🎉</p>
            <p>Мы получили вашу заявку и внимательно её рассмотрим. Обычно ответ приходит в течение 3-7 дней.</p>
            <p><strong>Данные вашей заявки:</strong></p>
            <ul>
                <li>Имя: $fullName</li>
                <li>Email: $email</li>
                <li>Telegram: $telegram</li>
                <li>Тип админа: $adminType</li>
            </ul>
            <p>Если у вас есть вопросы, свяжитесь с нами в Telegram: <a href='https://t.me/nightlovesbot'>@nightlovesbot</a></p>
            <p>С уважением,<br><strong>Команда Ночного сердца ❤️</strong></p>
        </div>
        <div class='footer'>
            <p>© 2025 Ночное сердце - Бот поддержки для Telegram</p>
        </div>
    </div>
</body>
</html>
";
    $userHeaders = "MIME-Version: 1.0\r\n";
    $userHeaders .= "Content-type: text/html; charset=UTF-8\r\n";
    $userHeaders .= "From: <no-reply@nightheart.site>\r\n";
    
    mail($email, $userSubject, $userBody, $userHeaders);
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена! Проверьте почту.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка при отправке. Попробуйте позже.']);
}
?>
