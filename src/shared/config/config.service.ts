import { Injectable } from '@angular/core';

import { environment } from './environment';

export type Environment = typeof environment;

@Injectable({ providedIn: 'root' })
export class Config {
  get<K extends keyof Environment>(key: K): Environment[K] {
    return environment[key];
  }
}
