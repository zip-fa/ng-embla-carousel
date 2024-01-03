import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { EmblaCarouselDirective } from '@zip-fa/ng-embla-carousel';
import { EmblaEventType, EmblaPluginType } from 'embla-carousel';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import Autoplay from 'embla-carousel-autoplay';
import { JsonPipe } from '@angular/common';

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

@Component({
  standalone: true,
  imports: [
    EmblaCarouselDirective,
    ReactiveFormsModule,
    JsonPipe
  ],
  selector: 'ng-embla-carousel-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public readonly options = new FormGroup({
    loop: new FormControl(true) as FormControl<boolean>,
    duration: new FormControl(25) as FormControl<number>
  });

  public readonly slideImages = signal<string[]>( [
    '/assets/images/slide-1.jpg',
    '/assets/images/slide-2.jpg',
    '/assets/images/slide-3.jpg',
    '/assets/images/slide-4.jpg'
  ]);

  public readonly eventHistory = signal<string[]>([]);
  public readonly pluginsArray = computed(() => Object.values(this.plugins()));
  public readonly plugins = signal<Record<string, EmblaPluginType>>({});

  onEmblaChanged(event: EmblaEventType): void {
    this.eventHistory.update((eventHistory) => [event, ...eventHistory]);
  }

  toggleAutoplayPlugin(): void {
    this.plugins.update((plugins) => {
      const immutableObj = {...plugins};

      if (immutableObj['autoPlay']) {
        delete immutableObj['autoPlay'];

        return immutableObj;
      } else {
        return {
          ...immutableObj,
          autoPlay: Autoplay({ delay: 4000 })
        };
      }
    });
  }

  toggleWheelPlugin(): void {
    this.plugins.update((plugins) => {
      if (plugins['wheel']) {
        delete plugins['wheel'];

        return plugins;
      } else {
        return {
          ...plugins,
          wheel: WheelGesturesPlugin()
        };
      }
    });
  }

  addSlide(): void {
    this.slideImages.update((images) => {
      return [
        ...images,
        `/assets/images/slide-${ getRandomInt(1, 4) }.jpg`
      ];
    });
  }

  removeSlide(): void {
    this.slideImages.update((images) => images.slice(0, -1));
  }
}
