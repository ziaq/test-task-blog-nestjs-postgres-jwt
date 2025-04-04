import { registerAccessTokenComponent } from './access-token';
import { registerRefreshTokenComponent } from './refresh-token';

export function registerComponents() {
  registerAccessTokenComponent();
  registerRefreshTokenComponent();
}
