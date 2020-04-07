import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TripitemComponent } from './tripitem.component';

describe('TripitemComponent', () => {
  let component: TripitemComponent;
  let fixture: ComponentFixture<TripitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripitemComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TripitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
