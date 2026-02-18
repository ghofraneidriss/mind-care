import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeRoutingModule } from './backoffice-routing-module';
import { Home2 } from './home2/home2';
import { ActivitiesPage } from './activities/activities';
import { CalendarPage } from './calendar/calendar';
import { ChatPage } from './chat/chat';
import { CustomersPage } from './customers/customers';
import { DealsPage } from './deals/deals';
import { EmployeePage } from './employee/employee';
import { FinancePage } from './finance/finance';
import { ProfilePage } from './profile/profile';
import { ReviewPage } from './review/review';
import { SalesPage } from './sales/sales';
import { SettingsPage } from './settings/settings';
import { TaskManagementPage } from './task-management/task-management';
import { TeamManagementPage } from './team-management/team-management';
import { UserManagementPage } from './user-management/user-management';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@NgModule({
  declarations: [
    Home2,
    ActivitiesPage,
    CalendarPage,
    ChatPage,
    CustomersPage,
    DealsPage,
    EmployeePage,
    FinancePage,
    ProfilePage,
    ReviewPage,
    SalesPage,
    SettingsPage,
    TaskManagementPage,
    TeamManagementPage,
    UserManagementPage,
    Header,
    Footer,
  ],
  imports: [CommonModule, BackofficeRoutingModule],
})
export class BackofficeModule {}
