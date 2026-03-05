import { Component } from '@angular/core';
import { AuthService } from '../../frontoffice/auth/auth.service';

@Component({
  selector: 'app-movement',
  standalone: false,
  templateUrl: './movement.html',
  styleUrls: ['./movement.css'],
})
export class MovementPage {
  readonly movementFeed = [
    { patient: 'Sarah Ben Ali', type: 'WALKING', progress: '3.2 km', time: '08:40' },
    { patient: 'Rami Trabelsi', type: 'PHYSIO', progress: '45 min session', time: '10:15' },
    { patient: 'Nour Hammami', type: 'BALANCE', progress: '22 mins exercise', time: '11:05' },
  ];

  constructor(public readonly authService: AuthService) {}
}
