# Sistema de Interceptors de Error - Guía de Uso

## 🎯 **Qué hemos creado**

Un sistema completo de manejo de errores HTTP con interceptors que incluye:

### 1. **Error Interceptor** (`core/interceptors/error.interceptor.ts`)
- Captura todos los errores HTTP automáticamente
- Maneja diferentes códigos de estado (400, 401, 403, 404, 422, 500, 503)
- Muestra mensajes user-friendly
- Logs detallados para desarrollo

### 2. **HTTP Interceptor** (`core/interceptors/http.interceptor.ts`)
- Añade headers comunes a todas las peticiones
- Logs de requests
- Base para futuras funcionalidades (loading, auth tokens)

### 3. **Notification Service** (`core/services/notification.service.ts`)
- Maneja notificaciones globales
- Diferentes tipos: success, error, warning, info
- Auto-hide configurable

### 4. **Notification Component** (`shared/components/notification/notification.component.ts`)
- UI para mostrar notificaciones
- Diseño responsive con Tailwind
- Iconos para cada tipo de mensaje

## 🔧 **Cómo funciona**

### Flujo Automático:
```
1. Servicio hace petición HTTP → 
2. HTTP Interceptor añade headers → 
3. Si hay error → Error Interceptor lo captura → 
4. Notification Service muestra mensaje → 
5. Notification Component renderiza en UI
```

## 🚀 **Cómo usar en tus servicios**

### Antes (con manejo manual):
```typescript
signIn(data: SignInModel): Observable<any> {
  return this.http.post(url, data).pipe(
    tap(response => console.log('Success')),
    catchError(error => {
      console.error('Error', error);
      // Mostrar error manual
      return throwError(() => error);
    })
  );
}
```

### Ahora (automático):
```typescript
signIn(data: SignInModel): Observable<any> {
  return this.http.post(url, data).pipe(
    tap(response => {
      console.log('Success', response);
      // Solo manejar lógica de éxito
    })
  );
  // Los errores se manejan automáticamente!
}
```

## 📱 **Uso en componentes**

```typescript
export class SigninComponent {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  onSubmit(formData: SignInModel) {
    this.authService.signIn(formData).subscribe({
      next: (response) => {
        // Solo manejar éxito
        this.notificationService.success('¡Bienvenido!');
        this.router.navigate(['/dashboard']);
      }
      // No necesitas manejar errores aquí - el interceptor lo hace
    });
  }
}
```

## 🎨 **Mostrar notificaciones manuales**

```typescript
// En cualquier componente
constructor(private notificationService: NotificationService) {}

// Diferentes tipos de notificaciones
showSuccess() {
  this.notificationService.success('Operación exitosa!');
}

showError() {
  this.notificationService.error('Algo salió mal');
}

showWarning() {
  this.notificationService.warning('Ten cuidado');
}

showInfo() {
  this.notificationService.info('Información importante');
}
```

## ⚙️ **Configuración**

### En `app.config.ts`:
```typescript
provideHttpClient(
  withInterceptors([httpInterceptor, errorInterceptor])
)
```

### En `app.component.html`:
```html
<router-outlet></router-outlet>
<app-notification></app-notification>
```

## 🛠️ **Personalización**

### Modificar mensajes de error:
Edita `error.interceptor.ts` en los casos switch:

```typescript
case 401:
  userMessage = 'Tu mensaje personalizado aquí';
  break;
```

### Cambiar estilos de notificaciones:
Edita `notification.component.ts` en `getNotificationClasses()`:

```typescript
case 'error':
  return `${baseClasses} bg-red-500 text-white`; // Tu estilo
```

### Añadir loading automático:
En `http.interceptor.ts`:

```typescript
export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  loadingService.show();
  
  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

## 🔒 **Manejo de autenticación**

Para manejar tokens automáticamente:

```typescript
// En http.interceptor.ts
const token = localStorage.getItem('token');
const modifiedReq = req.clone({
  setHeaders: {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  }
});
```

## 📊 **Ventajas del sistema**

✅ **Centralizado**: Un solo lugar para manejar errores
✅ **Automático**: No necesitas catchError en cada servicio  
✅ **Consistente**: Mensajes uniformes en toda la app
✅ **User-friendly**: Mensajes claros para usuarios
✅ **Developer-friendly**: Logs detallados para desarrollo
✅ **Escalable**: Fácil añadir nuevos tipos de manejo
✅ **Reutilizable**: Funciona en toda la aplicación

## 🧪 **Testing**

Para probar el sistema:

1. Haz una petición a una URL que no existe (404)
2. Envía datos inválidos (400)
3. Usa credenciales incorrectas (401)

Deberías ver notificaciones automáticas aparecer en la esquina superior derecha.

¡El sistema está listo para producción! 🚀
