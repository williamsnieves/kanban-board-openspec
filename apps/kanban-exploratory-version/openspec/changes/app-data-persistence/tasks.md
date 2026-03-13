# Tasks: App Data Persistence

## Implementation Tasks

- [x] **Create Persistence Adapter**
    - Implement `LocalStorageAdapter` class/module.
    - Add `save(key, value)` method with `try-catch` for `quotaExceededError`.
    - Add `load(key)` method with `try-catch` and JSON parsing.
    - Add `clear(key)` method.

- [x] **Integrate with Store (Zustand)**
    - Add `persist` middleware to the `useBoardStore` (or equivalent).
    - Configure `name` as `'flowboard-storage'`.
    - Configure `storage` to use the `LocalStorageAdapter` (or `createJSONStorage(() => localStorage)`).
    - Configure `partialize` to persist only `boards`, `currentBoardId`, etc. (exclude transient UI state).

- [x] **Handle Date Serialization**
    - Ensure `createdAt` and `updatedAt` are stored as ISO strings.
    - Update store/selectors to handle string dates if components expect Date objects (or update components to handle strings).

- [x] **Add Error Handling**
    - Add a global error handler or toast notification for storage failures (optional but good).
    - Ensure the app doesn't crash if `localStorage` is disabled/full.

## Verification Tasks

- [x] **Verify Persistence**
    - Create a board, column, and task.
    - Reload the page.
    - Verify all data is restored correctly.

- [x] **Verify Date Handling**
    - Check that task creation dates are preserved after reload.
    - Verify sorting by date still works correctly.

- [x] **Verify Error Handling**
    - Simulate `quotaExceededError` (mock `setItem` to throw).
    - Verify app continues to function in-memory without crashing.
