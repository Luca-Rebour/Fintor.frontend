import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { AvailableLangs, AvailableLangsArray } from './transloco-config';
import { TranslocoHttpLoader } from './transloco-loader';
import { errorInterceptor, httpInterceptor } from './core/interceptors';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpInterceptor, errorInterceptor])
    ),
    provideTransloco({
      config: {
        availableLangs: AvailableLangsArray,
        defaultLang: AvailableLangs.ES,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        fallbackLang: AvailableLangs.EN,
        missingHandler: {
          useFallbackTranslation: true
        }
      },
      loader: TranslocoHttpLoader
    }), provideAnimationsAsync()
  ],
};
