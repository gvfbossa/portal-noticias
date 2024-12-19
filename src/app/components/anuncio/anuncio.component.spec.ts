import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnuncioComponent } from './anunucio.component';

describe('AnuncioComponent', () => {
  let component: AnuncioComponent;
  let fixture: ComponentFixture<AnuncioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnuncioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnuncioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
