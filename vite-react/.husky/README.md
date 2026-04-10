# Pre-push hook for balneabilidade-praias-sc

## Requirements
- Node.js 18+
- Yarn

## What it does
Before pushing to the repository, this hook:
1. Runs all frontend tests with coverage (Vitest)
2. Runs all backend tests with coverage (Jest)
3. Verifies minimum 95% code coverage

## Exit codes
- 0: All tests passed with required coverage
- 1: Tests failed or coverage below threshold

## Skipping the hook
To skip the pre-push hook temporarily:
```bash
git push --no-verify
```

Note: This should only be used in exceptional circumstances.
