# Spec: Engineering Governance Rules

## Purpose

Defines the engineering governance framework for the project, including the AGENTS.md document, coding principles, TDD workflow, test structure conventions, and compliance review requirements.

## Requirements

### Requirement: AGENTS.md governance document

The system SHALL define an `AGENTS.md` document as the project governance source for engineering implementation rules.

#### Scenario: Governance document availability

- **WHEN** contributors begin implementation work
- **THEN** `AGENTS.md` is available and discoverable as the baseline rules reference

### Requirement: Concise AGENTS.md focused on non-obvious guidance

The system SHALL keep `AGENTS.md` concise and focused on non-obvious project-specific guidance that an agent cannot safely infer.

#### Scenario: Non-obvious guidance coverage

- **WHEN** `AGENTS.md` is authored or updated
- **THEN** it prioritizes non-obvious constraints such as known code smells, legacy exceptions, and library-specific conventions

#### Scenario: Conciseness enforcement

- **WHEN** governance rules are reviewed
- **THEN** `AGENTS.md` avoids long generic best-practice explanations already covered by standard tool defaults

### Requirement: Engineering principles enforcement

The system SHALL mandate SOLID, YAGNI, POLA, and KISS as baseline principles for code and architecture decisions.

#### Scenario: Principle-guided decisions

- **WHEN** implementation alternatives are evaluated
- **THEN** chosen approaches align with SOLID, YAGNI, POLA, and KISS guidelines

### Requirement: TDD-first implementation workflow

The system SHALL require TDD workflow for each feature implementation cycle.

#### Scenario: Feature development cycle

- **WHEN** a new feature is implemented
- **THEN** tests are authored before production code and drive implementation completion

### Requirement: AAA test scenario structure

The system SHALL require every test scenario to follow the Arrange-Act-Assert pattern.

#### Scenario: Test scenario format compliance

- **WHEN** a test scenario is created for a requirement
- **THEN** it is structured explicitly using Arrange, Act, and Assert phases

### Requirement: Governance compliance checks during implementation

The system SHALL require implementation reviews to verify AGENTS.md compliance, including code smell avoidance and adherence to non-obvious conventions.

#### Scenario: Governance compliance review

- **WHEN** a feature task is marked complete
- **THEN** the review includes explicit checks against AGENTS.md rules and documented exceptions
