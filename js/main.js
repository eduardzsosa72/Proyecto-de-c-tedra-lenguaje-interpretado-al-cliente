

document.addEventListener("DOMContentLoaded", () => {
    const pagina = document.body.dataset.page;

    // Las vistas internas solo se pueden ver con sesión iniciada
    const protegidas = ["acciones", "deposito", "retiro", "servicios", "historial", "grafico"];
    if (protegidas.includes(pagina) && !sesionActiva()) {
        window.location.replace("login.html");
        return;
    }

    mostrarDatosCuenta();
    initSalir();

    const vistas = {
        login: initLogin,
        acciones: initAcciones,
        deposito: () => initOperacion("deposito"),
        retiro: () => initOperacion("retiro"),
        servicios: () => initOperacion("servicio"),
        historial: initHistorial,
        grafico: initGrafico
    };

    if (vistas[pagina]) vistas[pagina]();
});

const STORAGE_KEY = "pokebank-cuenta";

const LIMITE_DEPOSITO = 1000;
const LIMITE_RETIRO = 500;

const SERVICIOS = {
    energia: "Energía eléctrica",
    agua: "Agua potable",
    internet: "Internet",
    telefonia: "Telefonía"
};

const CUENTA_INICIAL = {
    titular: "Brock Harrison",
    numero: "POKE-7842-1956",
    pin: "1234",
    saldoApertura: 1160,
    movimientos: [
        { fecha: "2026-07-05", tipo: "Depósito", descripcion: "Depósito en efectivo", monto: 450 },
        { fecha: "2026-07-12", tipo: "Retiro", descripcion: "Retiro en cajero", monto: -200 },
        { fecha: "2026-07-20", tipo: "Servicio", descripcion: "Pago de energía eléctrica", servicio: "Energía eléctrica", monto: -80 },
        { fecha: "2026-08-03", tipo: "Depósito", descripcion: "Depósito en efectivo", monto: 380 },
        { fecha: "2026-08-10", tipo: "Retiro", descripcion: "Retiro en cajero", monto: -300 },
        { fecha: "2026-08-18", tipo: "Servicio", descripcion: "Pago de internet", servicio: "Internet", monto: -45 },
        { fecha: "2026-08-25", tipo: "Servicio", descripcion: "Pago de agua potable", servicio: "Agua potable", monto: -30 },
        { fecha: "2026-08-28", tipo: "Servicio", descripcion: "Pago de telefonía", servicio: "Telefonía", monto: -35 },
        { fecha: "2026-09-02", tipo: "Depósito", descripcion: "Depósito en efectivo", monto: 520 },
        { fecha: "2026-09-09", tipo: "Retiro", descripcion: "Retiro en cajero", monto: -200 },
        { fecha: "2026-09-15", tipo: "Servicio", descripcion: "Pago de energía eléctrica", servicio: "Energía eléctrica", monto: -85 },
        { fecha: "2026-09-22", tipo: "Servicio", descripcion: "Pago de internet", servicio: "Internet", monto: -35 },
        { fecha: "2026-10-01", tipo: "Servicio", descripcion: "Pago de telefonía", servicio: "Telefonía", monto: -35 },
        { fecha: "2026-10-03", tipo: "Depósito", descripcion: "Depósito en efectivo", monto: 500 },
        { fecha: "2026-10-05", tipo: "Servicio", descripcion: "Pago de agua potable", servicio: "Agua potable", monto: -28 },
        { fecha: "2026-10-08", tipo: "Retiro", descripcion: "Retiro en cajero", monto: -150 },
        { fecha: "2026-10-10", tipo: "Servicio", descripcion: "Pago de internet", servicio: "Internet", monto: -45 },
        { fecha: "2026-10-12", tipo: "Depósito", descripcion: "Depósito en efectivo", monto: 600 },
        { fecha: "2026-10-14", tipo: "Retiro", descripcion: "Retiro en cajero", monto: -200 },
        { fecha: "2026-10-15", tipo: "Servicio", descripcion: "Pago de energía eléctrica", servicio: "Energía eléctrica", monto: -85 },
        { fecha: "2026-10-16", tipo: "Depósito", descripcion: "Depósito en efectivo", monto: 400 }
    ]
};

