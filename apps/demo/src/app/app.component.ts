import { Component } from '@angular/core';
import { NgEmblaCarouselDirective } from '@zip-fa/ng-embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

@Component({
  standalone: true,
  imports: [
    NgEmblaCarouselDirective
  ],
  selector: 'ng-embla-carousel-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public readonly plugins = [Autoplay({ delay: 4000 })];
}
