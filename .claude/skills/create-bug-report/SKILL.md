---
name: create-bug-report
description: Author a high-quality bug report from an observed defect, failing test, or user complaint. Use when the user wants to file, draft, or document a bug.
---

# Create Bug Report

Produce a complete, reproducible bug report ready to be filed in a tracker (Jira / GitHub / Linear).

## Required sections

```markdown
# [BUG] <concise summary>

**ID / Key:** (leave blank if unknown)
**Reporter:** <name>
**Date:** <YYYY-MM-DD>
**Severity:** Blocker | Critical | Major | Minor | Trivial
**Priority:** P1 | P2 | P3 | P4
**Environment:** OS / Browser / App version / Build #
**Module / Feature:** <area>
**Related Test Case:** <TC-ID if any>

## Description
Brief description of the defect.

## Preconditions
State required before reproducing.

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Result
What should happen.

## Actual Result
What actually happens.

## Attachments / Evidence
- Screenshots, logs, HAR files, video links

## Reproducibility
Always | Intermittent (X/Y) | Once

## Workaround
If any.

## Additional Notes
Stack traces, related tickets, suspected root cause.
```

## Quality checklist
- Title fits "<where> <what> <when>"
- Steps reproduce the issue from a clean state
- Expected vs Actual are unambiguous
- Severity reflects user impact, not just visibility
- Evidence attached when available

Save under `bug-reports/<short-slug>.md` unless otherwise specified.
