import { TranslocoGlobalConfig } from '@jsverse/transloco-utils';

export enum AvailableLangs {
    EN = 'en',
    ES = 'es'
}

export const AvailableLangsArray = [
    AvailableLangs.ES,
    AvailableLangs.EN
];

export const TranslocoConfig: TranslocoGlobalConfig = {
    langs: AvailableLangsArray,
    defaultLang: AvailableLangs.ES,
    rootTranslationsPath: 'src/assets/i18n/',
};

export default TranslocoConfig;