import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewtripPage } from './viewtrip.page';

describe('NewtripPage', () => {
  let component: ViewtripPage;
  let fixture: ComponentFixture<ViewtripPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewtripPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewtripPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
