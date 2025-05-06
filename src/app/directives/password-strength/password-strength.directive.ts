// password-strength.directive.ts
import { Directive, ElementRef, Input, HostListener, Renderer2, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appPasswordStrength]',
})
export class PasswordStrengthDirective implements OnDestroy {
  @Input() minLength: number = 4;
  private strengthBar!: HTMLElement;
  private strengthText!: HTMLElement;
  private container!: HTMLElement;
  private rulesList!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.createStrengthIndicator();
  }

  ngOnDestroy() {
    if (this.container.parentNode) {
      this.renderer.removeChild(this.el.nativeElement.parentNode, this.container);
    }
  }

  private createStrengthIndicator() {
    // Container principal
    this.container = this.renderer.createElement('span');
    this.renderer.addClass(this.container, 'password-strength-container');
    this.renderer.setStyle(this.container, 'display', 'block');
    
    // Bara de putere
    this.strengthBar = this.renderer.createElement('span');
    this.renderer.addClass(this.strengthBar, 'password-strength-bar');
    this.renderer.setStyle(this.strengthBar, 'display', 'block');
    
    // Textul indicatorului
    this.strengthText = this.renderer.createElement('span');
    this.renderer.addClass(this.strengthText, 'password-strength-text');
    this.renderer.setStyle(this.strengthText, 'display', 'block');
    this.renderer.setProperty(this.strengthText, 'innerText', 'Password strength');

    // Create rules list
    this.rulesList = this.renderer.createElement('ul');
    this.renderer.addClass(this.rulesList, 'password-rules-list');
    
    const rules = [
      { id: 'length', text: `At least ${this.minLength} characters` },
      { id: 'uppercase', text: 'At least one uppercase letter' },
      { id: 'number', text: 'At least one number' },
      { id: 'special', text: 'At least one special character' }
    ];

    rules.forEach(rule => {
      const li = this.renderer.createElement('li');
      this.renderer.setAttribute(li, 'id', `rule-${rule.id}`);
      
      // Create icon span
      const icon = this.renderer.createElement('span');
      this.renderer.addClass(icon, 'rule-icon');
      this.renderer.setStyle(icon, 'margin-right', '5px');
      this.renderer.appendChild(icon, this.renderer.createText('✗'));
      this.renderer.setStyle(icon, 'color', '#ff4d4d'); // Red color for X
      
      // Create text span
      const text = this.renderer.createElement('span');
      this.renderer.appendChild(text, this.renderer.createText(rule.text));
      
      // Append icon and text to li
      this.renderer.appendChild(li, icon);
      this.renderer.appendChild(li, text);
      this.renderer.appendChild(this.rulesList, li);
    });

    // Append all elements
    this.renderer.appendChild(this.container, this.strengthBar);
    this.renderer.appendChild(this.container, this.strengthText);
    this.renderer.appendChild(this.container, this.rulesList);
    this.renderer.appendChild(this.el.nativeElement.parentNode, this.container);
  }

  @HostListener('input') onInput() {
    const password = this.el.nativeElement.value;
    const strength = this.calculateStrength(password);
    this.updateStrengthIndicator(strength, password);
  }

  private calculateStrength(password: string): number {
    let strength = 0;
    const rules = {
      length: password.length >= this.minLength,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    // Update rules visibility
    Object.entries(rules).forEach(([key, value]) => {
      const ruleElement = document.getElementById(`rule-${key}`);
      if (ruleElement) {
        const icon = ruleElement.querySelector('.rule-icon');
        if (icon) {
          this.renderer.setProperty(icon, 'innerText', value ? '✓' : '✗');
          this.renderer.setStyle(icon, 'color', value ? '#66cc66' : '#ff4d4d'); // Green for check, red for X
        }
      }
    });

    // Calculate strength score
    if (rules.length) strength += 1;
    if (rules.uppercase) strength += 1;
    if (rules.number) strength += 1;
    if (rules.special) strength += 1;

    return strength;
  }

  private updateStrengthIndicator(strength: number, password: string) {
    const colors = ['#ff4d4d', '#ffa64d', '#ffcc00', '#66cc66', '#009900'];
    const messages = [
      'Very Weak',
      'Weak',
      'Medium',
      'Strong',
      'Very Strong'
    ];

    const width = password ? (strength / 4) * 100 : 0;
    const index = password ? strength : 0;
    
    this.renderer.setStyle(this.strengthBar, 'width', `${width}%`);
    this.renderer.setStyle(this.strengthBar, 'background-color', colors[index]);
    this.renderer.setProperty(this.strengthText, 'innerText', password ? messages[index] : 'Password strength');
  }
}