import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

// Servicio para manejar el estado de loading (opcional)
export interface LoadingService {
  show(): void;
  hide(): void;
}

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  // Opcional: inyectar servicio de loading
  // const loadingService = inject(LoadingService);

  // Agregar headers comunes
  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    }
  });

  console.log(`HTTP Request: ${modifiedReq.method} ${modifiedReq.url}`);
  
  // Opcional: mostrar loading
  // loadingService.show();

  return next(modifiedReq).pipe(
    finalize(() => {
      // Opcional: ocultar loading cuando termine la petición
      // loadingService.hide();
      console.log(`HTTP Request completed: ${modifiedReq.method} ${modifiedReq.url}`);
    })
  );
};
