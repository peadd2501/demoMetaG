import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { Camera } from '@capacitor/camera';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-simple-acuerdo-video',
  templateUrl: './simple-acuerdo-video.component.html',
  styleUrls: ['./simple-acuerdo-video.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SimpleAcuerdoVideoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('progressRing') progressRing!: ElementRef<HTMLElement>;

  @Input() backFunction!: (filePath: File) => Promise<void>;
  @Output() closeRequested = new EventEmitter<void>();

  capturedVideoUrl: any;
  capVideo?: File;
  stream: MediaStream | null = null;
  private isAndroid: boolean;
  private isIOS: boolean;
  private scanTimeout: any;
  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  countdown: number = 0; // Propiedad para la cuenta regresiva

  private recordingTimer: any;
  private minRecordingTime = 3000; // 3 seconds
  private maxRecordingTime = 5000; // 5 seconds
  timeRemaining: number = this.maxRecordingTime / 1000; // Inicializar con el tiempo máximo en segundos
  canStopRecording = true;

  isLoading: boolean = true; // Variable para mostrar el loader

  private defaultBrightness: number | null = null; // Para guardar el brillo original del dispositivo

  isModalOpen: boolean = false;
  isModalVoiceOpen: boolean = false;

  //TTS
  text: string = '¿Acepta los términos y condiciones del crédito que está solicitando en Fundación Génesis Empresarial?';
  instructions: string = 'Por favor contesta "SI" o "NO" a la pregunta para completar el proceso.';

  words: string[] = [];
  instructionWords: string[] = [];
  currentIndex: number = 0;
  timePerWord: number = 380; //350
  isSpeaking: boolean = false;
  showTextAcuerdo: boolean = false;

  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private alertController: AlertController,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.isAndroid = this.platform.is('android');
    this.isIOS = this.platform.is('ios');
  }

  async ngAfterViewInit() {

    // this.isModalOpen = true;
    this.openModal();
    // this.openModalVoice();

    this.words = this.text.split(' ');
    this.instructionWords = this.instructions.split(' ');
    
    setTimeout(() => {
      this.speakText(this.instructionWords, this.instructions);
    }, 500);

      if (this.isAndroid || this.isIOS) {
        try {
          const { brightness } = await ScreenBrightness.getBrightness();
          this.defaultBrightness = brightness;
          await ScreenBrightness.setBrightness({ brightness: 1.0 });
        } catch (error) {
         console.warn('Error al obtener el brillo de la pantalla:', error); 
        }
        await this.requestPermissions();
      }
    

    await this.initCamera();
    // await this.startRecording();
    await this.waitForCameraReady();
  }

  async ngOnDestroy() {
    this.stopCamera();
    try {
      if (this.defaultBrightness !== null) {
        await ScreenBrightness.setBrightness({
          brightness: this.defaultBrightness,
        });
      }
    } catch (error) {
      console.warn('Error al restaurar el brillo original:', error);
    }

  }

    // Función para abrir la modal
    openModal() {
      this.isModalOpen = true; // Abrir la modal
    }

    openModalVoice() {
      this.isModalVoiceOpen = true;
    }

    closeModalVoice() {
      this.isModalVoiceOpen = false;
    }
  
    // Función para cerrar la modal
    closeModal() {
      this.isModalOpen = false; // Cerrar la modal
    }

  async waitForCameraReady(): Promise<void> {
    return new Promise((resolve) => {
      this.videoElement.nativeElement.onloadedmetadata = () => {
        resolve();
      };
    });
  }

  async requestPermissions() {
    if(Capacitor.getPlatform() !== 'web') {
      if (this.isAndroid || this.isIOS) {
        const permissions = await Camera.requestPermissions();
        if (permissions.camera === 'denied') {
          console.error('Permiso de cámara denegado');
          return;
        }
      }
    }
  }

  async initCamera() {
    let isCameraReady = false;

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.nativeElement.srcObject = this.stream;

      // Esperar hasta que la cámara esté lista
      this.videoElement.nativeElement.onloadedmetadata = () => {
        isCameraReady = true;
      };

      // Espera activa para asegurarte de que está lista
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (isCameraReady) {
            clearInterval(interval);
            resolve(true);
          }
        }, 100);
      });

      this.isLoading = false;

      await this.startRecording();
    } catch (error) {
      console.error('Error al inicializar la cámara:', error);
      this.isLoading = false;
    }
  }

  async startRecording() {
    if (!this.stream) return;
    const options = {
      mimeType: this.isIOS ? 'video/mp4' : 'video/webm',
      videoBitsPerSecond: 400000,
    };
    this.mediaRecorder = new MediaRecorder(this.stream, options);
    let chunks: Blob[] = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      } else {
      }
    };

    this.mediaRecorder.onstop = async () => {
      if (chunks.length === 0) {
        console.error('No se capturaron datos en la grabación.');
        return;
      }
      const fileType = this.isIOS ? 'video/mp4' : 'video/webm';
      const fileExtension = this.isIOS ? 'mp4' : 'webm';
      const videoBlob = new Blob(chunks, { type: fileType });
      const videoFile = this.blobToFile(videoBlob, `video-selfie.${fileExtension}`);
      if (this.backFunction) {
        await this.backFunction(videoFile);
      }
    };
  }

  blobToFile(blob: Blob, fileName: string): File { 
    const b: any = blob;
    b.lastModified = new Date().getTime();
    b.lastModifiedDate = new Date();
    b.name = fileName;
    //Cast to a File() type
    return <File>b;
  }

  async recordVideo() {
    // Mostrar la cuenta regresiva antes de iniciar la grabación
    this.countdown = 3;
    const countdownInterval = setInterval(async () => {
      this.countdown -= 1;
      if (this.countdown <= 0) {
        this.showTextAcuerdo = true;
        clearInterval(countdownInterval);
        await this.speakText(this.words, this.text);
        this.openModalVoice();
        this.startVideoRecord(); // Iniciar la grabación después de la cuenta regresiva
      }
      this.changeDetector.detectChanges(); // Actualizar la vista
    }, 1000);
  }

  async startVideoRecord() {
    if (this.mediaRecorder && !this.isRecording) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      this.mediaRecorder.start(100);
      this.isRecording = true;

      this.canStopRecording = false; // Deshabilitar el botón de detener inicialmente

      this.renderer.addClass(
        this.progressRing.nativeElement,
        'progress-active'
      );
      this.timeRemaining = this.maxRecordingTime / 1000; // Reiniciar el tiempo restante
      this.updateTimeRemaining(); // Iniciar la actualización del tiempo restante

      // Habilitar el botón de detener después de minRecordingTime
      setTimeout(() => {
        this.canStopRecording = true;
      }, this.minRecordingTime);

      this.recordingTimer = setTimeout(async () => {
        await this.stopRecording();
      }, this.maxRecordingTime);
    }
  }

  updateTimeRemaining() {
    const interval = 1000; // Actualizar cada segundo
    const timer = setInterval(() => {
      if (this.isRecording) {
        this.timeRemaining -= 1;
        if (this.timeRemaining <= 0) {
          clearInterval(timer);
        }
      } else {
        clearInterval(timer);
      }
      this.changeDetector.detectChanges(); // Actualizar la vista
    }, interval);
  }

  async stopRecording() {
    if (this.mediaRecorder && this.isRecording && this.canStopRecording) {
      this.closeModalVoice();      
      console.log( this.capVideo!)
      await this.backFunction(this.capVideo!);
      this.mediaRecorder.stop();
      this.isRecording = false;
    }

    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
    }

    // Detiene la animación del borde circular
    this.renderer.removeClass(
      this.progressRing.nativeElement,
      'progress-active'
    );
  }



  async closeOverlayVideo() {
    this.stopCamera();
    // Restaura el brillo original si estaba guardado
    if (this.defaultBrightness !== null) {
      await ScreenBrightness.setBrightness({
        brightness: this.defaultBrightness,
      });
    }
    this.modalController.dismiss();
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.scanTimeout) clearTimeout(this.scanTimeout);
  }


  //TTS
  async speakText(words: string[], text: string) {
    if (this.isSpeaking) {
      return; // Si ya se está hablando, no hacer nada
    }

    this.isSpeaking = true; // Establecer que el proceso está en marcha
    this.currentIndex = 0;
    this.highlightWord(this.currentIndex); // Resaltar la primera palabra
    await this.speakSentenceWithHighlights(words, text); // Hablar la oración y resaltar simultáneamente
  }

  async speakSentenceWithHighlights(words: string[], text: string) {
    // Leer todo el texto fluido

    // Resaltar las palabras mientras se lee el texto
    words.forEach((word, index) => {
      setTimeout(() => {
        this.currentIndex = index;
        this.highlightWord(this.currentIndex); // Resaltar la palabra
      }, this.timePerWord * index); // Sincroniza con el tiempo de la palabra
    });

    await TextToSpeech.speak({
      text: text,
      lang: 'es-MX',
      rate: 0.85,
      volume: 1.0,
      pitch: 1.2,
    });

    // Una vez que se termine, habilitar nuevamente el botón
    this.isSpeaking = false;
  }

  // Función para resaltar la palabra que está siendo leída
  highlightWord(index: number) {
    const wordElements = document.querySelectorAll('.subtitle-word');
    wordElements.forEach((el, idx) => {
      if (idx === index) {
        el.classList.add('highlight');  // Resalta la palabra actual
        el.classList.remove('read');  // Elimina el color de texto leído
      } else {
        el.classList.remove('highlight');
        el.classList.add('read');  // Marca como leído
      }
    });
  }
}
