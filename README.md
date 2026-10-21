# Pokémon Bank - Cajero Automático (ATM)
**Universidad Don Bosco - Lenguajes Interpretados en el Cliente**  
*Proyecto de Cátedra - Fase 1: Propuesta del proyecto y diseño*

---

## 📁 Estructura del Proyecto

```text
├── index.html                                   # Punto de entrada principal (inicio de la aplicación)
│
├── views/                                       # Todas las pantallas/vistas del cajero agrupadas
│   ├── login.html                               # Vista 1: Login con PIN (4 dígitos)
│   ├── acciones.html                            # Vista 2: Pantalla de Acciones (titular, cuenta, operaciones y Salir)
│   ├── deposito.html                            # Depósito de efectivo
│   ├── retiro.html                              # Retiro de efectivo (montos rápidos, múltiplos de $5)
│   ├── servicios.html                           # Pago de servicios (energía, agua, internet, telefonía)
│   ├── historial.html                           # Vista 3: Pantalla de Historial de transacciones (filtro por tipo)
│   └── grafico.html                             # Vista 4: Pantalla de Gráfico (análisis por tipo de transacción)
│
├── css/
│   └── style.css                                # Tema propio sobre Bootstrap 4.0 (colores, cajero, teclado)
│
├── js/
│   └── main.js                                  # Lógica de las vistas (login, operaciones, historial, gráficos)
│
├── images/
│   ├── .gitkeep                                 # Logotipos, avatares e imágenes
│   └── icons/                                   # Iconos de servicios (energía, agua, internet, telefonía)
│
├── investigacion/                               # Pruebas de concepto de librerías para la siguiente fase
│   ├── sweetalert/
│   │   ├── notificacion-exito.html              # Alerta modal para transacciones exitosas (depósito/pago)
│   │   └── confirmacion-retiro.html             # Diálogo modal de confirmación antes de retirar dinero
│   ├── jspdf/
│   │   ├── comprobante-retiro.html              # Generación de ticket/comprobante de retiro en PDF
│   │   └── estado-cuenta.html                   # Generación de extracto o estado de cuenta en PDF
│   ├── chartjs/
│   │   ├── grafico-barras.html                  # Comparativa de ingresos vs egresos por mes
│   │   └── grafico-circular.html                # Distribución porcentual del pago de servicios
│   └── validatejs/
│       ├── validacion-pin.html                  # Reglas de validación para PIN de 4 dígitos
│       └── validacion-montos.html               # Validación de montos válidos a retirar o transferir
│
└── docs/                                        # Documentación para el reporte en Word
    ├── diagramas/                               # Diagrama de flujo de la aplicación
    └── capturas-git/                            # Evidencias del versionamiento en Git y GitHub
```

## Tecnologías

| Herramienta | Versión | Uso |
|---|---|---|
| Bootstrap | 4.0.0 | Framework CSS: cuadrícula, barra de navegación, tarjetas, formularios y tablas (diseño responsive) |
| SweetAlert | 2.1.2 | Confirmaciones y mensajes de las operaciones |
| validate.js | 0.13.1 | Validación del PIN y de los montos |
| jsPDF + AutoTable | 2.5.2 / 3.8.4 | Comprobantes y estado de cuenta en PDF |
| Chart.js | 4.4.6 | Gráficos de la vista de análisis |

Todas las librerías se cargan desde CDN, por lo que se necesita conexión a internet.

## Cómo ejecutar

1. Abrir `index.html` en el navegador (o usar la extensión Live Server de VS Code).
2. Presionar **Ingresar** y escribir el PIN de prueba.

## Usuario de prueba

| Dato | Valor |
|---|---|
| Titular | Brock Harrison |
| Cuenta | POKE-7842-1956 |
| PIN | 1234 |
| Saldo inicial | $ 2,457.00 |

Las operaciones se guardan en el navegador (`localStorage`). Para volver a los datos de ejemplo, usar el botón **Reiniciar datos de ejemplo** en el historial.
