import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { SubscriptionsPage } from '../pages/subscriptions/subscriptions';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ItemTvPage } from '../pages/item-tv/item-tv';
import { ItemMoviePage } from '../pages/item-movie/item-movie';
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//Providers
import { ApiProvider } from '../providers/api/api';
import { AuthProvider } from '../providers/auth/auth';
import { DbProvider } from '../providers/db/db';

//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

//FireStore cofing file.
import { firebaseConfig } from '../interfaces/firebaseConfig';

//Chart
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    SubscriptionsPage,
    HomePage,
    TabsPage,
    ItemTvPage,
    ItemMoviePage,
    ProfilePage,
    SearchPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule,
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireModule.initializeApp(firebaseConfig),
    ReactiveFormsModule,
    FormsModule,
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    SubscriptionsPage,
    HomePage,
    TabsPage,
    ItemTvPage,
    ItemMoviePage,
    ProfilePage,
    SearchPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    AuthProvider,
    DbProvider
  ]
})
export class AppModule {}
