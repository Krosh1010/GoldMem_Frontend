import { Directive, ElementRef, Renderer2, OnInit, OnDestroy, Input } from '@angular/core';

@Directive({
  selector: '[appLazyScroll]',
})
export class LazyScrollDirective implements OnInit, OnDestroy {
  @Input() enabled: boolean = true;
  private observer: IntersectionObserver | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    if (this.enabled) {
      this.setupObserver();
    } else {
      this.applyEffectsImmediately();
    }
  }
  
  private setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.applyEffects();
          this.observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    this.observer.observe(this.el.nativeElement);
  }

  private applyEffects() {
    this.renderer.addClass(this.el.nativeElement, 'fade-in');
  }

  private applyEffectsImmediately() {
    this.renderer.addClass(this.el.nativeElement, 'fade-in');
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}