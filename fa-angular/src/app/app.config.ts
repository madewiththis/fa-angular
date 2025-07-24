import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FeatureFlagService } from './services/feature-flag.service';

import { routes } from './app.routes';

// Initialize Feature Flag Service on app startup
function initializeFeatureFlags(featureFlagService: FeatureFlagService) {
  return () => {
    console.log('🏁 Feature Flag Service initialized at app startup');
    // Removed excessive logging for performance
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFeatureFlags,
      deps: [FeatureFlagService],
      multi: true
    }
  ]
};
