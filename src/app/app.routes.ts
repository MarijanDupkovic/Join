import { AuthguardService } from './services/authguard.service';
import { UserActivationComponent } from './components/Authentication/user-activation/user-activation.component';
import { Routes } from '@angular/router';
import { SignInComponent } from './components/Authentication/sign-in/sign-in.component';
import { SignUpComponent } from './components/Authentication/sign-up/sign-up.component';
import { BoardComponent } from './components/board/board/board.component';
import { SummaryComponent } from './components/board/summary/summary.component';
import { KbBoardComponent } from './components/board/kb-board/kb-board.component';
import { AddTaskComponent } from './components/board/add-task/add-task.component';
import { ContactsComponent } from './components/board/contacts/contacts.component';
import { LegalnoticeComponent } from './components/legalnotice/legalnotice.component';
import { PrivacypolicyComponent } from './components/privacypolicy/privacypolicy.component';
import { PostLegalnoticeComponent } from './components/board/post-legalnotice/post-legalnotice.component';
import { PostPrivacypolicyComponent } from './components/board/post-privacypolicy/post-privacypolicy.component';

export const routes: Routes = [
  { path: 'login', component:SignInComponent, pathMatch: 'full'},
  { path: 'signup', component:SignUpComponent, pathMatch: 'full'},
  { path: 'legalnotice', component:LegalnoticeComponent, pathMatch: 'full'},
  { path: 'privacypolicy', component:PrivacypolicyComponent, pathMatch: 'full'},
  { path: 'activate/:email', component:UserActivationComponent, pathMatch: 'full'},

  {path:'board',component:BoardComponent, canActivate: [AuthguardService],
  children: [
    { path: 'summary', component:SummaryComponent, pathMatch: 'full'},
    { path: 'board', component:KbBoardComponent, pathMatch: 'full'},
    { path: 'addTask', component:AddTaskComponent, pathMatch: 'full'},
    { path: 'contacts', component:ContactsComponent, pathMatch: 'full'},
    { path: 'legalnotice', component:PostLegalnoticeComponent, pathMatch: 'full'},
    { path: 'privacypolicy', component:PostPrivacypolicyComponent, pathMatch: 'full'},

  ]},
  { path: '', redirectTo: 'login', pathMatch: 'full'}


];
