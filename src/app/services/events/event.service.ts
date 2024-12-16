import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventSubject = new ReplaySubject<any>(1);

  sendEvent(data: any) {
    this.eventSubject.next(data);
  }

  getEvent() {
    return this.eventSubject.asObservable();
  }
}
