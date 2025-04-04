import { registry } from '../registry';

export function registerAccessTokenComponent() {
  registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Access токен в заголовке Authorization',
  });
}
