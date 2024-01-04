import {
  afterNextRender,
  AfterRenderPhase,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnChanges,
  Output,
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
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ alias: 'emblaCarousel', transform: optionsTransformer })
  public options: EmblaOptionsType = {};

  @Input({ alias: 'emblaPlugins' })
  public plugins: EmblaPluginType[] = [];

  @Input()
  public subscribeToEvents: EmblaEventType[] = [];

  @Input()
  public eventsThrottleTime = 100;

  @Output()
  public readonly emblaChange = new EventEmitter<EmblaEventType>();

  /**
   * DANGER: do not call emblaApi.prevSlide(), emblaApi.nextSlide(), emblaApi.scrollTo().
   * These methods will trigger too much ChangeDetection, which will lead to serious performance issues.
   * Use EmblaCarouselDirective apis: prevSlide(), nextSlide(), scrollTo()
   */
  public emblaApi?: EmblaCarouselType;

  constructor() {
    afterNextRender(
      () => this.init(),
      { phase: AfterRenderPhase.Write }
    );
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

  scrollTo(index: number, jump?: boolean): void {
    this.ngZone.runOutsideAngular(() => this.emblaApi?.scrollTo(index, jump));
  }

  scrollPrev(jump?: boolean): void {
    this.ngZone.runOutsideAngular(() => this.emblaApi?.scrollPrev(jump));
  }

  scrollNext(jump?: boolean): void {
    this.ngZone.runOutsideAngular(() => this.emblaApi?.scrollNext(jump));
  }

  private init(): void {
    if (this.globalOptions) {
      EmblaCarousel.globalOptions = this.globalOptions;
    }

    this.ngZone.runOutsideAngular(() => {
      this.emblaApi = EmblaCarousel(
        this.elementRef.nativeElement,
        this.options,
        this.plugins
      );

      this.listenEvents();
      this.destroyRef.onDestroy(() => this.destroy());
    });
  }

  private reInit(): void {
    if (!this.emblaApi) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.emblaApi!.reInit(this.options, this.plugins);
    });
  }

  private destroy(): void {
    this.emblaApi?.destroy();
  }

  /**
   * `eventsThrottler$` Subject was made just because `scroll` event fires too often.
   */
  private listenEvents(): void {
    if (0 === this.subscribeToEvents.length) {
      return;
    }

    const eventsThrottler$ = new Subject<EmblaEventType>();

    eventsThrottler$
      .pipe(
        throttleTime(this.eventsThrottleTime),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((eventName) => {
        this.ngZone.run(() => this.emblaChange.emit(eventName));
      });

    this.ngZone.runOutsideAngular(() => {
      this.subscribeToEvents.forEach((eventName) => {
        this.emblaApi!.on(eventName, () => eventsThrottler$.next(eventName));
      });
    });
  }
}
