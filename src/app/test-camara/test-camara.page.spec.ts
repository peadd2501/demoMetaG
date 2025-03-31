import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestCamaraPage } from './test-camara.page';

describe('TestCamaraPage', () => {
  let component: TestCamaraPage;
  let fixture: ComponentFixture<TestCamaraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCamaraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
