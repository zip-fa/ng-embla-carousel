import { InjectionToken, Provider } from '@angular/core';
import { EmblaOptionsType } from 'embla-carousel';

const DEFAULT_EMBLA_OPTIONS: EmblaOptionsType = {};

export const EMBLA_OPTIONS_TOKEN = new InjectionToken<EmblaOptionsType>('EMBLA_OPTIONS_TOKEN', {
  factory: () => DEFAULT_EMBLA_OPTIONS
});

export function provideEmblaGlobalOptions(options: EmblaOptionsType): Provider[]
{
  return [
    {
      provide: EMBLA_OPTIONS_TOKEN,
      useValue: {
        ...DEFAULT_EMBLA_OPTIONS,
        ...options
      }
    }
  ];
}
