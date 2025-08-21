import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow, weatherAgent } from '@repo/weather-agent';
import { ragieRetrievalAgent } from '@repo/ragie-agent';

export const mastra = new Mastra({
  bundler: {
    transpilePackages: ['@repo/weather-agent', '@repo/ragie-agent'],
  },
  workflows: { weatherWorkflow },
  agents: { weatherAgent, ragieRetrievalAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ':memory:',
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
