import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryAddtocartComponent } from './country-addtocart.component';

describe('CountryAddtocartComponent', () => {
  let component: CountryAddtocartComponent;
  let fixture: ComponentFixture<CountryAddtocartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryAddtocartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryAddtocartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
