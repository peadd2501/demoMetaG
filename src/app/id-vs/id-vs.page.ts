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
import { Capacitor } from '@capacitor/core';


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

  //Conexion de akisi
  // connectionString: string = '67abb4f11b7efa02f9a60aac';
  // apiKeyString: string = 'metaG-LhV9FNbtlW6P2C6XQypOmh2Vgo6avJSr8UyLoHCRNB8lJb9mTa30AhaVIw4nPmFQOLtOp8wYA3GjjfSICCsqVfmrjN8uNzrbQcIr0bTYtTpFqQ7BasqDRGSasWuGphL1mKDFEz3FGJ6yetYu';

  //Validacion video selfie y dpi's
  connectionString: string = '67c22c4a3cb3e9262a3e3e27';
  apiKeyString: string = 'metaG-r3loXTqLFr3tXVJ2TZNb3TixKiDi3c4WDxy0so4GvXYMfu9vKwAPZJmxgiIJHbnpo24vK5MEcIVzGCa5AtuScizemceMIMfnH5NTEy84UA6WIcMJzadvHZAwBsF5krZyvSBbcKRW8PpSQWBl';

  //Validacion solo dpi's
  // connectionString: string = '67c231033cb3e9262a3e3e2a';
  // apiKeyString: string = 'metaG-79lnp8ws6IJnThckyhdPRpIQ9pKKd43tImbqNCaNxTvLdD4ar9ajktnkMnQt9kgrIUKYWvTqL5kk18BFSI7Lu83DpxE5OsXaG53ohrP0MW4S5unyd26nAZI4FugGrTW4T8VEMitSK4viCpRS';

  constructor( private sdkCommunicationService: SdkCommunicationService, private eventService: EventService, private platform: Platform, private idVisionComunicationService: IdVisionComunicationService, private cdr: ChangeDetectorRef) { 
    this.isAndroid = this.platform.is('android');
    this.isIOS = this.platform.is('ios');
  }
  ngOnInit() {
    this.eventService.getEvent().subscribe(data => {
      console.log('Datos recibidos:', data);
      if (data) {
        this.dpiNumber = data.dpi;
        // this.cdr.detectChanges();
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
    if(Capacitor.getPlatform() !== 'web') {
      if (this.isAndroid || this.isIOS) {
        await this.requestPermissions();
      }
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
