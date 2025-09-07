import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BottomMenuComponent } from "../bottom-menu/bottom-menu.component";

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, BottomMenuComponent],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css'
})
export class FooterComponent {
  private router = inject(Router);
  activeRoute = '';

  ngOnInit() {
    // Detectar la ruta activa para resaltar el botón correspondiente
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeRoute = event.url;
      });
    
    // Establecer la ruta inicial
    this.activeRoute = this.router.url;
  }

  // Métodos de navegación
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToAccounts() {
    this.router.navigate(['/accounts']);
  }

  navigateToRecurring() {
    this.router.navigate(['/recurring']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  // Helper para verificar si una ruta está activa
  isActive(route: string): boolean {
    return this.activeRoute.includes(route);
  }
}
