import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translation.service';
import { AuthService } from '../auth.service';
import { SignUpModel } from '../../../shared/models/signun.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [TranslocoModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  @Output() switchToSignin = new EventEmitter<void>();

  private snackBar = inject(MatSnackBar);
  
  signupForm!: FormGroup;
  isLoading = false;
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private translationService = inject(TranslationService);
  private authService = inject(AuthService);

  async ngOnInit() {
    await this.translationService.loadScope('auth');
    this.initializeForm();
  }

  private initializeForm() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dateOfBirth: ['', [Validators.required, this.minimumAgeValidator(18)]]
    });
  }

  // Validador personalizado para edad mínima
  minimumAgeValidator(minAge: number) {
    return (control: any) => {
      if (!control.value) return null;
      
      const birthDate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        const actualAge = age - 1;
        return actualAge < minAge ? { minimumAge: { requiredAge: minAge, actualAge } } : null;
      }
      
      return age < minAge ? { minimumAge: { requiredAge: minAge, actualAge: age } } : null;
    };
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.markFormGroupTouched();
      this.snackBar.open('Please fill out all fields correctly.', 'Close', {
        duration: 5000,
      });
      return;
    }

    this.isLoading = true;
    const signupData: SignUpModel = this.signupForm.value;

    this.authService.signUp(signupData).subscribe({
      next: (response) => {
        this.snackBar.open('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.', 'Close', {
          duration: 5000,
        });
        console.log('Signup successful:', response);
        this.isLoading = false;
        // Cambiar automáticamente al signin después de registro exitoso
        this.switchToSignin.emit();
      },
      error: (error) => {
        // El error se maneja automáticamente por el interceptor
        this.isLoading = false;
        console.error('Signup error:', error);
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Getters para fácil acceso en el template
  get name() {
    return this.signupForm.get('name');
  }

  get lastname() {
    return this.signupForm.get('lastname');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get dateOfBirth() {
    return this.signupForm.get('dateOfBirth');
  }

  // Métodos para validación visual
  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.signupForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const fieldLabels: { [key: string]: string } = {
      name: 'Nombre',
      lastname: 'Apellido',
      email: 'Correo electrónico',
      password: 'Contraseña',
      dateOfBirth: 'Fecha de nacimiento'
    };

    const label = fieldLabels[fieldName] || fieldName;

    if (field.errors['required']) {
      return `${label} es requerido`;
    }
    if (field.errors['email']) {
      return 'Ingresa un correo electrónico válido';
    }
    if (field.errors['minlength']) {
      const requiredLength = field.errors['minlength'].requiredLength;
      if (fieldName === 'password') {
        return `La contraseña debe tener al menos ${requiredLength} caracteres`;
      }
      return `${label} debe tener al menos ${requiredLength} caracteres`;
    }
    if (field.errors['minimumAge']) {
      const { requiredAge, actualAge } = field.errors['minimumAge'];
      return `Debes tener al menos ${requiredAge} años (tienes ${actualAge} años)`;
    }
    return '';
  }

  onSignInClick() {
    this.switchToSignin.emit();
  }

  onSwitchToSignin() {
    this.switchToSignin.emit();
  }
}
