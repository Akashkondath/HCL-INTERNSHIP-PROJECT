<?php
// Retrieve form data
$userName = $_POST['userName'];
$password = $_POST['password'];
$recaptchaResponse = $_POST['g-recaptcha-response']; // Get CAPTCHA response from form

// Initialize an error message variable
$error = '';

// Verify CAPTCHA
$secretKey = '6LfcaSkqAAAAAMp6mTxhgptBmHFtE6ky1luWD02w'; // Replace with your reCAPTCHA secret key
$captchaVerifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
$response = file_get_contents($captchaVerifyUrl . '?secret=' . $secretKey . '&response=' . $recaptchaResponse);
$responseKeys = json_decode($response, true);

if (!$responseKeys['success']) {
    $error .= "Captcha verification failed.<br>";
}

// Database connection
$conn = new mysqli('localhost', 'root', '', 'createnewaccount');
if ($conn->connect_error) {
    die("Connection Failed: " . $conn->connect_error);
}

// Prepare and execute the SQL statement
$stmt = $conn->prepare("SELECT * FROM newaccount WHERE userName = ? AND password = ?");
$stmt->bind_param("ss", $userName, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0 && empty($error)) {
    // Credentials match and CAPTCHA is verified, redirect to dashboard.html
    header("Location: dashboard.html");
    exit();
} else {
    // Credentials do not match or CAPTCHA failed, display an error message
    if (empty($error)) {
        $error = "Username or password is mismatched.";
    }
    echo "<script>alert('$error'); window.location.href = 'loginpage.html';</script>";
    exit();
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
