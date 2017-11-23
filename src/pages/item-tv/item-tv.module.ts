import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemTvPage } from './item-tv';

@NgModule({
  declarations: [
    ItemTvPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemTvPage),
  ],
})
export class ItemTvPageModule {}
