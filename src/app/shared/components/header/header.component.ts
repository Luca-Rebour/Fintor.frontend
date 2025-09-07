import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  private router = inject(Router);
  private translationService = inject(TranslationService);

  async ngOnInit() {
    await this.translationService.loadScope('header')
    this.router.events.subscribe(() => {
      this.isMenuOpen = false;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  // Navegación
  navigateTo(route: string) {
    this.router.navigate([route]);
    this.closeMenu();
  }

  // Logout (placeholder)
  logout() {
    // Implementar lógica de logout
    console.log('Logout');
    this.router.navigate(['/auth']);
    this.closeMenu();
  }
}
