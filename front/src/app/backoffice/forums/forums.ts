import { Component } from '@angular/core';
import { AuthService } from '../../frontoffice/auth/auth.service';

@Component({
  selector: 'app-forums',
  standalone: false,
  templateUrl: './forums.html',
  styleUrls: ['./forums.css'],
})
export class ForumsPage {
  readonly moderationQueue = [
    { author: 'Emma Smith', reason: 'Spam links', createdAt: '2h ago', severity: 'HIGH' },
    { author: 'Youssef Ali', reason: 'Off-topic content', createdAt: '5h ago', severity: 'MEDIUM' },
    { author: 'Lina Trabelsi', reason: 'Duplicate thread', createdAt: '1d ago', severity: 'LOW' },
  ];

  readonly latestTopics = [
    { title: 'Managing anxiety at night', category: 'Mental Health', replies: 24 },
    { title: 'Post-surgery recovery checklist', category: 'Rehabilitation', replies: 11 },
    { title: 'Nutrition tips for caregivers', category: 'Caregiving', replies: 18 },
  ];

  constructor(public readonly authService: AuthService) {}
}
