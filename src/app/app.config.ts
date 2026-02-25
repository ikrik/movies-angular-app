import { ViewportScroller } from "@angular/common";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withInMemoryScrolling } from "@angular/router";
import { authInterceptor } from "@shared/api/auth.interceptor";
import { ContentViewportScroller } from "@shared/lib/router/content-viewport-scroller";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    {
      provide: ViewportScroller,
      useClass: ContentViewportScroller,
    },
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: "enabled",
        anchorScrolling: "enabled",
      }),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
