import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translation.service';
import { AuthService } from '../auth.service';
import { SignInModel } from '../../../shared/models/signin.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [TranslocoModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent implements OnInit {
  @Output() switchToSignup = new EventEmitter<void>();
  
  signinForm!: FormGroup;
  isLoading = false;
  msgError = '';
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private translationService = inject(TranslationService);
  private authService = inject(AuthService);
  private snackbar = inject(MatSnackBar);

  async ngOnInit() {
    await this.translationService.loadScope('auth');
    this.initializeForm();
  }

  private initializeForm() {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.msgError = '';
    if (this.signinForm.invalid) {
      this.markFormGroupTouched();
      this.snackbar.open('Please fill out all fields correctly.', 'Close', {
        duration: 5000,
      });
      return;
    }

    this.isLoading = true;
    const signinData: SignInModel = this.signinForm.value;

    this.authService.signIn(signinData).subscribe({
      next: (response) => {
        this.snackbar.open('¡Bienvenido! Has iniciado sesión correctamente.', 'Close', {
          duration: 5000,
        });
        // Aquí puedes guardar el token, datos del usuario, etc.
        // localStorage.setItem('token', response.token);
        // this.router.navigate(['/dashboard']);
        console.log('Login successful:', response);
        this.isLoading = false;
      },
      error: (error) => {
        // El error se maneja automáticamente por el interceptor
        // Pero podemos hacer acciones específicas aquí si es necesario
        this.isLoading = false;
        console.error('Login error:', error);
        if (error.status === 401) {
          this.msgError = 'Credenciales inválidas. Por favor, intenta de nuevo.';
        }
  
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.signinForm.controls).forEach(key => {
      const control = this.signinForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Getters para fácil acceso en el template
  get email() {
    return this.signinForm.get('email');
  }

  get password() {
    return this.signinForm.get('password');
  }

  // Métodos para validación visual
  isFieldInvalid(fieldName: string): boolean {
    const field = this.signinForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.signinForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) {
      return `${fieldName === 'email' ? 'Correo electrónico' : 'Contraseña'} es requerido`;
    }
    if (field.errors['email']) {
      return 'Ingresa un correo electrónico válido';
    }
    if (field.errors['minlength']) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  onSignUpClick() {
    this.switchToSignup.emit();
  }

  onSwitchToSignup() {
    this.switchToSignup.emit();
  }


}
