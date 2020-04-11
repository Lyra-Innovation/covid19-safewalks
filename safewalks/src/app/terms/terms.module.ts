import { NgModule } from '@angular/core';
import { TermsPageRoutingModule } from './terms-routing.module';
import { SharedModule } from '../shared.module';
import { TermsPage } from './terms.page';

@NgModule({
  imports: [
    SharedModule,
    TermsPageRoutingModule
  ],
  declarations: [TermsPage]
})
export class TermsPageModule {}
