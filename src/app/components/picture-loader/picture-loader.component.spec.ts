import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureLoaderComponent } from './picture-loader.component';

describe('PictureLoaderComponent', () => {
  let component: PictureLoaderComponent;
  let fixture: ComponentFixture<PictureLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
