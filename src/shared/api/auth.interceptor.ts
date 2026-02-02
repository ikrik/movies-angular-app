import type { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Config } from "@shared/config/config.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get API public token from config
  const config = inject(Config);
  const apiToken = config.get("apiToken");

  let request = req;

  // Add Authorization header if not already present
  if (!request.headers.has("Authorization") && apiToken) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${apiToken}`,
      },
    });
  }

  return next(request);
};
