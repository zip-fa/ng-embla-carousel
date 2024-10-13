import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  OnChanges,
  output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import EmblaCarousel from 'embla-carousel';
import type {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
  EmblaPluginType
} from 'embla-carousel';
import { EMBLA_OPTIONS_TOKEN } from './tokens';
import { Subject, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

function optionsTransformer(value: EmblaOptionsType | ''): EmblaOptionsType {
  return value || {};
}

@Directive({
  selector: '[emblaCarousel]',
  exportAs: 'emblaCarousel',
  standalone: true
})
export class EmblaCarouselDirective implements OnChanges {
  private readonly elementRef = inject(ElementRef);
  private readonly globalOptions = inject(EMBLA_OPTIONS_TOKEN);
  private readonly destroyRef = inject(DestroyRef);

  public options = input({}, { alias: 'emblaCarousel', transform: optionsTransformer });
  public plugins = input<EmblaPluginType[]>([], { alias: 'emblaPlugins' });
  public subscribeToEvents = input<EmblaEventType[]>([]);
  public eventsThrottleTime = input<number>(100);

  public readonly emblaChange = output<EmblaEventType>();

  public emblaApi?: EmblaCarouselType;

  constructor() {
    afterNextRender(() => this.init());
  }

  ngOnChanges(changes: SimpleChanges) {
    const optionsChange = changes['options'] as SimpleChange | undefined;
    const pluginsChange = changes['plugins'] as SimpleChange | undefined;

    if(
      (optionsChange && !optionsChange.firstChange) ||
      (pluginsChange && !pluginsChange.firstChange)
    ) {
      this.reInit();
    }
  }

  private init(): void {
    if (this.globalOptions) {
      EmblaCarousel.globalOptions = this.globalOptions;
    }

    this.emblaApi = EmblaCarousel(
      this.elementRef.nativeElement,
      this.options(),
      this.plugins()
    );

    this.listenEvents();
    this.destroyRef.onDestroy(() => this.destroy());
  }

  private reInit(): void {
    if (!this.emblaApi) {
      return;
    }

    this.emblaApi.reInit(this.options(), this.plugins());
  }

  private destroy(): void {
    this.emblaApi?.destroy();
  }

  /**
   * `eventsThrottler$` Subject was made just because `scroll` event fires too often.
   */
  private listenEvents(): void {
    if (0 === this.subscribeToEvents().length) {
      return;
    }

    const eventsThrottler$ = new Subject<EmblaEventType>();

    eventsThrottler$
      .pipe(
        throttleTime(this.eventsThrottleTime()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((eventName) => {
        this.emblaChange.emit(eventName)
      });

    this.subscribeToEvents().forEach((eventName) => {
      this.emblaApi!.on(eventName, () => eventsThrottler$.next(eventName));
    });
  }
}
