import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.scss'],
})
export class ErrorAlertComponent {
  @Input() error: Error;

  extractErrorMessage(): string {
    const err = this.error as any;
    if (typeof err.error === 'string') return err.error;
    if (typeof err.error?.error === 'string') return err.error.error;
    if (typeof err.error?.message === 'string') return err.error.message;
    return this.error.message;
  }
}
