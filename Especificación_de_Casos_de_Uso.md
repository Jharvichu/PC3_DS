# Casos de Uso del Sistema "Voz Ciudadana"

### Caso de Uso 1: Autenticación con Identidad Nacional

- **Actor:** Ciudadano.
- **Objetivo:** Validar su identidad para acceder a las funcionalidades de la plataforma.
- **Pasos:**
    - 1. El actor ingresa a la sección de autenticación.
    - 2. Ingresa su número de DNI y realiza el proceso de firma digital.
    - 3. El sistema valida los datos con el registro central.
- **Resultado:** El usuario obtiene una sesión activa y autorizada para interactuar con el sistema.

### Caso de Uso 2: Exploración de Iniciativas Legislativas

- **Actor:** Ciudadano.
- **Objetivo:** Visualizar el catálogo de propuestas existentes en la plataforma.
- **Pasos:**
    - 1. El actor accede a la pantalla principal.
    - 2. El sistema despliega un listado de iniciativas activas mediante cuadros informativos.
    - 3. El actor revisa los resúmenes y estados de las propuestas.
- **Resultado:** El actor obtiene una visión general de las iniciativas vigentes.

### Caso de Uso 3: Visualización de Expediente Completo

- **Actor:** Ciudadano.
- **Objetivo:** Acceder al contenido detallado y documentos de soporte de una propuesta.
- **Pasos:**
    - 1. El actor selecciona una iniciativa específica desde el catálogo.
    - 2. El sistema despliega la vista de detalle con el articulado, motivos y archivos adjuntos (PDF, enlaces).
- **Resultado:** El actor dispone de toda la documentación técnica para analizar la propuesta.

### Caso de Uso 4: Envío de Comentarios Reservados

- **Actor:** Ciudadano.
- **Objetivo:** Aportar sugerencias o recursos técnicos sobre una iniciativa de forma privada.
- **Pasos:**
    - 1. El actor selecciona la opción de comentar dentro de la vista de detalle.
    - 2. El actor redacta y envía el comentario a través de un formulario.
- **Resultado:** El sistema registra el comentario como privado, accesible únicamente para el emisor y el administrador.

### Caso de Uso 5: Gestión de Apoyo (Firma)

- **Actor:** Ciudadano.
- **Objetivo:** Otorgar o retirar su respaldo formal a una iniciativa legislativa.
- **Pasos:**
    - 1. El actor presiona el botón de "Apoyar iniciativa".
    - 2. El sistema registra el DNI y firma digital del ciudadano, o permite la opción de retirar el respaldo previamente otorgado.
- **Resultado:** La base de datos actualiza el contador de firmas vinculadas a la propuesta.

### Caso de Uso 6: Registro de Nueva Propuesta

- **Actor:** Colectivo Civil.
- **Objetivo:** Ingresar una nueva iniciativa legislativa para su recolección de firmas.
- **Pasos:**
    - 1. El actor completa el formulario de creación con descripción, motivos, sustentos y archivos de respaldo.
    - 2. El actor envía el formulario para su validación.
- **Resultado:** La iniciativa queda registrada en el sistema y habilitada para recibir apoyos ciudadanos.

### Caso de Uso 7: Monitorización de Progreso

- **Actor:** Ciudadano.
- **Objetivo:** Verificar el estado actual y la cantidad de firmas alcanzadas por una iniciativa.
- **Pasos:**
    - 1. El actor accede al detalle de una iniciativa.
    - 2. El sistema muestra el contador de firmas en tiempo real y el plazo restante.
- **Resultado:** El actor conoce el estado del apoyo de la sociedad civil ante la propuesta.