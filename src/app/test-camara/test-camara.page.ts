import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CustomLoadingComponent } from '../custom-loading/custom-loading.component';

@Component({
  selector: 'app-test-camera',
  templateUrl: './test-camara.page.html',
  styleUrls: ['./test-camara.page.scss'],
})
export class TestCamaraPage implements OnInit {
  videoElement!: HTMLVideoElement;
  isStreaming: boolean = false;


  constructor(private modalController: ModalController) {

  }
  ngOnInit() {
    this.videoElement = document.querySelector('video') as HTMLVideoElement;
    this.startCamera();
  }

  async startCamera() {
    let loader: any = null;

    try {

      loader = await this.modalController.create({
        component: CustomLoadingComponent
      });
      await loader.present();
  
      console.log('Iniciando cámara trasera con la mejor calidad disponible...');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 4096 },
          height: { ideal: 2160 },
          facingMode: "environment"
        } 
      });

      this.videoElement.srcObject = stream;
      this.isStreaming = true;
      console.log('📹 Streaming iniciado correctamente con la cámara trasera.');
      // if (loader) {
      //   loader.dismiss();  // Cierra la modal en caso de error
      // }
    } catch (error) {
      console.error('Error al iniciar la cámara: ', error);
    }
  }
}
