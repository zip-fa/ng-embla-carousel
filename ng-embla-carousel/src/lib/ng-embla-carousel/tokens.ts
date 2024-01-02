import { InjectionToken, Provider } from '@angular/core';
import { EmblaOptionsType } from 'embla-carousel';

export const EMBLA_OPTIONS_TOKEN = new InjectionToken<EmblaOptionsType>('EMBLA_OPTIONS_TOKEN');

export function provideEmblaGlobalOptions(options: EmblaOptionsType): Provider[]
{
  return [
    {
      provide: EMBLA_OPTIONS_TOKEN,
      useValue: options
    }
  ];
}
