import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailDestaqueSmallComponent } from './thumbnail-destaque-small.component';

describe('ThumbnailDestaqueSmallComponent', () => {
  let component: ThumbnailDestaqueSmallComponent;
  let fixture: ComponentFixture<ThumbnailDestaqueSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThumbnailDestaqueSmallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThumbnailDestaqueSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
