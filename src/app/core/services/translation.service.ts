import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { AvailableLangs } from '../../transloco-config';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private transloco = inject(TranslocoService);
  private http = inject(HttpClient);
  private loadedScopes = new Set<string>();

  public lenguages: { code: AvailableLangs, name: string }[] = [
    {code: AvailableLangs.ES, name: 'languajes.es'},
    {code: AvailableLangs.EN, name: 'languajes.en'}
  ];

  public async changeLanguage(lang: AvailableLangs) {
    this.transloco.setActiveLang(lang);
    
    // Recargar todos los scopes ya cargados para el nuevo idioma
    const scopesToReload = Array.from(this.loadedScopes);
    for (const scope of scopesToReload) {
      await this.loadScope(scope, lang);
    }
  }

  public getLenguage() {
    console.log(this.transloco.getActiveLang());
    return 'lenguajes. '  + this.transloco.getActiveLang() ;
  }

  // New methods for scope support
  async loadScope(scope: string, lang?: string): Promise<void> {
    const currentLang = lang || this.transloco.getActiveLang();
    
    // Marcar el scope como cargado
    this.loadedScopes.add(scope);
    
    try {
      const translation = await firstValueFrom(
        this.http.get(`/assets/i18n/${scope}/${currentLang}.json`)
      );
      
      if (translation) {
        // Create a nested object with the scope as the key
        const scopedTranslation = { [scope]: translation };
        
        // Merge with existing translations
        this.transloco.setTranslation(scopedTranslation, currentLang, { merge: true });
        console.log(`Loaded translations for scope ${scope} in language ${currentLang}`, scopedTranslation);
      }
    } catch (error) {
      console.error(`Failed to load translations for scope ${scope}:`, error);
    }
  }

  translate(key: string, scope?: string, params?: any): string {
    const translationKey = scope ? `${scope}.${key}` : key;
    return this.transloco.translate(translationKey, params);
  }

  selectTranslate(key: string, scope?: string, params?: any) {
    const translationKey = scope ? `${scope}.${key}` : key;
    return this.transloco.selectTranslate(translationKey, params);
  }
}
