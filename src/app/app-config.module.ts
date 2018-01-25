import { NgModule, InjectionToken } from '@angular/core';
import { environment } from '../environments/environment';

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
	externalAuthEndpoint: string;
}

export const APP_DI_CONFIG: AppConfig = {
	externalAuthEndpoint: environment.externalAuthEndpoint,
};

@NgModule({
	providers: [{
		provide: APP_CONFIG,
		useValue: APP_DI_CONFIG,
	}]
})
export class AppConfigModule {}