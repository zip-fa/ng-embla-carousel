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

  @Input({ alias: 'emblaCarousel' })
  public options: EmblaOptionsType = {};

  @Input({ alias: 'emblaPlugins' })
  public plugins: EmblaPluginType[] = [];

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
   * By default, `scroll` is excluded from default `listenEvents` array, because it triggers too much change detection,
   * but in case we want to listen it, we need to throttle its emits.
   * `eventsThrottler$` Subject was made just because of it.
   */
  private listenEvents(): void {
    const { eventsThrottleTime, listenEvents } = this.globalOptions;

    // This code is valid by the api design: `provideEmblaOptions({ eventsThrottleTime: undefined, listenEvents: undefined })`
    if (!eventsThrottleTime || !listenEvents) {
      return;
    }

    const eventsThrottler$ = new Subject<EmblaEventType>();

    eventsThrottler$
      .pipe(
        throttleTime(eventsThrottleTime),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((eventName) => {
        this.ngZone.run(() => this.emblaChange.emit(eventName));
      });

    this.ngZone.runOutsideAngular(() => {
      listenEvents.forEach((eventName) => {
        this.emblaApi!.on(eventName, () => eventsThrottler$.next(eventName));
      });
    });
  }
}
