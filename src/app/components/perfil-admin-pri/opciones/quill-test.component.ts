import { Component } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quill-test',
  template: `
    <div style="max-width: 700px; margin: 40px auto; padding: 24px; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      <h2 style="text-align:center; margin-bottom: 24px;">Prueba Editor Quill</h2>
      <quill-editor theme="snow" style="width: 600px; height: 240px; display: block; margin: 0 auto;"></quill-editor>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, QuillModule]
})
export class QuillTestComponent {}
