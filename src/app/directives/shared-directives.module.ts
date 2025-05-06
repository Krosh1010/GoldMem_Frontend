import { NgModule } from '@angular/core';
import { LazyScrollDirective } from './lazy-scroll/lazy-scroll.directive';
import { PasswordToggleDirective } from './password-toggle/password-toggle.directive';
import { PasswordStrengthDirective } from './password-strength/password-strength.directive';

@NgModule({
  declarations: [LazyScrollDirective, PasswordToggleDirective, PasswordStrengthDirective],   // Declari directiva
  exports: [LazyScrollDirective, PasswordToggleDirective, PasswordStrengthDirective]         // Oferi directiva pentru import
})
export class SharedDirectivesModule { }
