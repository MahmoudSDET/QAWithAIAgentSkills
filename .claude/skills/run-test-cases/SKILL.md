---
name: run-test-cases
description: Execute a previously authored set of QA test cases, record pass/fail results, and surface defects. Use when the user asks to run, execute, or verify test cases.
---

# Run Test Cases

Execute the test cases in `test-cases/` (or a path the user supplies) and produce an execution report.

## Procedure
1. Load the test case file(s).
2. For each test case:
   - Verify preconditions are met.
   - Execute steps in order (via CLI, API call, UI automation, or manual walkthrough as appropriate).
   - Compare actual vs expected result.
   - Record status: **Pass** / **Fail** / **Blocked** / **Skipped**.
   - Capture evidence (command output, screenshot path, logs).
3. For every **Fail**, draft a bug stub and suggest invoking the `create-bug-report` skill.

## Execution report format

Save as `test-runs/<YYYY-MM-DD>-<feature-slug>.md`:

```markdown
# Test Run — <feature> — <date>

**Environment:** ...
**Build / Commit:** ...
**Executed by:** ...

## Summary
- Total: N
- Passed: N
- Failed: N
- Blocked: N
- Skipped: N

## Results
| TC ID | Title | Status | Actual Result | Evidence | Bug Ref |
|-------|-------|--------|---------------|----------|---------|

## Failed Cases — Detail
### <TC-ID>
Steps reproduced, actual vs expected, logs.

## Recommendations
Next steps, retest needs, regression risk.
```

## Notes
- Do not modify the test case files during execution — only record results.
- If a test case is ambiguous, mark it **Blocked** and explain why rather than guessing.
