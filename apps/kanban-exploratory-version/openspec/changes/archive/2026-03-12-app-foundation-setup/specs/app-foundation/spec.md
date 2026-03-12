## ADDED Requirements

### Requirement: Application foundation stack
The exploratory app MUST be initialized with React, TypeScript, and Vite as the base runtime and build stack.

#### Scenario: Developer installs dependencies and starts development server
- **GIVEN** a fresh checkout of the exploratory app workspace
- **WHEN** the developer installs dependencies and runs the standard dev command
- **THEN** the application starts successfully using a React + TypeScript + Vite setup

### Requirement: TDD-ready unit testing setup
The project MUST provide a unit testing setup using Vitest and Testing Library to support test-driven development.

#### Scenario: Developer runs unit tests
- **GIVEN** the app foundation setup is complete
- **WHEN** the developer runs the project test command
- **THEN** unit tests execute with Vitest and Testing Library without additional manual setup

### Requirement: Baseline code quality tooling
The project MUST include baseline linting and formatting support with ESLint and Prettier.

#### Scenario: Developer runs quality checks
- **GIVEN** source files in the exploratory app
- **WHEN** the developer runs lint and format-related commands
- **THEN** ESLint and Prettier are applied as the baseline quality tools

### Requirement: TypeScript alias strategy
The project MUST support the `@/` import alias mapped to the app source root.

#### Scenario: Import from source root using alias
- **GIVEN** a module under the app source root
- **WHEN** another module imports it using `@/` path syntax
- **THEN** the import resolves correctly in development and test contexts

### Requirement: Foundation rules document
The exploratory app MUST include an `AGENTS.md` file at app root defining implementation guardrails.

#### Scenario: Developer checks project rules before implementation
- **GIVEN** the app workspace root
- **WHEN** the developer opens `AGENTS.md`
- **THEN** the rules include:
- **AND** SOLID, POLA, YAGNI, and KISS principles
- **AND** guidance to avoid out-of-scope functionality
- **AND** guidance to avoid unrelated code modifications
- **AND** React and TypeScript best practices
- **AND** AAA pattern guidance for unit tests

### Requirement: Minimal feature scaffold
The setup MUST include one minimal example feature/module that demonstrates the agreed project structure and testing approach.

#### Scenario: Developer inspects project structure
- **GIVEN** the app foundation setup is complete
- **WHEN** the developer reviews source and test folders
- **THEN** a minimal feature/module exists as a reference implementation
- **AND** it includes at least one unit test following AAA structure

### Requirement: CI deferred from this change
Continuous integration workflow configuration MUST be excluded from this change and handled in a later spec.

#### Scenario: Scope review for app foundation setup
- **GIVEN** this change definition
- **WHEN** artifacts are reviewed
- **THEN** CI pipeline setup is explicitly documented as out of scope for this change
