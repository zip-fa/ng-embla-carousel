# NgEmblaCarousel

Simple Angular wrapper for [embla-carousel](https://www.embla-carousel.com/).<br>
**WARNING: CURRENTLY IN ACTIVE DEVELOPMENT, API MAY CHANGE**

## Features

- 🖐️ **SSR in mind**
- 🔥 **Performant**
- 🛠 **Super-lightweight**: embla-carousel 6.7kb + angular directive 1kb gzipped

## Compatibility with Angular Versions

<table>
  <thead>
    <tr>
      <th>@zip-fa/ng-embla-carousel</th>
      <th>Angular</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        0.x
      </td>
      <td>
        >= 16.0
      </td>
    </tr>
  </tbody>
</table>

## Installation and setup

`npm i @zip-fa/ng-embla-carousel`

### Optional step:<br>
Provide global options in your app.config.ts:

```
import { provideEmblaGlobalOptions } from '@zip-fa/ng-embla-carousel';

providers: [
  provideEmblaGlobalOptions({
    skipSnaps: true,
    loop: true
  })
]
```

[Full configuration reference](https://www.embla-carousel.com/api/options/)

## Usage

**component.ts**:

```ts
import { EmblaCarouselDirective } from '@zip-fa/ng-embla-carousel';


@Component({
  imports: [EmblaCarouselDirective]
})
```

**component.html**:

Control flow (angular v17+):

``` angular17html
<div class="embla">
  <div class="embla__viewport"
    emblaCarousel
  >
    <div class="embla__container">
      @for (slide of slides; track $index) {
        <div class="embla__slide">
          <div class="embla__slide__number"><span>{{ $index + 1 }}</span></div>
          <img class="embla__slide__img" [src]="slide" alt="Your alt text">
        </div>
      }
    </div>
  </div>
</div>
```

*ngFor:

``` angular17html
<div class="embla">
  <div class="embla__viewport"
    emblaCarousel
  >
    <div class="embla__container">
      <div class="embla__slide"
        *ngFor="let slide of slides"
      >
        <div class="embla__slide__number"><span>{{ $index + 1 }}</span></div>
        <img class="embla__slide__img" [src]="slide" alt="Your alt text">
      </div>
    </div>
  </div>
</div>
```

**component.scss**:

```scss
.embla {
  --slide-spacing: 1rem;
  --slide-size: 100%;
  --slide-height: 19rem;

  &__viewport {
    overflow: hidden;
  }

  &__container {
    backface-visibility: hidden;
    display: flex;
    touch-action: pan-y;
    margin-left: calc(var(--slide-spacing) * -1);
  }

  &__slide {
    flex: 0 0 var(--slide-size);
    min-width: 0;
    padding-left: var(--slide-spacing);
    position: relative;
  }

  &__slide__img {
    display: block;
    height: var(--slide-height);
    width: 100%;
    object-fit: cover;
  }
}
```

### Complete example:

component.ts:

```ts
import { Component, ViewChild } from '@angular/core';
import { EmblaCarouselDirective } from '@zip-fa/ng-embla-carousel';
import type { EmblaOptionsType, EmblaPluginType, EmblaEventType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

@Component()
export class MyComponent {
  @ViewChild(EmblaCarouselDirective, { static: true })
  private emblaCarousel!: EmblaCarouselDirective;

  public readonly options: EmblaOptionsType = {
    loop: true,
    duration: 25
  };

  public readonly plugins: EmblaPluginType[] = [Autoplay({ delay: 4000 })];

  public readonly subscribeToEvents: EmblaEventType[] = [
    'init',
    'pointerDown',
    'pointerUp',
    'slidesChanged',
    'slidesInView',
    'select',
    'settle',
    'destroy',
    'reInit',
    'resize',
    'scroll'
  ];

  onEmblaChanged(event: EmblaEventType): void {
    console.log(`Embla event triggered: ${event}`, this.emblaCarousel.emblaApi);
  }
}
```

```angular17html
<div class="embla">
  <div class="embla__viewport"
    #emblaRef="emblaCarousel"
    [emblaCarousel]="options"
    [emblaPlugins]="plugins"
    [subscribeToEvents]="subscribeToEvents"
    [eventsThrottleTime]="100"
    (emblaChange)="onEmblaChanged($event)"
  >
    ...
  </div>
  
  <button type="button" (click)="emblaRef.scrollPrev()">Prev slide</button>
  <button type="button" (click)="emblaRef.scrollNext()">Next slide</button>
  <button type="button" (click)="emblaRef.scrollTo(3)">To third slide</button>
</div>
```

Tip: you can change `embla` prefix to whatever you want. Please configure everything by your needs

## API reference

### Inputs

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Reference</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        emblaCarousel
      </td>
      <td>
        EmblaOptionsType
      </td>
      <td>
        <a href="https://www.embla-carousel.com/api/options/">view</a>
      </td>
    </tr>
    <tr>
      <td>
        emblaPlugins
      </td>
      <td>
        EmblaPluginType[]
      </td>
      <td>
        <a href="https://www.embla-carousel.com/plugins/">view</a>
      </td>
    </tr>
    <tr>
      <td>
        subscribeToEvents
      </td>
      <td>
        EmblaEventType[]
      </td>
      <td>
        which events will be emitted from (emblaChange)
      </td>
    </tr>
    <tr>
      <td>
        eventsThrottleTime
      </td>
      <td>
        number (ms)
      </td>
      <td>
        trhottle for rapid embla events, such as scroll; 100 ms by default
      </td>
    </tr>
  </tbody>
</table>

### Outputs

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        (emblaChange)
      </td>
      <td>
        EmblaEventType
      </td>
    </tr>
  </tbody>
</table>

### Methods

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Reference</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        scrollNext(jump?: boolean)
      </td>
      <td>
        Scroll to next slide
      </td>
      <td>
        <a href="https://www.embla-carousel.com/api/methods/#scrollnext">view</a>
      </td>
    </tr>
    <tr>
      <td>
        scrollPrev(jump?: boolean)
      </td>
      <td>
        Scroll to prev slide
      </td>
      <td>
        <a href="https://www.embla-carousel.com/api/methods/#scrollprev">view</a>
      </td>
    </tr>
    <tr>
      <td>
        scrollTo(index: number, jump?: boolean)
      </td>
      <td>
        Scroll to given slide
      </td>
      <td>
        <a href="https://www.embla-carousel.com/api/methods/#scrollto">view</a>
      </td>
    </tr>
  </tbody>
</table>

### Access embla api

#### ❗️DANGER ❗
`emblaApi.on()`, `emblaApi.scrollNext()`, `emblaApi.scrollPrev()`, `emblaApi.scrollTo()` calls will trigger too much ChangeDetection, which will lead to serious performance issues.<br>
Consider using `EmblaCarouselDirective.scrollPrev()`, `EmblaCarouselDirective.scrollNext()`, `EmblaCarouselDirective.scrollTo()` - they are wrapped with `ngZone.runOutsideAngular()`.

```ts
@Component()
export class MyComponent {
  @ViewChild(EmblaCarouselDirective, { static: true })
  private emblaCarousel!: EmblaCarouselDirective;
  
  someAction(): void {
    const { emblaApi } = this.emblaCarousel; // EmblaCarouselType
    
    console.log(emblaApi.canScrollPrev());
  }
}
```

[Full reference](https://www.embla-carousel.com/api/)
