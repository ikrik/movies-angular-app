import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { Config } from '@shared/config/config.service';
import { SESSION_ID_PROVIDER, USE_SESSION_ID } from '@shared/auth/session-id';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get API public token from config
  const config = inject(Config);
  const apiToken = config.get('apiToken');

  // Get possible session ID from session-id provider
  const sessionIdProvider = inject(SESSION_ID_PROVIDER, { optional: true });
  const sessionId = sessionIdProvider?.() ?? null;

  let request = req;

  // Add Authorization header if not already present
  if (!request.headers.has('Authorization') && apiToken) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${apiToken}`
      }
    });
  }

  // Check if context token for using session id is set and if sessionId is available and add it as query param
  if (request.context.get(USE_SESSION_ID) && sessionId) {
    request = request.clone({
      params: request.params.set('session_id', sessionId)
    });
  }

  return next(request);
};