function obtenerCuenta() {
    try {
        const guardada = localStorage.getItem(STORAGE_KEY);
        if (guardada) return JSON.parse(guardada);
    } catch (error) {
        // Si localStorage no está disponible se usan los datos de ejemplo
    }
    return structuredClone(CUENTA_INICIAL);
}

function guardarCuenta(cuenta) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cuenta));
    } catch (error) {
        // Sin localStorage los cambios solo duran mientras la página esté abierta
    }
}

function reiniciarCuenta() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        // Nada que borrar
    }
}

// El saldo se calcula a partir de los movimientos para que siempre cuadre
function calcularSaldo(cuenta) {
    return cuenta.movimientos.reduce((saldo, m) => saldo + m.monto, cuenta.saldoApertura);
}

function registrarMovimiento(datos) {
    const cuenta = obtenerCuenta();
    const ahora = new Date();
    const movimiento = {
        id: "TRX-" + Math.floor(100000 + Math.random() * 900000),
        fecha: fechaISO(ahora),
        hora: ahora.toLocaleTimeString("es-SV", { hour: "2-digit", minute: "2-digit" }),
        ...datos
    };
    const saldoAnterior = calcularSaldo(cuenta);

    cuenta.movimientos.push(movimiento);
    guardarCuenta(cuenta);

    return { cuenta, movimiento, saldoAnterior, saldoActual: calcularSaldo(cuenta) };
}


const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function formato(valor) {
    return "$ " + valor.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatoMovimiento(monto) {
    return (monto >= 0 ? "+ " : "- ") + formato(Math.abs(monto));
}

function fechaISO(fecha) {
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${fecha.getFullYear()}-${mes}-${dia}`;
}

// "2026-10-16" -> "16/10/2026"
function fechaCorta(iso) {
    const [anio, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${anio}`;
}

function cuentaOculta(numero) {
    return "****-****-" + numero.slice(-4);
}

function sesionActiva() {
    return sessionStorage.getItem("sesionActiva") === "true";
}

function alerta({ icon, title, text, html, confirmar = "Aceptar", cancelar, cargando = false, timer }) {
    const opciones = { title, icon, closeOnClickOutside: !cancelar && !cargando };

    if (html) {
        const contenido = document.createElement("div");
        contenido.innerHTML = html;
        opciones.content = contenido;
    } else if (text) {
        opciones.text = text;
    }

    if (timer) {
        opciones.timer = timer;
        opciones.buttons = false;
    } else {
        opciones.buttons = {};
        if (cancelar) {
            opciones.buttons.cancel = { text: cancelar, value: null, visible: true, closeModal: true };
        }
        opciones.buttons.confirm = { text: confirmar, value: true, closeModal: !cargando };
    }

    return swal(opciones);
}

// Llena los elementos marcados con data-cuenta="titular|numero|saldo"
function mostrarDatosCuenta() {
    const cuenta = obtenerCuenta();
    const valores = {
        titular: cuenta.titular,
        numero: cuenta.numero,
        saldo: formato(calcularSaldo(cuenta))
    };

    document.querySelectorAll("[data-cuenta]").forEach((el) => {
        el.textContent = valores[el.dataset.cuenta];
    });
}


function initSalir() {
    document.querySelectorAll("[data-action='salir']").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            alerta({
                icon: "warning",
                title: "¿Deseas salir?",
                text: "Se cerrará tu sesión y volverás al ingreso por PIN.",
                confirmar: "Sí, salir",
                cancelar: "Cancelar"
            }).then((confirmado) => {
                if (!confirmado) return;
                sessionStorage.removeItem("sesionActiva");
                window.location.href = "../index.html";
            });
        });
    });
}

const PIN_LONGITUD = 4;
const MAX_INTENTOS = 3;

