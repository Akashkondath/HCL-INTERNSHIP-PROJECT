document.querySelector("form").addEventListener("submit", function(event) {
    // Get form values
    let firstName = document.querySelector("[name='firstName']").value;
    let lastName = document.querySelector("[name='lastName']").value;
    let password = document.querySelector("[name='password']").value;
    let confirmPassword = document.querySelector("[name='confirmPassword']").value;
    let termsAccepted = document.querySelector("[name='terms']").checked;

    // Initialize error message
    let errorMessage = "";

    // Name validation using regex
    let nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        errorMessage += "Names should contain only letters.\n";
    }

    // Password matching validation
    if (password !== confirmPassword) {
        errorMessage += "Passwords do not match.\n";
    }

    // Check if terms and conditions checkbox is checked
    if (!termsAccepted) {
        errorMessage += "You must agree to the terms and conditions.\n";
    }

    // Display errors and prevent form submission if there are errors
    if (errorMessage) {
        alert(errorMessage);
        event.preventDefault(); // Prevent form submission
        return;
    }
});


// Firebase configuration from your Firebase project
const firebaseConfig = {
    apiKey: "AIzaSyBvm7QBjWmdmK-ZYURImGQjI_vf5Wxi9Ho",
    authDomain: "akash-hcl-project.firebaseapp.com",
    projectId: "akash-hcl-project",
    storageBucket: "akash-hcl-project.appspot.com",
    messagingSenderId: "918457794174",
    appId: "1:918457794174:web:2daeda20c98e0ebea6a22f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Setup reCAPTCHA
window.onload = function() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': function(response) {
            // reCAPTCHA solved - allow user to send OTP
        }
    });
};

// Send OTP
document.getElementById('send-otp').onclick = function() {
    const phoneNumber = "+91" + document.getElementById('mobileNumber').value; // Modify this according to your country code
    const appVerifier = window.recaptchaVerifier;

    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function(confirmationResult) {
            window.confirmationResult = confirmationResult;
            alert('OTP sent successfully!');
        }).catch(function(error) {
            alert(error.message);
        });
};

// Verify OTP
document.getElementById('signin').onclick = function() {
    const code = document.getElementById('otp').value;
    window.confirmationResult.confirm(code).then(function(result) {
        // OTP verified successfully
        alert('Account created successfully!');
        // You can now submit the form or redirect to another page
        document.getElementById('sign-in-form').submit();
    }).catch(function(error) {
        alert('Invalid OTP, please try again.');
    });
};
