import { registry } from '../registry';

export function registerRefreshTokenComponent() {
  registry.registerComponent('securitySchemes', 'refreshTokenCookie', {
    type: 'apiKey',
    in: 'cookie',
    name: 'refreshToken',
    description: 'Refresh токен в HttpOnly cookie',
  });
}
