import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { SubscriptionsPage } from '../subscriptions/subscriptions';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SubscriptionsPage;
  tab3Root = AboutPage;
  tab4Root = ProfilePage;

logInTitle = "SignIn";
subsIcon = "icon-locked";

  constructor(private auth:AuthProvider) {
	//Configure Icon on Login
	this.auth.user.subscribe(res => {
		if(res != null) {
			this.logInTitle = 'Profile';
			this.subsIcon = 'icon-tv';
		} else {
			this.logInTitle = 'Login';
			this.subsIcon = 'icon-locked';
		}
	});
   }
}
