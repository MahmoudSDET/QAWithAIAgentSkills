# Agents With Skills Guide

This document explains how the agent setup in this repository works, how skills are used, and how to make an agent generate high-quality test cases.

## 1. What "Agents With Skills" Means

In this project, an **agent** is a specialized worker with a narrow responsibility, and a **skill** is a reusable instruction playbook that the agent follows.

Think of the relationship as:

- Agent = role and decision boundaries
- Skill = step-by-step method and output format

So instead of one generic assistant doing everything, the system routes work to the right specialist.

## 2. Why This Pattern Is Useful

Using role-based agents with explicit skills gives:

- Better quality: each agent has a strict quality bar
- Better consistency: output formats are standardized
- Better safety: out-of-scope work gets routed correctly
- Better maintainability: changing behavior is mostly a skill update, not a full redesign

## 3. Where This Is Defined In This Repo

### 3.1 Agent definitions

Agents are defined in:

- `.claude/agents/automation-testing-engineer.md`
- `.claude/agents/automation-tool-installer.md`
- `.claude/agents/test-case-runner.md`
- `.claude/agents/testing-activities-creator.md`

Each file defines:

- agent name and description
- available tools
- in-scope and out-of-scope tasks
- routing rules to other agents

### 3.2 Skill definitions

Skills are defined in:

- `.claude/skills/author-automation-scripts/SKILL.md`
- `.claude/skills/install-playwright-allure/SKILL.md`
- `.claude/skills/create-test-cases/SKILL.md`
- `.claude/skills/run-test-cases/SKILL.md`
- `.claude/skills/create-bug-report/SKILL.md`

Each skill defines:

- required inputs to gather
- exact procedure
- required output structure
- quality checklist
- file save location

## 4. Roles Of Each Agent (Who Does What)

## 4.1 automation-testing-engineer

Primary role:

- Writes/updates Playwright automation code using POM + data-driven JSON

Expected outputs:

- page objects
- fixtures
- test specs
- test data files

Uses skill:

- `author-automation-scripts`

Must NOT do:

- framework installation/setup
- manual test-case authoring
- bug-report authoring

## 4.2 automation-tool-installer

Primary role:

- Installs and configures Playwright + reporting tools (for example Allure)

Expected outputs:

- dependency installation
- config wiring
- npm scripts
- smoke verification

Uses skill:

- `install-playwright-allure`

Must NOT do:

- writing test specs/page objects
- executing QA sign-off test runs

## 4.3 testing-activities-creator

Primary role:

- Authors QA artifacts: test cases and bug reports

Expected outputs:

- test case suites in markdown
- formal bug reports

Uses skills:

- `create-test-cases`
- `create-bug-report`

Must NOT do:

- executing test suites
- Playwright automation coding

## 4.4 test-case-runner

Primary role:

- Executes existing test cases and records execution outcomes

Expected outputs:

- execution report with pass/fail/blocked/skipped
- evidence links/notes
- failed-case bug stubs

Uses skill:

- `run-test-cases`

Must NOT do:

- author new test cases
- write automation framework code

## 5. Skill-to-Agent Mapping

| Skill | Owned by primary agent | Purpose |
|---|---|---|
| `author-automation-scripts` | `automation-testing-engineer` | Generate Playwright POM + data-driven automation code |
| `install-playwright-allure` | `automation-tool-installer` | Install/configure Playwright + Allure stack |
| `create-test-cases` | `testing-activities-creator` | Create structured QA test cases from requirements |
| `create-bug-report` | `testing-activities-creator` | Create reproducible, tracker-ready defect reports |
| `run-test-cases` | `test-case-runner` | Execute authored cases and publish run report |

## 6. How To Make An Agent Write Test Cases

If your goal is manual/structured QA test cases (not Playwright code), use the **testing-activities-creator** path.

## 6.1 Best prompt template

Use a prompt like this:

```text
Use testing-activities-creator.
Create test cases for: <feature/user story>.
Scope in: <what to cover>.
Scope out: <what not to cover>.
Environment: <web/API/mobile, browser/device, build>.
Acceptance criteria:
1) ...
2) ...
3) ...
Please include positive, negative, boundary, auth/permission, and error-message coverage.
Save as test-cases/<feature-slug>.md.
```

## 6.2 What you should provide for best results

- Feature objective
- Business rules
- Validation rules
- User roles and permissions
- Input constraints (min/max/format)
- Error messages (if defined)

The better the requirement detail, the better the final test cases.

## 6.3 Expected output format

The `create-test-cases` skill enforces a table with:

- ID
- Title
- Type
- Priority
- Preconditions
- Steps
- Test Data
- Expected Result

This output is saved under `test-cases/` by default.

## 7. How To Make An Agent Write Automated Test Scripts

If you need Playwright code (specs/pages/fixtures), use **automation-testing-engineer**.

Prompt template:

```text
Use automation-testing-engineer.
Automate this flow: <flow details> on <url/baseURL>.
Use POM and JSON data-driven pattern.
Create/extend pages, fixtures, data, and spec files.
Cover happy path + at least one negative and one boundary scenario.
Run `npx playwright test --list` after generation.
```

This triggers the `author-automation-scripts` behavior.

## 8. End-to-End Recommended Workflow

1. Use `automation-tool-installer` to set up toolchain (if project not ready).
2. Use `testing-activities-creator` to generate manual test cases from requirements.
3. Use `automation-testing-engineer` to convert selected cases into automation.
4. Use `test-case-runner` to execute and produce run report.
5. Use `testing-activities-creator` to finalize bug reports for failures.

## 9. Practical Prompt Examples

## 9.1 Create manual test cases

```text
Use testing-activities-creator.
Create test cases for user registration.
Include valid signup, invalid email, duplicate email, weak password, and required-field checks.
Target browser: Chrome latest.
Save to test-cases/user-registration.md.
```

## 9.2 Create Playwright automation from a flow

```text
Use automation-testing-engineer.
Automate ecommerce checkout flow for Automation Exercise.
Use POM + fixtures + JSON data.
Create positive, negative, and boundary scenarios.
```

## 9.3 Execute authored test cases

```text
Use test-case-runner.
Execute test-cases/user-registration.md.
Create execution report with evidence and status summary.
```

## 9.4 Create bug report from a failing case

```text
Use testing-activities-creator.
Create a bug report for failed case TC-REG-004 (duplicate email should show validation, but account creation proceeds).
Save under bug-reports/duplicate-email-validation.md.
```

## 10. Quality Guardrails For Better Agent Results

- Be explicit about the agent name in the prompt.
- Provide acceptance criteria and scope boundaries.
- Ask for artifact save path (`test-cases/...`, `test-runs/...`, `bug-reports/...`).
- Ask for coverage dimensions (positive, negative, boundary, permissions).
- Ask for traceability to test case IDs when reporting bugs.

## 11. Troubleshooting Agent Routing

If an agent gives partial or wrong output:

- Check whether the prompt asked the correct agent.
- Confirm your request is in that agent's scope.
- Add missing inputs (acceptance criteria, environment, constraints).
- Split large requests into sequence: create cases -> automate -> execute -> report.

## 12. Quick Decision Matrix

| You need to... | Use this agent |
|---|---|
| Install Playwright/Allure | `automation-tool-installer` |
| Design manual test cases | `testing-activities-creator` |
| Write Playwright automation code | `automation-testing-engineer` |
| Run existing test cases and collect results | `test-case-runner` |
| Write formal bug report | `testing-activities-creator` |

---

If needed, this guide can be expanded with a real "request-to-agent" command cookbook for your exact daily QA workflow.
