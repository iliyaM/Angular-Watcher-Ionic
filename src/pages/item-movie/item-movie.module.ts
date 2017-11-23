import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemMoviePage } from './item-movie';

@NgModule({
  declarations: [
    ItemMoviePage,
  ],
  imports: [
    IonicPageModule.forChild(ItemMoviePage),
  ],
})
export class ItemMoviePageModule {}
