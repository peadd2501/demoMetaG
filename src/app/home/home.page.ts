import { Component, ViewChild } from '@angular/core';
import { IdVisionComunicationService } from '../services/id-vision/id-vision-communication.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, NavController, IonIcon, IonInput, IonItem } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { EventService } from '../services/events/event.service';
import { ModalController } from '@ionic/angular';
import { CamaraAcuerdoVideoComponent } from '../camara-acuerdo-video/camara-acuerdo-video.component';
import { SimpleAcuerdoVideoComponent } from '../simple-acuerdo-video/simple-acuerdo-video.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports:[IonIcon, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, IonInput, IonItem],
})
export class HomePage {
  
  @ViewChild('DpiInput', { static: true }) ionDpiInput!: IonInput;
  dpiModel = '';
  exitResult: boolean | null = null;
  isSuccess: boolean | null = null;

  constructor(private navController: NavController, private eventService: EventService, private idVisionComunicationService: IdVisionComunicationService, private modalController: ModalController) {}

  ngOnInit() {
    this.idVisionComunicationService.exitResult$.subscribe((result: boolean | null) => {
      if (result !== null) {
        this.exitResult = result;
        if (result) {
          this.isSuccess = true;
          console.log('El proceso fue exitoso.');
        } else {
          this.isSuccess = false;
          console.log('El proceso falló.');
        }
      }
    });
  }

  onInput(ev: any) {
    const value = ev.target!.value;
    const filteredValue = value.replace(/[^0-9]/g, '');
    this.ionDpiInput.value = this.dpiModel = filteredValue;
    console.log(this.ionDpiInput.value);
  }

  openSDK() {
    const dataToSend = { dpi: this.ionDpiInput.value };
    console.log(dataToSend);
    
    this.eventService.sendEvent(dataToSend);
    this.navController.navigateForward('id-vs'); 
  }

  openTTS() {
    this.navController.navigateForward('text-to-spech');
  }

  openCamara() {
    this.navController.navigateForward('test-camara');
  }
  async openAcuerdoVideo() {
    const modal = await this.modalController.create({
      component: CamaraAcuerdoVideoComponent,
      componentProps: {
      //   cssClass: 'my-custom-class',
      //   text1: 'Video Selfie',
      //   text2: 'Guatemala',
      //   overlaySrc: 'assets/overlay-image.png',
        backFunction: async (file: File) => {
          // await this.getAcuerdoVideo(file);
        },
        // closeRequested: () => this.closeModalOverlay(),
      },
      backdropDismiss: false,
    });

    await modal.present();
  }

  async openVideoSelfie() {
    const modal = await this.modalController.create({
      component: SimpleAcuerdoVideoComponent,
      componentProps: {
        cssClass: 'my-custom-class',
        overlaySrc: 'assets/overlay-image.png',
        backFunction: async (file: File) => {
          // await this.getBackModal(file);
        },
        // closeRequested: () => this.closeModalOverlay(),
      },
      backdropDismiss: false,
    });

    await modal.present();
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} caracteres pendientes`;
  }

}