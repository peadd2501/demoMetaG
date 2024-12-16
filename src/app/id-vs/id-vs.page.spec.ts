import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdVsPage } from './id-vs.page';

describe('IdVsPage', () => {
  let component: IdVsPage;
  let fixture: ComponentFixture<IdVsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IdVsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
