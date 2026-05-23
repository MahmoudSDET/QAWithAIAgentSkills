---
name: create-test-cases
description: Generate structured QA test cases from a requirement, user story, or feature description. Use when the user asks to write, design, or draft test cases.
---

# Create Test Cases

Generate a clear, executable set of QA test cases for a given feature, user story, or requirement.

## Inputs to gather
- Feature / user story / requirement under test
- In-scope vs out-of-scope behaviors
- Target environment (web, API, mobile, etc.)
- Any acceptance criteria already defined

## Output format

Produce a Markdown table of test cases. For each case include:

| ID | Title | Type | Priority | Preconditions | Steps | Test Data | Expected Result |
|----|-------|------|----------|---------------|-------|-----------|-----------------|

- **Type**: Positive / Negative / Boundary / Security / Performance / Usability
- **Priority**: P1 / P2 / P3
- **Steps**: numbered, one action per line
- **Expected Result**: observable and verifiable

## Coverage checklist
Before finishing, ensure you covered:
- Happy path
- Negative / invalid input
- Boundary values
- Permissions / auth
- Error handling and messages
- Cross-field validation
- Regression-prone areas

## Deliverable
Save the test suite as `test-cases/<feature-slug>.md` unless the user specifies another location.
