const API_URL = 'http://localhost:3000';

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email    = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorDiv = document.getElementById('error-message');

        mostrarError(errorDiv, '');

        if (!email || !password) {
            mostrarError(errorDiv, 'Por favor completa todos los campos.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                mostrarError(errorDiv, data.message || 'Correo o contraseña incorrectos.');
                return;
            }

            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));

            redirigirPorRol(data.data.user.role);

        } catch (error) {
            mostrarError(errorDiv, 'No se pudo conectar con el servidor. Intenta más tarde.');
        }
    });
}

function mostrarError(elemento, mensaje) {
    if (!elemento) return;
    elemento.textContent = mensaje;
    elemento.style.display = mensaje ? 'block' : 'none';
}

function redirigirPorRol(rol) {
    switch (rol) {
        case 'admin':
            window.location.href = 'dashboards/dashboard-admin.html';
            break;
        case 'coach':
            window.location.href = 'dashboards/dashboard-coach.html';
            break;
        default:
            window.location.href = 'dashboards/dashboard-user.html';
            break;
    }
}

function checkSession() {
    const token    = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
        window.location.href = '../login.html';
        return;
    }

    const user = JSON.parse(userData);
    const nameElement = document.getElementById('display-name');
    if (nameElement) nameElement.textContent = user.full_name;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../login.html';
}