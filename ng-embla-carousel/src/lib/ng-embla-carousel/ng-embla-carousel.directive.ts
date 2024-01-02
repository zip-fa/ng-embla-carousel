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
  Output
} from '@angular/core';
import EmblaCarousel, {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
  EmblaPluginType
} from 'embla-carousel';
import { EMBLA_OPTIONS_TOKEN } from './tokens';

@Directive({
  selector: '[ngEmblaCarousel]',
  exportAs: 'ngEmblaCarousel',
  standalone: true
})
export class NgEmblaCarouselDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly globalOptions = inject(EMBLA_OPTIONS_TOKEN, { optional: true });
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true })
  set ngEmblaCarousel(options: EmblaOptionsType) {
    this.options = options;
    this.reInit();
  }

  @Input({ alias: 'plugins' })
  set _plugins(plugins: EmblaPluginType[]) {
    this.plugins = plugins;
    this.reInit();
  }

  @Output()
  public readonly emblaChange = new EventEmitter<EmblaEventType>();

  public emblaApi?: EmblaCarouselType;

  private plugins: EmblaPluginType[] = [];
  private options!: EmblaOptionsType;

  constructor() {
    afterNextRender(
      () => this.init(),
      { phase: AfterRenderPhase.Write }
    );
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
    this.emblaApi && this.emblaApi.destroy();
  }
}
