import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'yaml';

import { Config } from '../config/config.types';

import { registerComponents } from './components/register-components';
import { registerPaths } from './paths/register-paths';
import { registerSchemas } from './schemas/register-schemas';
import { registry } from './registry';

import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

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
    servers: [{ url: config.openApiUrl }],
  });

  if (saveToDisk) {
    const docsDir = join(process.cwd(), 'docs');
    if (!existsSync(docsDir)) mkdirSync(docsDir, { recursive: true });
    writeFileSync(
      join(docsDir, 'openapi.yaml'),
      yaml.stringify(document),
      'utf-8',
    );
  }

  return document;
}
