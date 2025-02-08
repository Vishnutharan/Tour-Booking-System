import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomdationComponent } from './recomdation.component';

describe('RecomdationComponent', () => {
  let component: RecomdationComponent;
  let fixture: ComponentFixture<RecomdationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecomdationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecomdationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
