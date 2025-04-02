import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-error',
  templateUrl: './modal-error.component.html',
  styleUrls: ['./modal-error.component.scss'],
})
export class ModalErrorComponent {
  @Input() title: string = '';
  @Input() variant: 'dpi' | 'video' = 'dpi';

    // Propiedad para el mensaje único (en caso de no querer usar errorMessages)
    @Input() message: string = '';

    // Internamente siempre se trabaja con un array
    public errorMessages: string[] = [];
  
    // Setter para normalizar el input de errores
    @Input()
    set errors(value: string | string[]) {
      if (Array.isArray(value)) {
        this.errorMessages = value;
      } else if (value && typeof value === 'string') {
        this.errorMessages = [value];
      } else {
        this.errorMessages = [];
      }
    }
  
    constructor(private modalCtrl: ModalController) {}
  
    closeModal() {
      this.modalCtrl.dismiss();
    }
}
