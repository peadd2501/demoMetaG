import { Component, OnInit } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-text-to-spech',
  templateUrl: './text-to-spech.page.html',
  styleUrls: ['./text-to-spech.page.scss'],
})
export class TextToSpechPage implements OnInit {
  text: string = '¿Acepta los términos y condiciones del crédito que está solicitando en Fundación Génesis Empresarial?';
  words: string[] = [];
  currentIndex: number = 0;
  timePerWord: number = 350; // Tiempo por palabra en milisegundos
  isSpeaking: boolean = false; // Variable para controlar el estado de la lectura

  constructor() {}

  ngOnInit() {
    // Dividir el texto en palabras
    this.words = this.text.split(' ');
  }

  async speakText() {
    if (this.isSpeaking) {
      return; // Si ya se está hablando, no hacer nada
    }

    this.isSpeaking = true; // Establecer que el proceso está en marcha
    this.currentIndex = 0;
    this.highlightWord(this.currentIndex); // Resaltar la primera palabra
    await this.speakSentenceWithHighlights(); // Hablar la oración y resaltar simultáneamente
  }

  async speakSentenceWithHighlights() {
    // Leer todo el texto fluido

    // Resaltar las palabras mientras se lee el texto
    this.words.forEach((word, index) => {
      setTimeout(() => {
        this.currentIndex = index;
        this.highlightWord(this.currentIndex); // Resaltar la palabra
      }, this.timePerWord * index); // Sincroniza con el tiempo de la palabra
    });

    await TextToSpeech.speak({
      text: this.text,
      lang: 'es-MX',
      rate: 0.95,
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
