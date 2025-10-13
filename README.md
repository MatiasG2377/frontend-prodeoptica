# FrontOptica 👓

Sistema de gestión integral para ópticas desarrollado con Next.js y React. Incluye gestión de inventario, fichas médicas, ventas, reportes y más.

## 🚀 Características

- **Gestión de Inventario**: Control completo de productos con sistema Kardex
- **Fichas Médicas**: Registro completo de pacientes y prescripciones
- **Sistema de Ventas**: Procesamiento de ventas con control de stock
- **Dashboard Analítico**: Gráficos y estadísticas de negocio
- **Reportes PDF**: Generación de reportes en PDF y Excel
- **Sistema de Autenticación**: Login seguro con JWT
- **Responsive Design**: Interfaz adaptativa para todos los dispositivos

## 📋 Requisitos del Sistema

### Software Requerido
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0 (o yarn/pnpm como alternativa)
- **Navegador**: Chrome, Firefox, Safari o Edge (versiones recientes)

### Tecnologías Principales
- **Framework**: Next.js 15.5.4
- **React**: 18.3.1
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Material-UI 6.4.11
- **Charts**: Chart.js 4.4.9 + React Chart.js 5.3.0
- **PDF Generation**: jsPDF 3.0.3 + html2pdf.js 0.12.1
- **Excel Export**: ExcelJS 4.4.0
- **HTTP Client**: Axios 1.9.0
- **Icons**: React Icons 5.5.0 + FontAwesome 6.7.2

## 🛠️ Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <repository-url>
   cd frontoptica
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.local.example .env.local
   # Editar .env.local con tus configuraciones
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador:**
   [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponibles

```bash
# Desarrollo con Turbopack (más rápido)
npm run dev

# Construcción para producción
npm run build

# Ejecutar en producción
npm start

# Linting del código
npm run lint
```

## 🔒 Seguridad

✅ **Proyecto libre de vulnerabilidades de seguridad**
- Todas las dependencias están actualizadas a versiones seguras
- Último audit: 0 vulnerabilidades encontradas
- Actualizaciones recientes de seguridad aplicadas (jsPDF, html2pdf.js)

## 📁 Estructura del Proyecto

```
frontoptica/
├── app/                    # App Router de Next.js
│   ├── components/         # Componentes reutilizables
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utilidades y helpers
│   ├── dashboard/         # Página del dashboard
│   ├── inventario/        # Gestión de inventario
│   ├── ficha-medica/      # Fichas médicas
│   ├── venta/             # Sistema de ventas
│   ├── kardex/            # Control Kardex
│   └── login/             # Autenticación
├── public/                # Archivos estáticos
├── package.json           # Dependencias del proyecto
└── tailwind.config.js     # Configuración de Tailwind
```

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env.local` con:
```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# Agregar otras variables según necesidad
```

## 📊 Funcionalidades Principales

### Dashboard
- Gráficos de ventas y estadísticas
- Resumen de inventario
- Alertas de stock bajo

### Inventario
- CRUD completo de productos
- Control de stock en tiempo real
- Sistema Kardex con historial de movimientos
- Exportación a PDF y Excel

### Fichas Médicas
- Registro completo de pacientes
- Prescripciones oftalmológicas detalladas
- Generación de reportes médicos en PDF
- Historial de consultas

### Ventas
- Procesamiento de ventas
- Control automático de inventario
- Facturación integrada

## 🐛 Solución de Problemas

### Error de compilación
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Problemas con PDF
Las librerías jsPDF y html2pdf.js han sido actualizadas a versiones seguras. Si encuentras problemas:
- Verificar que estás usando la sintaxis correcta: `autoTable(doc, {...})`
- Comprobar que html2pdf.js se ejecute solo en el navegador

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para nueva característica (`git checkout -b feature/nueva-caracteristica`)
3. Commit los cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es de uso privado/educativo.

## 🆘 Soporte

Para soporte técnico o preguntas:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

---

**Desarrollado con ❤️ para la gestión eficiente de ópticas**
