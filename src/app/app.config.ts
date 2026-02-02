import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { authInterceptor } from "@shared/api/auth.interceptor";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
