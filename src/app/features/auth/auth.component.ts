import { Component, OnInit, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { TranslationService } from '../../core/services/translation.service';
import { AvailableLangs } from '../../transloco-config';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [NgClass, TranslocoModule, SigninComponent, SignupComponent],
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  rightPanel = false;
  
  private translationService = inject(TranslationService);

  async ngOnInit() {
    await this.translationService.loadScope('auth');
  }

  signUp() { this.rightPanel = true; }
  signIn() { this.rightPanel = false; }

  public languages = this.translationService.lenguages;

  async changeLanguage(lang: AvailableLangs) {
    await this.translationService.changeLanguage(lang);
  }
}
