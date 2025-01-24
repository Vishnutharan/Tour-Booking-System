import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalAddtoCartComponent } from './final-addto-cart.component';

describe('FinalAddtoCartComponent', () => {
  let component: FinalAddtoCartComponent;
  let fixture: ComponentFixture<FinalAddtoCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalAddtoCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalAddtoCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
