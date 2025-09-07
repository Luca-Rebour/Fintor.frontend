# Separación de Traducciones por Feature - Guía de Uso

## 📁 Estructura de Archivos

```
src/assets/i18n/
├── shared/
│   ├── en.json    # Traducciones globales/compartidas
│   └── es.json
├── auth/
│   ├── en.json    # Traducciones específicas de autenticación
│   └── es.json
└── [other-features]/
    ├── en.json
    └── es.json
```

## 🛠️ Cómo Funciona

### 1. **Loaders Configurados**
- `TranslocoHttpLoader`: Carga traducciones compartidas desde `/assets/i18n/shared/`
- `TranslocoScopeLoader`: Carga traducciones por feature desde `/assets/i18n/{feature}/`

### 2. **TranslationService Actualizado**
El servicio incluye métodos para cargar scopes específicos:

```typescript
// Cargar traducciones de un feature específico
await this.translationService.loadScope('auth');

// Traducir con scope específico
this.translationService.translate('signin.title', 'auth');
```

### 3. **Uso en Componentes**

```typescript
// En el component.ts
import { TranslocoModule } from '@jsverse/transloco';
import { TranslationService } from '../../../core/services/translation.service';

export class MyComponent implements OnInit {
  private translationService = inject(TranslationService);

  async ngOnInit() {
    await this.translationService.loadScope('auth'); // Cargar scope
  }
}

// En imports del componente
imports: [TranslocoModule]
```

```html
<!-- En el component.html -->
{{ 'auth.signin.title' | transloco }}
```

## 🚀 Añadir Nuevos Features

### 1. Crear estructura de carpetas:
```bash
mkdir src/assets/i18n/[feature-name]
```

### 2. Crear archivos de traducción:
```json
// src/assets/i18n/[feature-name]/en.json
{
  "section1": {
    "title": "English Title",
    "description": "English Description"
  }
}
```

### 3. En el componente del feature:
```typescript
async ngOnInit() {
  await this.translationService.loadScope('[feature-name]');
}
```

```html
{{ '[feature-name].section1.title' | transloco }}
```

## ✅ Beneficios

- **Organización**: Traducciones separadas por funcionalidad
- **Performance**: Carga lazy de traducciones solo cuando se necesitan
- **Mantenibilidad**: Fácil de mantener y escalar
- **Reutilización**: Traducciones compartidas en `/shared/`
- **Modularidad**: Cada feature maneja sus propias traducciones

## 📝 Ejemplo de Uso Completo

```typescript
// feature.component.ts
@Component({
  imports: [TranslocoModule],
  // ...
})
export class FeatureComponent implements OnInit {
  private translationService = inject(TranslationService);

  async ngOnInit() {
    await this.translationService.loadScope('auth');
  }
}
```

```html
<!-- feature.component.html -->
<h1>{{ 'auth.signin.title' | transloco }}</h1>
<p>{{ 'auth.signin.subtitle' | transloco }}</p>
```
