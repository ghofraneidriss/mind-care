import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../frontoffice/auth/auth.service';

export const frontofficeAccessGuard: CanMatchFn = (_route, _segments: UrlSegment[]) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const firstSegmentPath = _segments[0]?.path ?? '';

  // Keep auth pages accessible even when an admin is currently logged in.
  if (firstSegmentPath === 'auth') {
    return true;
  }

  if (authService.isBackofficeRole()) {
    return router.createUrlTree(['/admin']);
  }

  return true;
};