const REGLAS_PIN = {
    pin: {
        presence: { allowEmpty: false, message: "^Ingrese su PIN" },
        length: { is: PIN_LONGITUD, wrongLength: "^El PIN debe tener 4 dígitos" },
        format: { pattern: "^[0-9]{4}$", message: "^El PIN solo admite números" }
    }
};

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

        // 1. Formato del PIN con validate.js
        const errores = validate({ pin }, REGLAS_PIN, { fullMessages: false });
        if (errores) {
            mostrarMensaje(errores.pin[0], "error");
            return;
        }

        // 2. Comparación con el PIN de la cuenta
        if (pin === obtenerCuenta().pin) {
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
            alerta({
                icon: "error",
                title: "Tarjeta bloqueada",
                text: "Superaste el número de intentos permitidos. Acércate a una agencia Pokémon Bank."
            });
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


function initAcciones() {
    // Consulta de saldo con SweetAlert (puede haber más de un botón)
    document.querySelectorAll("[data-action='saldo']").forEach((btn) => {
        btn.addEventListener("click", () => {
            const cuenta = obtenerCuenta();
            alerta({
                icon: "info",
                title: "Consulta de saldo",
                html: `Cuenta <b>${cuenta.numero}</b><br>
                       Saldo disponible: <b>${formato(calcularSaldo(cuenta))}</b>`
            });
        });
    });
}


// Reglas de validate.js para el monto según la operación
function reglasMonto(operacion, saldo) {
    const numericality = {
        greaterThan: 0,
        notValid: "^Ingresa un número válido",
        notGreaterThan: "^El monto debe ser mayor a $ 0"
    };

    if (operacion === "deposito") {
        numericality.lessThanOrEqualTo = LIMITE_DEPOSITO;
        numericality.notLessThanOrEqualTo = `^El depósito máximo es ${formato(LIMITE_DEPOSITO)}`;
    }

    if (operacion === "retiro") {
        const maximo = Math.min(LIMITE_RETIRO, saldo);
        numericality.lessThanOrEqualTo = maximo;
        numericality.notLessThanOrEqualTo = saldo < LIMITE_RETIRO
            ? "^Saldo insuficiente para este retiro"
            : `^El retiro máximo es ${formato(LIMITE_RETIRO)}`;
        numericality.divisibleBy = 5;
        numericality.notDivisibleBy = "^El cajero solo entrega múltiplos de $ 5";
    }

    if (operacion === "servicio") {
        numericality.lessThanOrEqualTo = saldo;
        numericality.notLessThanOrEqualTo = "^Saldo insuficiente para este pago";
    }

    const reglas = {
        monto: {
            presence: { allowEmpty: false, message: "^Ingresa un monto" },
            format: {
                pattern: "^-?[0-9]+([.][0-9]{1,2})?$",
                message: "^Ingresa un número válido con máximo 2 decimales"
            },
            numericality
        }
    };

    if (operacion === "servicio") {
        reglas.servicio = {
            presence: { allowEmpty: false, message: "^Selecciona un servicio" },
            inclusion: { within: Object.keys(SERVICIOS), message: "^Selecciona un servicio" }
        };
        reglas.referencia = {
            presence: { allowEmpty: false, message: "^Ingresa el número de referencia" },
            format: { pattern: "^[0-9]{8}$", message: "^La referencia debe tener 8 dígitos" }
        };
    }

    return reglas;
}

// Textos de cada operación
const OPERACIONES = {
    deposito: {
        form: "form-deposito",
        titulo: "Depósito",
        confirmar: "¿Confirmar depósito?",
        exito: "Depósito exitoso",
        comprobante: "COMPROBANTE DE DEPÓSITO"
    },
    retiro: {
        form: "form-retiro",
        titulo: "Retiro",
        confirmar: "¿Confirmar retiro?",
        exito: "Retiro realizado",
        comprobante: "COMPROBANTE DE RETIRO"
    },
    servicio: {
        form: "form-servicio",
        titulo: "Pago de servicio",
        confirmar: "¿Confirmar pago?",
        exito: "Pago aplicado",
        comprobante: "COMPROBANTE DE PAGO"
    }
};

function initOperacion(operacion) {
    const config = OPERACIONES[operacion];
    const form = document.getElementById(config.form);
    if (!form) return;

    // Muestra el primer error de cada campo debajo del campo
    function mostrarErrores(errores = {}) {
        form.querySelectorAll("[data-error]").forEach((span) => {
            const campo = span.dataset.error;
            const mensaje = errores[campo] ? errores[campo][0] : "";
            span.textContent = mensaje;
            if (form.elements[campo]) {
                form.elements[campo].classList.toggle("is-invalid", Boolean(mensaje));
            }
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const cuenta = obtenerCuenta();
        const saldo = calcularSaldo(cuenta);
        const datos = validate.collectFormValues(form, { trim: true });

        // 1. Validación con validate.js
        const errores = validate(datos, reglasMonto(operacion, saldo), { fullMessages: false });
        mostrarErrores(errores || {});
        if (errores) return;

        const monto = Number(datos.monto);
        const movimiento = crearMovimiento(operacion, monto, datos);
        const saldoDespues = saldo + movimiento.monto;

        // 2. Confirmación con SweetAlert
        alerta({
            icon: "warning",
            title: config.confirmar,
            html: `${movimiento.descripcion}: <b>${formato(monto)}</b><br>
                Saldo después de la operación: <b>${formato(saldoDespues)}</b>`,
            confirmar: "Confirmar",
            cancelar: "Cancelar",
            cargando: true
        }).then((confirmado) => {
            if (!confirmado) {
                alerta({ icon: "info", title: "Operación cancelada", text: "No se realizó ningún cargo.", timer: 1800 });
                return;
            }

            // El botón muestra la carga mientras el cajero "procesa" la operación
            setTimeout(() => {
                const transaccion = registrarMovimiento(movimiento);
                form.reset();
                mostrarDatosCuenta();

                // 3. Éxito y comprobante con jsPDF
                alerta({
                    icon: "success",
                    title: config.exito,
                    html: `${movimiento.descripcion}: <b>${formato(monto)}</b><br>
                        Nuevo saldo: <b>${formato(transaccion.saldoActual)}</b>`,
                    confirmar: "Descargar comprobante",
                    cancelar: "Finalizar"
                }).then((descargar) => {
                    if (descargar) {
                        crearComprobante(config.comprobante, transaccion)
                            .save(`comprobante-${transaccion.movimiento.id}.pdf`);
                    }
                });
            }, 900);
        });
    });

    // Montos rápidos  llenan el monto y envían el formulario
    form.querySelectorAll("[data-monto]").forEach((btn) => {
        btn.addEventListener("click", () => {
            form.elements.monto.value = btn.dataset.monto;
            form.requestSubmit();
        });
    });
}

function crearMovimiento(operacion, monto, datos) {
    if (operacion === "deposito") {
        return { tipo: "Depósito", descripcion: "Depósito en efectivo", monto };
    }
    if (operacion === "retiro") {
        return { tipo: "Retiro", descripcion: "Retiro en cajero", monto: -monto };
    }
    const servicio = SERVICIOS[datos.servicio];
    return {
        tipo: "Servicio",
        descripcion: "Pago de " + servicio.toLowerCase(),
        servicio,
        referencia: datos.referencia,
        monto: -monto
    };
}

/*7. PDF - jsPDF*/

// Ticket de 80 mm para cualquier operación
function crearComprobante(titulo, { cuenta, movimiento, saldoAnterior, saldoActual }) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: [80, 170] });

    const fila = (y, etiqueta, valor, negrita = false) => {
        doc.setFont("helvetica", negrita ? "bold" : "normal");
        doc.text(etiqueta, 6, y);
        doc.text(valor, 74, y, { align: "right" });
    };

    const separador = (y) => {
        doc.setDrawColor(160, 166, 177);
        doc.setLineDashPattern([1, 1], 0);
        doc.line(6, y, 74, y);
        doc.setLineDashPattern([], 0);
    };

    // Encabezado
    doc.setFillColor(227, 53, 13);
    doc.rect(0, 0, 80, 22, "F");
    doc.setFillColor(30, 30, 30);
    doc.rect(0, 22, 80, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("POKÉMON BANK", 40, 11, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Cajero automático", 40, 17, { align: "center" });

    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(titulo, 40, 34, { align: "center" });

    // Datos de la transacción
    doc.setFontSize(9);
    let y = 44;
    fila(y, "Fecha:", fechaCorta(movimiento.fecha));
    fila(y += 6, "Hora:", movimiento.hora);
    fila(y += 6, "Transacción:", movimiento.id);
    separador(y += 5);
    fila(y += 7, "Titular:", cuenta.titular);
    fila(y += 6, "Cuenta:", cuentaOculta(cuenta.numero));

    if (movimiento.servicio) {
        fila(y += 6, "Servicio:", movimiento.servicio);
        fila(y += 6, "Referencia:", movimiento.referencia);
    }

    // Montos
    separador(y += 5);
    fila(y += 7, "Saldo anterior:", formato(saldoAnterior));
    fila(y += 6, "Monto:", formatoMovimiento(movimiento.monto));
    separador(y += 5);
    doc.setFontSize(11);
    fila(y += 8, "SALDO ACTUAL:", formato(saldoActual), true);

    // Pie
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(91, 97, 112);
    doc.text("Gracias por utilizar Pokémon Bank.", 40, y + 20, { align: "center" });
    doc.text("Conserve este comprobante.", 40, y + 25, { align: "center" });

    return doc;
}

// Estado de cuenta tamaño carta con la tabla de movimientos (plugin AutoTable)
function crearEstadoCuenta(cuenta) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "letter" });
    const ancho = doc.internal.pageSize.getWidth();
    const alto = doc.internal.pageSize.getHeight();
    const margen = 16;

    const filas = filasConSaldo(cuenta);
    const ingresos = cuenta.movimientos.filter((m) => m.monto > 0).reduce((t, m) => t + m.monto, 0);
    const egresos = cuenta.movimientos.filter((m) => m.monto < 0).reduce((t, m) => t - m.monto, 0);
    const periodo = filas.length
        ? `${fechaCorta(filas[0].fecha)} al ${fechaCorta(filas[filas.length - 1].fecha)}`
        : "Sin movimientos";

    // Encabezado
    doc.setFillColor(227, 53, 13);
    doc.rect(0, 0, ancho, 28, "F");
    doc.setFillColor(30, 30, 30);
    doc.rect(0, 28, ancho, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("POKÉMON BANK", margen, 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Estado de cuenta", margen, 23);
    doc.text(periodo, ancho - margen, 16, { align: "right" });

    // Datos del cliente
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Titular:", margen, 42);
    doc.text("Cuenta:", margen, 48);
    doc.text("Emitido:", margen, 54);
    doc.setFont("helvetica", "normal");
    doc.text(cuenta.titular, margen + 20, 42);
    doc.text(cuenta.numero, margen + 20, 48);
    doc.text(fechaCorta(fechaISO(new Date())), margen + 20, 54);

    // Resumen
    const xEtiqueta = ancho - margen - 60;
    [
        ["Saldo inicial:", formato(cuenta.saldoApertura)],
        ["Depósitos:", "+ " + formato(ingresos)],
        ["Retiros y servicios:", "- " + formato(egresos)]
    ].forEach(([etiqueta, valor], i) => {
        doc.text(etiqueta, xEtiqueta, 42 + i * 6);
        doc.text(valor, ancho - margen, 42 + i * 6, { align: "right" });
    });

    // Tabla de movimientos
    doc.autoTable({
        startY: 64,
        margin: { left: margen, right: margen },
        head: [["Fecha", "Tipo", "Descripción", "Monto", "Saldo"]],
        body: filas.map((f) => [
            fechaCorta(f.fecha), f.tipo, f.descripcion, formatoMovimiento(f.monto), formato(f.saldo)
        ]),
        theme: "striped",
        headStyles: { fillColor: [227, 53, 13], textColor: 255, fontStyle: "bold" },
        styles: { font: "helvetica", fontSize: 9, cellPadding: 3 },
        columnStyles: { 3: { halign: "right" }, 4: { halign: "right" } },
        didParseCell: (data) => {
            if (data.section === "head" && data.column.index >= 3) {
                data.cell.styles.halign = "right";
            }
            if (data.section === "body" && data.column.index === 3) {
                data.cell.styles.textColor = filas[data.row.index].monto >= 0 ? [46, 158, 79] : [214, 40, 40];
            }
        },
        didDrawPage: (data) => {
            doc.setFontSize(8);
            doc.setTextColor(91, 97, 112);
            doc.text("Pokémon Bank - Documento generado por el cajero automático", margen, alto - 10);
            doc.text("Página " + data.pageNumber, ancho - margen, alto - 10, { align: "right" });
        }
    });

    // Saldo final
    let y = doc.lastAutoTable.finalY + 10;
    if (y > alto - 20) {
        doc.addPage();
        y = 24;
    }
    doc.setFillColor(255, 203, 5);
    doc.rect(ancho - margen - 70, y - 6, 70, 10, "F");
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("SALDO FINAL:", ancho - margen - 66, y);
    doc.text(formato(calcularSaldo(cuenta)), ancho - margen - 4, y, { align: "right" });

    return doc;
}

/* =========================================================
   8. Historial
   ========================================================= */

// Movimientos en orden cronológico con el saldo después de cada uno
function filasConSaldo(cuenta) {
    let saldo = cuenta.saldoApertura;
    return [...cuenta.movimientos]
        .sort((a, b) => a.fecha.localeCompare(b.fecha))
        .map((m) => {
            saldo += m.monto;
            return { ...m, saldo };
        });
}

function totalPorTipo(cuenta, tipo) {
    return cuenta.movimientos
        .filter((m) => m.tipo === tipo)
        .reduce((t, m) => t + Math.abs(m.monto), 0);
}

// Color de la etiqueta de Bootstrap según el tipo de movimiento
const BADGE_TIPO = { "Depósito": "success", "Retiro": "danger", "Servicio": "primary" };

function initHistorial() {
    const tabla = document.getElementById("tabla-historial");
    if (!tabla) return;

    let filtro = "todos";

    function pintar() {
        const cuenta = obtenerCuenta();

        document.getElementById("total-depositos").textContent = formato(totalPorTipo(cuenta, "Depósito"));
        document.getElementById("total-retiros").textContent = formato(totalPorTipo(cuenta, "Retiro"));
        document.getElementById("total-servicios").textContent = formato(totalPorTipo(cuenta, "Servicio"));

        // Más reciente primero, filtrado por tipo
        const filas = filasConSaldo(cuenta)
            .reverse()
            .filter((m) => filtro === "todos" || m.tipo === filtro);

        tabla.innerHTML = filas.length
            ? filas.map((m) => `
                <tr>
                    <td>${fechaCorta(m.fecha)}</td>
                    <td><span class="badge badge-pill badge-${BADGE_TIPO[m.tipo]}">${m.tipo}</span></td>
                    <td class="d-none d-md-table-cell">${m.descripcion}</td>
                    <td class="text-right ${m.monto >= 0 ? "text-success" : "text-danger"}">${formatoMovimiento(m.monto)}</td>
                    <td class="text-right">${formato(m.saldo)}</td>
                </tr>`).join("")
            : `<tr><td colspan="5" class="text-center text-muted">No hay movimientos de este tipo.</td></tr>`;

        document.getElementById("conteo-historial").textContent = `${filas.length} movimiento(s)`;

        mostrarDatosCuenta();
    }

    pintar();

    // Filtro por tipo de transacción (grupo de botones de Bootstrap)
    document.querySelectorAll("[data-filtro]").forEach((btn) => {
        btn.addEventListener("click", () => {
            filtro = btn.dataset.filtro;
            document.querySelectorAll("[data-filtro]").forEach((b) => b.classList.toggle("active", b === btn));
            pintar();
        });
    });

    // Estado de cuenta en PDF
    document.getElementById("btn-estado-cuenta").addEventListener("click", () => {
        crearEstadoCuenta(obtenerCuenta()).save("estado-cuenta-pokemon-bank.pdf");
        alerta({ icon: "success", title: "Estado de cuenta descargado", timer: 2000 });
    });

    // Volver a los datos de ejemplo
    document.getElementById("btn-reiniciar").addEventListener("click", () => {
        alerta({
            icon: "warning",
            title: "¿Reiniciar datos?",
            text: "Se borrarán las operaciones que hiciste y se cargarán los datos de ejemplo.",
            confirmar: "Sí, reiniciar",
            cancelar: "Cancelar"
        }).then((confirmado) => {
            if (!confirmado) return;
            reiniciarCuenta();
            pintar();
            alerta({ icon: "success", title: "Datos reiniciados", timer: 1500 });
        });
    });
}

/*9. Gráficos - Chart.js*/

function initGrafico() {
    const canvasBarras = document.getElementById("grafico-barras");
    const canvasServicios = document.getElementById("grafico-servicios");
    if (!canvasBarras || !canvasServicios) return;

    const cuenta = obtenerCuenta();

    // Agrupa ingresos y egresos por mes
    const porMes = {};
    cuenta.movimientos.forEach((m) => {
        const clave = m.fecha.slice(0, 7);
        porMes[clave] ??= { ingresos: 0, egresos: 0 };
        if (m.monto >= 0) porMes[clave].ingresos += m.monto;
        else porMes[clave].egresos += -m.monto;
    });
    const meses = Object.keys(porMes).sort().slice(-6);
    const etiquetaMes = (clave) => MESES[Number(clave.slice(5, 7)) - 1] + " " + clave.slice(2, 4);

    // Suma pagada por servicio
    const porServicio = {};
    cuenta.movimientos
        .filter((m) => m.tipo === "Servicio")
        .forEach((m) => {
            porServicio[m.servicio] = (porServicio[m.servicio] || 0) + -m.monto;
        });

    // Tarjetas de resumen
    const ingresos = cuenta.movimientos.filter((m) => m.monto > 0);
    const egresos = cuenta.movimientos.filter((m) => m.monto < 0);
    const totalIngresos = ingresos.reduce((t, m) => t + m.monto, 0);
    const totalEgresos = egresos.reduce((t, m) => t - m.monto, 0);
    const balance = totalIngresos - totalEgresos;

    document.getElementById("resumen-ingresos").textContent = formato(totalIngresos);
    document.getElementById("resumen-ingresos-n").textContent = `${ingresos.length} movimientos`;
    document.getElementById("resumen-egresos").textContent = formato(totalEgresos);
    document.getElementById("resumen-egresos-n").textContent = `${egresos.length} movimientos`;
    const balanceEl = document.getElementById("resumen-balance");
    balanceEl.textContent = (balance >= 0 ? "+ " : "- ") + formato(Math.abs(balance));
    balanceEl.classList.toggle("text-success", balance >= 0);
    balanceEl.classList.toggle("text-danger", balance < 0);
    if (meses.length) {
        document.getElementById("resumen-periodo").textContent =
            `${etiquetaMes(meses[0])} a ${etiquetaMes(meses[meses.length - 1])}`;
    }

    Chart.defaults.font.family = "Poppins, system-ui, sans-serif";

    // Pastel: monto y cantidad de transacciones por tipo
    const canvasTipos = document.getElementById("grafico-tipos");
    if (canvasTipos) {
        const tipos = ["Depósito", "Retiro", "Servicio"];
        const montosTipo = tipos.map((t) => totalPorTipo(cuenta, t));
        const conteoTipo = tipos.map((t) => cuenta.movimientos.filter((m) => m.tipo === t).length);
        const totalTipos = montosTipo.reduce((a, b) => a + b, 0);

        new Chart(canvasTipos, {
            type: "pie",
            data: {
                labels: ["Depósitos", "Retiros", "Pagos de servicios"],
                datasets: [{
                    data: montosTipo,
                    backgroundColor: ["#2e9e4f", "#e3350d", "#2a75bb"],
                    borderColor: "#ffffff",
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const pct = ((ctx.parsed / totalTipos) * 100).toFixed(1);
                                const n = conteoTipo[ctx.dataIndex];
                                return ` ${ctx.label}: ${formato(ctx.parsed)} (${pct}%) - ${n} transacciones`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Barras: ingresos vs egresos por mes
    new Chart(canvasBarras, {
        type: "bar",
        data: {
            labels: meses.map(etiquetaMes),
            datasets: [
                { label: "Ingresos (depósitos)", data: meses.map((k) => porMes[k].ingresos), backgroundColor: "#2e9e4f", borderRadius: 6 },
                { label: "Egresos (retiros + servicios)", data: meses.map((k) => porMes[k].egresos), backgroundColor: "#e3350d", borderRadius: 6 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, ticks: { callback: (v) => "$ " + v } }
            },
            plugins: {
                legend: { position: "bottom" },
                tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formato(ctx.parsed.y)}` } }
            }
        }
    });

    // Dona: distribución del pago de servicios
    const colores = {
        "Energía eléctrica": "#ffcb05",
        "Internet": "#2a75bb",
        "Agua potable": "#e3350d",
        "Telefonía": "#2e9e4f"
    };
    const nombres = Object.keys(porServicio);
    const totalServicios = nombres.reduce((t, n) => t + porServicio[n], 0);

    new Chart(canvasServicios, {
        type: "doughnut",
        data: {
            labels: nombres,
            datasets: [{
                data: nombres.map((n) => porServicio[n]),
                backgroundColor: nombres.map((n) => colores[n] || "#a0a6b1"),
                borderColor: "#ffffff",
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "60%",
            plugins: {
                legend: { position: "bottom" },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const pct = ((ctx.parsed / totalServicios) * 100).toFixed(1);
                            return ` ${ctx.label}: ${formato(ctx.parsed)} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });
}
