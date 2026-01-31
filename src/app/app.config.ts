import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { authInterceptor } from '@shared/api/auth.interceptor';
import {
  SESSION_ID_PROVIDER,
  defaultSessionIdProvider
} from '@shared/auth/session-id';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: SESSION_ID_PROVIDER,
      useFactory: defaultSessionIdProvider
    }
  ]
};
