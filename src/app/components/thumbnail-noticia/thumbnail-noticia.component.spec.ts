import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailNoticiaComponent } from './thumbnail-noticia.component';

describe('ThumbnailNoticiaComponent', () => {
  let component: ThumbnailNoticiaComponent;
  let fixture: ComponentFixture<ThumbnailNoticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThumbnailNoticiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThumbnailNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
