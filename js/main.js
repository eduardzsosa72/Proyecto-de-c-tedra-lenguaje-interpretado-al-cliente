
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("login-form")) {
        initLogin();
    }
});

/* ---------- Login con PIN ---------- */
const PIN_CORRECTO = "1234";   
const PIN_LONGITUD = 4;
const MAX_INTENTOS = 3;

function initLogin() {
    const form = document.getElementById("login-form");
    const input = document.getElementById("pin");
    const keypad = document.getElementById("keypad");
    const dots = document.querySelectorAll("#pin-dots span");
    const message = document.getElementById("pin-message");
    const screen = document.querySelector(".atm__screen");

    let intentos = 0;
    let bloqueado = false;

    function actualizarPuntos() {
        dots.forEach((dot, i) => {
            dot.classList.toggle("filled", i < input.value.length);
        });
    }

    function mostrarMensaje(texto, tipo = "") {
        message.textContent = texto;
        screen.classList.remove("is-error", "is-success");
        if (tipo) screen.classList.add(`is-${tipo}`);
    }

    function agregarDigito(digito) {
        if (bloqueado || input.value.length >= PIN_LONGITUD) return;
        input.value += digito;
        mostrarMensaje("Digite 4 dígitos");
        actualizarPuntos();
    }

    function borrarDigito() {
        if (bloqueado) return;
        input.value = input.value.slice(0, -1);
        actualizarPuntos();
    }

    function limpiarPin() {
        if (bloqueado) return;
        input.value = "";
        mostrarMensaje("Digite 4 dígitos");
        actualizarPuntos();
    }

    function validarPin() {
        if (bloqueado) return;

        const pin = input.value;

        if (!/^\d{4}$/.test(pin)) {
            mostrarMensaje("El PIN debe tener 4 dígitos", "error");
            return;
        }

        if (pin === PIN_CORRECTO) {
            mostrarMensaje("PIN correcto. Bienvenido", "success");
            sessionStorage.setItem("sesionActiva", "true");
            setTimeout(() => {
                window.location.href = "acciones.html";
            }, 1000);
            return;
        }

        intentos++;
        input.value = "";
        actualizarPuntos();

        if (intentos >= MAX_INTENTOS) {
            bloqueado = true;
            mostrarMensaje("Tarjeta bloqueada", "error");
            keypad.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
            return;
        }

        const restantes = MAX_INTENTOS - intentos;
        mostrarMensaje(`PIN incorrecto. Quedan ${restantes} intento(s)`, "error");
    }

    keypad.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        if (btn.dataset.key) {
            agregarDigito(btn.dataset.key);
        } else if (btn.dataset.action === "delete") {
            borrarDigito();
        } else if (btn.dataset.action === "clear") {
            limpiarPin();
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        validarPin();
    });

    document.addEventListener("keydown", (e) => {
        if (/^\d$/.test(e.key)) {
            agregarDigito(e.key);
        } else if (e.key === "Backspace") {
            borrarDigito();
        } else if (e.key === "Escape") {
            limpiarPin();
        } else if (e.key === "Enter") {
            e.preventDefault();
            validarPin();
        }
    });
}
