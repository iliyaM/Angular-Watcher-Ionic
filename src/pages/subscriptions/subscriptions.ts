import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { AuthProvider } from '../../providers/auth/auth';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-subscriptions',
  templateUrl: 'subscriptions.html'
})
export class SubscriptionsPage {
mySubscriptions;

  constructor(public navCtrl: NavController, private db:DbProvider, public auth: AuthProvider) { }

  ngOnInit() {
    this.mySubscriptions = this.db.getMySubscriptions();
  }
  
  navigateToProfilePage() {
    this.navCtrl.push(ProfilePage);
  }

}
