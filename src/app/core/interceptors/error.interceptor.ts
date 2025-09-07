import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';
      let userMessage = '';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
        userMessage = 'Error de conexión. Por favor, verifica tu conexión a internet.';
        console.error('Client-side error:', error.error.message);
      } else {
        // Error del lado del servidor
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        console.error(`Server-side error: ${error.status} - ${error.message}`);
        
        // Manejar códigos de error específicos
        switch (error.status) {
          case 400:
            userMessage =  error.error?.message || 'Datos inválidos. Por favor, verifica la información ingresada.';
            console.error('Bad Request - Datos inválidos');
            break;
          case 401:
            userMessage = error.error?.message || 'Sesión expirada. Por favor, inicia sesión nuevamente.';
            console.error('Unauthorized - Token inválido o expirado');
            // Opcional: redirigir al login
            // router.navigate(['/auth']);
            break;
          case 403:
            userMessage = error.error?.message || 'No tienes permisos para realizar esta acción.';
            console.error('Forbidden - No tienes permisos para esta acción');
            break;
          case 404:
            userMessage = error.error?.message || 'Recurso no encontrado.';
            console.error('Not Found - Recurso no encontrado');
            break;
          case 422:
            userMessage = error.error?.message || 'Error de validación en los datos.';
            console.error('Unprocessable Entity - Error de validación');
            break;
          case 500:
            userMessage = error.error?.message || 'Error interno del servidor. Por favor, intenta más tarde.';
            console.error('Internal Server Error - Error del servidor');
            break;
          case 503:
            userMessage = error.error?.message || 'Servicio no disponible. Por favor, intenta más tarde.';
            console.error('Service Unavailable - Servicio no disponible');
            break;
          default:
            userMessage = error.error?.message || 'Error inesperado. Por favor, intenta más tarde.';
            console.error(`Error inesperado: ${error.status}`);
            break;
        }
      }

      // Mostrar notificación al usuario
      snackBar.open(userMessage, 'Close', { duration: 5000 });

      // Log detallado para desarrollo
      console.error('Error interceptado:', errorMessage);
      
      // Re-lanzar el error para que los componentes puedan manejarlo también
      return throwError(() => error);
    })
  );
};
