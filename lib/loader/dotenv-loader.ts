/**
 * Parts of this file come from the official config module for Nest.js
 *
 * @see https://github.com/nestjs/config/blob/master/lib/config.module.ts
 */

import * as fs from 'fs';
import { resolve } from 'path';
import set from 'lodash.set';
import { debug } from '../utils/debug.util';
import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv';

export interface DotenvLoaderOptions {
  /**
   * If set, use the separator to parse environment variables to objects.
   *
   * @example
   *
   * ```bash
   * app__port=8080
   * db__host=127.0.0.1
   * db__port=3000
   * ```
   *
   * if `separator` is set to `__`, environment variables above will be parsed as:
   *
   * ```json
   * {
   *     "app": {
   *         "port": 8080
   *     },
   *     "db": {
   *         "host": "127.0.0.1",
   *         "port": 3000
   *     }
   * }
   * ```
   */
  separator?: string;

  /**
   * If "true", environment files (`.env`) will be ignored.
   */
  ignoreEnvFile?: boolean;

  /**
   * If "true", predefined environment variables will not be validated.
   */
  ignoreEnvVars?: boolean;

  /**
   * Path to the environment file(s) to be loaded.
   */
  envFilePath?: string | string[];

  /**
   * A boolean value indicating the use of expanded variables.
   * If .env contains expanded variables, they'll only be parsed if
   * this property is set to true.
   *
   * Internally, dotenv-expand is used to expand variables.
   */
  expandVariables?: boolean;
}

const loadEnvFile = (options: DotenvLoaderOptions): Record<string, any> => {
  const envFilePaths = Array.isArray(options.envFilePath)
    ? options.envFilePath
    : [options.envFilePath || resolve(process.cwd(), '.env')];

  let config: Record<string, string> = {};
  for (const envFilePath of envFilePaths) {
    if (fs.existsSync(envFilePath)) {
      config = Object.assign(
        dotenv.parse(fs.readFileSync(envFilePath)),
        config,
      );
      if (options.expandVariables) {
        config = dotenvExpand({ parsed: config }).parsed!;
      }
    }

    Object.entries(config).forEach(([key, value]) => {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = value;
      } else {
        debug(
          `"${key}" is already defined in \`process.env\` and will not be overwritten`,
        );
      }
    });
  }
  return config;
};

/**
 * Dotenv loader loads configuration with `dotenv`.
 *
 */
export const dotenvLoader = (options: DotenvLoaderOptions = {}) => {
  return (): Record<string, any> => {
    const { ignoreEnvFile, ignoreEnvVars, separator } = options;

    let config = ignoreEnvFile ? {} : loadEnvFile(options);

    if (!ignoreEnvVars) {
      config = {
        ...config,
        ...process.env,
      };
    }

    if (typeof separator === 'string') {
      const temp = {};
      Object.entries(config).forEach(([key, value]) => {
        set(temp, key.split(separator), value);
      });
      config = temp;
    }

    return config;
  };
};
