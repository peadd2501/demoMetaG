import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextToSpechPage } from './text-to-spech.page';

describe('TextToSpechPage', () => {
  let component: TextToSpechPage;
  let fixture: ComponentFixture<TextToSpechPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TextToSpechPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
