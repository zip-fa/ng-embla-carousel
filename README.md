# NgEmblaCarousel

## Installation 

`npm i @zip-fa/ng-embla-carousel`

## Start the demo

Use `nx run demo:serve` to start the demo

## Usage

Render embla slider

``` angular17html
<div class="embla">
  <div class="embla__viewport"
    #emblaRef="emblaCarousel"
    [emblaCarousel]="options.value"
    [emblaPlugins]="pluginsArray()"
    (emblaChange)="onEmblaChanged($event)"
  >
    <div class="embla__container">
      @for (slide of slideImages(); track $index) {
        <div class="embla__slide">
          <div class="embla__slide__number"><span>{{ $index + 1 }}</span></div>
          <img class="embla__slide__img" [src]="slide" alt="Your alt text">
        </div>
      }
    </div>
  </div>
</div>
```

## Options

You can set your options globally 

```ts
import { ApplicationConfig } from '@angular/core';

import { provideEmblaGlobalOptions } from '@zip-fa/ng-embla-carousel';

export const appConfig: ApplicationConfig = {
  providers: [provideEmblaGlobalOptions({ duration: 123 })] 
};
```

Or inside your component

```ts
public readonly options = {
  loop: boolean = true,
  duration: number = 25
};
```

List of all options and their descriptions: https://www.embla-carousel.com/api/options/ 

## Events

You can trigger events using @Output **(emblaChage)**
```angular17html
  (emblaChange)="yourFunction($event)"
```

List of all events and their descriptions: https://www.embla-carousel.com/api/events/

## Methods

❗️**DANGER**❗
Do not call emblaApi.prevSlide(), emblaApi.nextSlide(), emblaApi.scrollTo().
These methods will trigger too much ChangeDetection, which will lead to serious performance issues.
Use EmblaCarouselDirective apis: prevSlide(), nextSlide(), scrollTo()

`scrollNext(jump?: boolean)` - scroll to next slide

`scrollPrev(jump?: boolean)` - scroll to previous slide

`scrollTo(jump?: boolean, index: number)` - scroll to slide with the specified index

```angular17html
<button type="button" class="button"
  (click)="emblaRef.scrollPrev()"
>
  Prev slide
</button>

<button type="button" class="button"
  (click)="emblaRef.scrollNext()"
>
  Next slide
</button>

<button type="button" class="button"
  (click)="emblaRef.scrollTo(3)"
>
  To third slide
</button>
```

## Inputs

Use @Input emblaCarousel: EmblaOptionsType to specify your options

```ts
public readonly options = {
  loop: boolean = true,
  duration: number = 25
};
```

```angular17html
[emblaCarousel]="options.value"
```

Use @Input emblaPlugins: EmblaPluginType[] to specify your plugins

```angular17html
[emblaPlugins]="pluginsArray()"
```