# Spec: Board Management Basics

## Purpose

Define the core board management interactions beyond initial creation — including renaming, deletion with confirmation, and empty-state guidance — so users can maintain their boards confidently with clear feedback and durable local persistence.

## Requirements

### Requirement: Board rename with deterministic validation

The system SHALL allow users to rename an existing board when the new name is non-empty and SHALL reject invalid names with clear feedback.

#### Scenario: Rename board with valid name

- **WHEN** the user submits a non-empty new board name
- **THEN** the system updates the board name and reflects it in all board selection views

#### Scenario: Reject empty rename

- **WHEN** the user submits an empty board name during rename
- **THEN** the system prevents the update and displays a deterministic validation message

### Requirement: Board delete with confirmation

The system SHALL require explicit confirmation before deleting a board and SHALL remove its related columns and tasks from persisted state.

#### Scenario: Confirm board deletion

- **WHEN** the user confirms deletion of a board
- **THEN** the system deletes the board and its associated data from local persistence

#### Scenario: Cancel board deletion

- **WHEN** the user cancels deletion
- **THEN** the system keeps the board unchanged

### Requirement: Empty-state UX for zero boards

The system SHALL display a dedicated empty-state when no boards exist, including a clear call to action to create a board.

#### Scenario: No boards available

- **WHEN** the application state contains zero boards
- **THEN** the system displays an empty-state view with create-board guidance

### Requirement: Empty-state UX for empty board

The system SHALL display a clear empty-state inside a board when no tasks exist across all columns.

#### Scenario: Board with no tasks

- **WHEN** the user opens a board where all columns are empty
- **THEN** the system displays guidance to create the first task

### Requirement: Local-first persistence for board management

The system SHALL persist board rename and delete outcomes in local storage so state remains consistent after refresh or reopen.

#### Scenario: Persist rename and delete actions

- **WHEN** the user renames or deletes a board
- **THEN** the resulting state is restored correctly after page refresh or app reopen
