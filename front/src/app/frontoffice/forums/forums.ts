import { Component } from '@angular/core';

@Component({
  selector: 'app-frontoffice-forums',
  standalone: false,
  templateUrl: './forums.html',
  styleUrls: ['./forums.css'],
})
export class FrontofficeForumsPage {
  readonly trendingTopics = [
    { title: 'How to reduce caregiver burnout?', comments: 34 },
    { title: 'Post-therapy routine ideas', comments: 21 },
    { title: 'Best daily memory exercises', comments: 17 },
  ];
}
