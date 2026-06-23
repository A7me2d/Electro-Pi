import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _searchSubject = new Subject<string | null>();

  readonly placeholder = input('Search...');
  readonly value = input('');
  readonly search = output<string>();

  ngOnInit(): void {
    this._searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(value => this.search.emit(value ?? ''));
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._searchSubject.next(value);
  }
}
