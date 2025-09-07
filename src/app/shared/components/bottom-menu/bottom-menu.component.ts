import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bottom-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bottom-menu.component.html',
  styleUrl: './bottom-menu.component.css'
})
export class BottomMenuComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  // Acciones del menú
  addTransaction() {
    console.log('Agregar transacción');
    this.closeMenu();
  }

  changeAccount() {
    console.log('Cambiar de cuenta');
    this.closeMenu();
  }

  addAccount() {
    console.log('Agregar cuenta');
    this.closeMenu();
  }
}
