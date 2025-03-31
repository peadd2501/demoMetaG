import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CamaraAcuerdoVideoComponent } from './camara-acuerdo-video.component';

describe('CamaraAcuerdoVideoComponent', () => {
  let component: CamaraAcuerdoVideoComponent;
  let fixture: ComponentFixture<CamaraAcuerdoVideoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CamaraAcuerdoVideoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CamaraAcuerdoVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
