import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdVisionComunicationService {

  constructor() { }

    private exitResultSubject = new BehaviorSubject<boolean | null>(null);
    exitResult$ = this.exitResultSubject.asObservable();
  
    setExitResult(result: boolean) {
      this.exitResultSubject.next(result);
    }
}