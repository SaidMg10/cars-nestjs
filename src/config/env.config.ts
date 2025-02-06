import { AppConfiguration } from './app.config';
import { DbConfiguration } from './database.config';

export const EnvConfiguration = () => ({
  ...AppConfiguration(),
  ...DbConfiguration(),
});
