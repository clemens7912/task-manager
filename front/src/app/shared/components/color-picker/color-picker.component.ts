import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  imports: [],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.css'
})
export class ColorPickerComponent implements OnInit{
  readonly colors = ['red', 'yellow', 'lime', 'cyan', 'blue', 'rose'];
  readonly shades = ['300', '500', '700'];

  palette!: string[][];
  @Output() colorChange = new EventEmitter<string>();

  ngOnInit(): void {
    this.palette = this.colorShades();
  }

  colorShades(): string[][] {
    return this.colors.map((color) => {
      return this.shades.map(shade => `${color}-${shade}`)
    });
  }

  changeColor(selectedColor: string){
    this.colorChange.emit(selectedColor);
  }
}
