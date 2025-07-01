let userEmail = '';

// Kod gönderme işlemi
document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    userEmail = document.getElementById('email').value;

    try {
        const response = await fetch('http://localhost:3002/api/send-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Verification code sent to your email.');

            document.getElementById('login-form').style.display = 'none';
            document.getElementById('code-form').style.display = 'block';
        } else {
            alert(data.message || 'Failed to send code.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Something went wrong while sending the code!');
    }
});

// Kod doğrulama işlemi
document.getElementById('code-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const code = document.getElementById('verification-code').value;

    try {
        const response = await fetch('http://localhost:3002/api/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, code })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login successful!');
            // Email bilgisini localStorage'a kaydet
            localStorage.setItem('userEmail', userEmail);

            // Modalı kapat
            document.querySelector('.bg-modal').style.display = 'none';

            // Navbar'daki Login yazısını değiştir
            const username = userEmail.split('@')[0];
            const loginLink = document.getElementById('login');
            loginLink.textContent = `Hi, ${username}`;
            loginLink.href = '#';
            loginLink.onclick = null;
        } else {
            alert(data.message || 'Invalid or expired code.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Verification failed!');
    }
});
