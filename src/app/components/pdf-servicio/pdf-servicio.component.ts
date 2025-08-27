import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-pdf-servicio',
  templateUrl: './pdf-servicio.component.html',
  styleUrls: ['./pdf-servicio.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class PdfServicioComponent {
  selectedFile: File | null = null;
  downloadUrl: string | null = null;
  jwtToken = 'TU_LLAVE_AWT_AQUI';

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadPDF() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('pdf', this.selectedFile);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.jwtToken}`
    });

    this.http.post<any>('https://TU_API_URL/upload', formData, { headers })
      .subscribe({
        next: (res) => {
          this.downloadUrl = `https://TU_API_URL/download/${encodeURIComponent(res.path.split('\\').pop())}`;
        },
        error: () => {
          alert('Error al subir el PDF');
        }
      });
  }
}