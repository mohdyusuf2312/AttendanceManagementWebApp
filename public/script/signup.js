document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent form from submitting normally

    // Clear previous error messages
    document.getElementById("emailError").style.display = "none";
    document.getElementById("passwordError").style.display = "none";

    // Get form data
    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
        password: document.getElementById("password").value,
        confirmPassword: document.getElementById("confirmPassword").value,
    };

    // Send data to backend using fetch API
    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        // Handle errors if they exist
        if (!response.ok) {
            if (result.message === "Email is already registered.") {
                document.getElementById("emailError").style.display = "block";
                document.getElementById("emailError").textContent = result.message;
            }
            if (result.message === "Passwords do not match.") {
                document.getElementById("passwordError").style.display = "block";
                document.getElementById("passwordError").textContent = result.message;
            }
        } else {
            // Registration successful - redirect to login or success page
            alert("Registration successful!");
            window.location.href = "../teacher/teacherLogin.html";
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
