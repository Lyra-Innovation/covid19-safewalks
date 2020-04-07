import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewtripPage } from './newtrip.page';

describe('NewtripPage', () => {
  let component: NewtripPage;
  let fixture: ComponentFixture<NewtripPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewtripPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewtripPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
