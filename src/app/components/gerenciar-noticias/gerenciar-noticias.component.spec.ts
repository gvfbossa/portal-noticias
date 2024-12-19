import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarNoticiasComponent } from './gerenciar-noticias.component';

describe('GerenciarNoticiasComponent', () => {
  let component: GerenciarNoticiasComponent;
  let fixture: ComponentFixture<GerenciarNoticiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarNoticiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarNoticiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
