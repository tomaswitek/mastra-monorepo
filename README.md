# Mastra monorepo

## Problem Description
This is an example of Mastra monorepo setup. This example contains 2 agents located in the packages folder:
- weather-agent
- ragie-agent

### Questions
1. Why do I need to have `ragie` in `apps/mastra/package.json`? It should be enough to define the dependency in the ragie-agent package.
2. Would you define the mastra dependencies as peer deps in packages as it is here in this repo?
3. Is it possible to use a wildcard syntax for `transpilePackages`?
```
  bundler: {
    transpilePackages: ['@repo/*'],
  },
```

## Setup
```
pnpm i
pnpm dev
```


## Error
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'ragie' imported from /Users/tom/code/mastra-monorepo/apps/mastra/.mastra/output/index.mjs
Did you mean to import "ragie/index.js"?
```