import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { Camera } from '@capacitor/camera';
import { IdVisionComunicationService } from '../services/id-vision/id-vision-communication.service';
import { IonHeader, IonTitle, IonToolbar, IonContent } from "@ionic/angular/standalone";
import { EventService } from '../services/events/event.service';
import { IdVisionComponent, SdkCommunicationService } from 'meta-g';


@Component({
  selector: 'app-id-vs',
  templateUrl: './id-vs.page.html',
  standalone: true,
  styleUrls: ['./id-vs.page.scss'],
  imports: [IonContent, IonToolbar, IonTitle, IonHeader, CommonModule, FormsModule, IdVisionComponent, HttpClientModule]
})
export class IdVsPage implements OnInit {

  dpiNumber: string = '';

  private isAndroid: boolean;
  private isIOS: boolean;
  constructor( private sdkCommunicationService: SdkCommunicationService, private eventService: EventService, private platform: Platform, private idVisionComunicationService: IdVisionComunicationService, private cdr: ChangeDetectorRef) { 
    this.isAndroid = this.platform.is('android');
    this.isIOS = this.platform.is('ios');
  }
  ngOnInit() {
    this.eventService.getEvent().subscribe(data => {
      console.log('Datos recibidos:', data);
      if (data) {
        this.dpiNumber = data.dpi;
        this.cdr.detectChanges();
        console.log('dpi: ', this.dpiNumber);
      }
    });
    
    this.sdkCommunicationService.onExit$.subscribe((result: boolean) => {
      console.log('Resultado recibido desde el plugin:', result);
      if (result) {
        //logica si el resultado es true
        console.log('Proceso completado exitosamente.');
      } else {
        //logica si el resultado es false
        console.log('Faltan pasos por completar.');
      }
      this.idVisionComunicationService.setExitResult(result);
    });
  }


  async ngAfterViewInit() {
    if (this.isAndroid || this.isIOS) {
      await this.requestPermissions();
    }
  }

  async requestPermissions() {
    try {
      const permissions = await Camera.requestPermissions();
      if (permissions.camera === 'denied') {
        console.error('Permiso de cámara denegado');
      } else {
        console.log('Permisos concedidos', permissions);
      }
    } catch (err) {
      console.error('Error solicitando permisos:', err);
    }
  }


}
