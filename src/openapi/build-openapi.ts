import { registry } from './registry';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import * as yaml from 'yaml';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

import { Config } from '../config/config.types';

import { registerSchemas } from './schemas/register-schemas';
import { registerPaths } from './paths/register-paths';
import { registerComponents } from './components/register-components';

export function buildOpenApi(config: Config, saveToDisk = true) {
  registerSchemas();
  registerPaths();
  registerComponents();

  const generator = new OpenApiGeneratorV3(registry.definitions);
  const document = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'test-task-blog-nestjs-postgres API',
      description: 'Documentation for endpoints ',
      version: '1.0.0',
    },
    servers: [{ url: `http://${config.openApiHost}:${config.serverPort}` }]
  });

  if (saveToDisk) {
    const docsDir = join(process.cwd(), 'docs');
    if (!existsSync(docsDir)) mkdirSync(docsDir, { recursive: true });
    writeFileSync(join(docsDir, 'openapi.yaml'), yaml.stringify(document), 'utf-8');
  }

  return document;
}
