# Change: App Data Persistence

## Why
Currently, the application relies on an in-memory mock store. This means all data (boards, columns, tasks) is lost whenever the user refreshes the page or closes the browser. To fulfill the MVP requirement for data persistence (FR-12, FR-13), we need a mechanism to save and restore the application state across sessions. Using `localStorage` provides a simple, "local-first" solution that fits the exploratory phase without requiring a backend infrastructure.

## What Changes
- Implement a **Persistence Adapter** that interfaces with the browser's `localStorage`.
- Update the **Store Initialization** logic to hydrate (load) state from `localStorage` on startup.
- Update **Store Actions** (create, update, delete) to persist changes to `localStorage` immediately or via a subscription mechanism.
- Handle **Serialization/Deserialization** of complex types (like `Date` objects) to ensure data integrity.
- Add basic **Error Handling** for storage quotas or access issues.
- **Out of Scope**:
    - Backend API integration.
    - Database schemas.
    - Multi-device sync.
    - Conflict resolution.

## Impact
- **Data Durability**: User data will survive page reloads.
- **Store Architecture**: The store will now have a side-effect (I/O) layer.
- **Testing**: Tests will need to mock `localStorage` or clear it between runs to ensure isolation.
