import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-acuerdo-video',
  templateUrl: './camara-acuerdo-video.component.html',
  styleUrls: ['./camara-acuerdo-video.component.scss'],
})
export class CamaraAcuerdoVideoComponent implements OnInit {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @Input() backFunction!: (filePath: File) => Promise<void>;

  countdown: number = 0;
  isRecording: boolean = false;
  timeRemaining: number = 15; // 🔥 Ahora empieza en 15s
  canStopRecording = false; // 🔥 Solo se habilita cuando faltan 5 segundos

  stream: MediaStream | null = null;
  mediaRecorder: MediaRecorder | null = null;
  recordingTimer: any;

  constructor(
    private platform: Platform,
    private changeDetector: ChangeDetectorRef,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await this.initCamera();
  }

  async initCamera() {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: true
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.nativeElement.srcObject = this.stream;
      this.videoElement.nativeElement.muted = true;
    } catch (error) {
      console.error('Error al inicializar la cámara:', error);
    }
  }

  async recordVideo() {
    // 🔥 Iniciar cuenta regresiva antes de grabar
    this.countdown = 3;
    const countdownInterval = setInterval(() => {
      this.countdown--;
      this.changeDetector.detectChanges();

      if (this.countdown <= 0) {
        clearInterval(countdownInterval);
        this.startVideoRecord(); // Iniciar grabación después de la cuenta regresiva
      }
    }, 1000);
  }

  async startVideoRecord() {
    if (!this.stream || this.isRecording) return;

    this.isRecording = true;
    this.timeRemaining = 15; // 🔥 Reiniciar cuenta regresiva a 15 segundos
    this.canStopRecording = false; // 🔥 Deshabilitar botón de detener al inicio
    this.changeDetector.detectChanges();

    
    const options = { mimeType: 'video/webm;codecs=vp8,opus', videoBitsPerSecond: 400000 };
    this.mediaRecorder = new MediaRecorder(this.stream, options);
    let chunks: Blob[] = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    this.mediaRecorder.onstop = async () => {
      const videoBlob = new Blob(chunks, { type: 'video/webm' });
      const videoFile = this.blobToFile(videoBlob, 'video-selfie.webm');
      console.log(videoFile);
    };

    this.mediaRecorder.start(100);

    // 🔥 Iniciar cuenta regresiva para detener
    this.recordingTimer = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;

        // 🔥 Habilitar botón de detener cuando falten 5 segundos
        if (this.timeRemaining === 5) {
          this.canStopRecording = true;
        }

        this.changeDetector.detectChanges();
      } else {
        clearInterval(this.recordingTimer);
        this.stopRecording();
      }
    }, 1000);
  }

  async stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.canStopRecording = false;
      clearInterval(this.recordingTimer);
      this.changeDetector.detectChanges();
    }
  }

  blobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, { type: blob.type });
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    // if (this.scanTimeout) clearTimeout(this.scanTimeout);
  }


  async closeOverlayVideo() {
    this.stopCamera();
    this.modalController.dismiss();
  }

}
