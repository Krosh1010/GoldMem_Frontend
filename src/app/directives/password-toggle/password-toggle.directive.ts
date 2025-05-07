import {
  Directive, ElementRef, Renderer2, HostListener, Input, AfterViewInit,
  Inject,
  Injectable,
  PLATFORM_ID
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appPasswordToggle]',
})
@Injectable()
export class PasswordToggleDirective implements AfterViewInit {
  @Input() targetInputId?: string;
  private inputElement?: HTMLInputElement;
  private isVisible = false;
  private iconElement?: HTMLElement;

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    // Only run this code in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.inputElement = this.targetInputId
        ? this.document.getElementById(this.targetInputId) as HTMLInputElement
        : this.el.nativeElement.previousElementSibling;

      if (!this.inputElement) return;

      this.iconElement = this.renderer.createElement('i');
      this.renderer.addClass(this.iconElement, 'bi');
      this.renderer.addClass(this.iconElement, 'bi-eye-slash');
      this.renderer.addClass(this.iconElement, 'icon');

      const wrapper = this.el.nativeElement;
      this.renderer.appendChild(wrapper, this.iconElement);

      this.inputElement.type = 'password';
      this.renderer.setStyle(wrapper, 'cursor', 'pointer');
    }
  }

  @HostListener('click')
  togglePassword(): void {
    if (!this.inputElement || !this.iconElement) return;

    this.isVisible = !this.isVisible;
    this.inputElement.type = this.isVisible ? 'text' : 'password';

    const newClass = this.isVisible ? 'bi-eye' : 'bi-eye-slash';
    this.renderer.removeClass(this.iconElement, this.isVisible ? 'bi-eye-slash' : 'bi-eye');
    this.renderer.addClass(this.iconElement, newClass);
  }
}