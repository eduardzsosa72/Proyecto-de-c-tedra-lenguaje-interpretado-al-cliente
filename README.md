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
│   ├── acciones.html                            # Vista 2: Pantalla de Acciones (Depósito, Retiro, Saldo, Servicios, Salir)
│   ├── historial.html                           # Vista 3: Pantalla de Historial de transacciones
│   └── grafico.html                             # Vista 4: Pantalla de Gráfico (análisis de transacciones)
│
├── css/
│   └── style.css                                # Hoja de estilos del proyecto
│
├── js/
│   └── main.js                                  # Archivo JavaScript principal
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
