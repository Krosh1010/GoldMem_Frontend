import {
  Directive, ElementRef, Renderer2, HostListener, Input, AfterViewInit
} from '@angular/core';

@Directive({
  selector: '[appPasswordToggle]',
})
export class PasswordToggleDirective implements AfterViewInit {
  @Input() targetInputId?: string;
  private inputElement?: HTMLInputElement;
  private isVisible = false;
  private iconElement?: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
  
    this.inputElement = this.targetInputId
      ? document.getElementById(this.targetInputId) as HTMLInputElement
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
