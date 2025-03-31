import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SimpleAcuerdoVideoComponent } from './simple-acuerdo-video.component';

describe('SimpleAcuerdoVideoComponent', () => {
  let component: SimpleAcuerdoVideoComponent;
  let fixture: ComponentFixture<SimpleAcuerdoVideoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleAcuerdoVideoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleAcuerdoVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
