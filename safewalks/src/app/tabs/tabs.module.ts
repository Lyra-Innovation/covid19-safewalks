import { NgModule } from '@angular/core';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    SharedModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
