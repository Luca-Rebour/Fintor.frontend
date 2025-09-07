import { inject, Injectable } from "@angular/core";
import { TranslocoLoader, Translation } from "@jsverse/transloco";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class TranslocoHttpLoader implements TranslocoLoader {
    private http = inject(HttpClient);

    getTranslation(lang: string) {
        return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
    }
}

@Injectable({ providedIn: "root" })
export class TranslocoScopeLoader implements TranslocoLoader {
    private http = inject(HttpClient);

    getTranslation(langWithScope: string) {
        // langWithScope viene en formato "en/auth" o "es/auth"
        const [lang, scope] = langWithScope.split('/');        
        return this.http.get<Translation>(`/assets/i18n/${scope}/${lang}.json`);
    }
}