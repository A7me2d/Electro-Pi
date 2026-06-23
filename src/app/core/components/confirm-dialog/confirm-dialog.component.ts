import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  private _dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  onConfirm(): void {
    this._dialogRef.close(true);
  }

  onCancel(): void {
    this._dialogRef.close(false);
  }
}
