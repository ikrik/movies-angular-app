import { HttpContext, HttpContextToken } from '@angular/common/http';
import { InjectionToken } from '@angular/core';

export type SessionIdProvider = () => string | null;

export const SESSION_ID_PROVIDER = new InjectionToken<SessionIdProvider>('SESSION_ID_PROVIDER');

export const USE_SESSION_ID = new HttpContextToken<boolean>(() => false);

// This function can be used to set the context for using session ID in HTTP requests
// 
export const withSessionId = (context: HttpContext = new HttpContext()): HttpContext => {
  return context.set(USE_SESSION_ID, true);
};

export const defaultSessionIdProvider: SessionIdProvider = () => {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  return localStorage.getItem('session_id');
};
