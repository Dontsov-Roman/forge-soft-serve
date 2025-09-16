# Forge Practice for SoftServe

## About project

### Dependency:
- @forge/bridge
- @forge/kvs
- @forge/react
- @forge/resolver
- @tanstack/react-query
- octokit
- react

### Language: Typescript
### Front-end architecture: Feature-based
### Patterns used:
- Strategy for different request type for JiraService(3 strategies)
- Strategy for store and get token for GitHub(via kvs and sql)
- Chain of responsobility for webhook
- Singleton for services

## Tests:
- used jest with mocked data

### For check tests run:
```
npm test
```

## Deploy and Run

### For deploy:
```
forge deploy
```
### Then:
```
forge install
```
### For update run:
```
forge install --upgrade
```
### For active develop run tunnel:
```
forge tunnel
```