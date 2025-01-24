import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChinesComponent } from './chines.component';

describe('ChinesComponent', () => {
  let component: ChinesComponent;
  let fixture: ComponentFixture<ChinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
