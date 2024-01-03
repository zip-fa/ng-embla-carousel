import { InjectionToken, Provider } from '@angular/core';
import { EmblaEventType, EmblaOptionsType } from 'embla-carousel';

type NgEmblaOptions = EmblaOptionsType & Partial<{
  eventsThrottleTime: number;
  listenEvents: EmblaEventType[];
}>;

const DEFAULT_EMBLA_OPTIONS: NgEmblaOptions = {
  eventsThrottleTime: 100,
  listenEvents: [
    'init',
    'pointerDown',
    'pointerUp',
    'slidesChanged',
    'slidesInView',
    'select',
    'settle',
    'destroy',
    'reInit',
    'resize'
  ]
};

export const EMBLA_OPTIONS_TOKEN = new InjectionToken<NgEmblaOptions>('EMBLA_OPTIONS_TOKEN', {
  factory: () => DEFAULT_EMBLA_OPTIONS
});

export function provideEmblaGlobalOptions(options: NgEmblaOptions): Provider[]
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
