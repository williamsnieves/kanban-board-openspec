# Design: App Data Persistence

## Architecture

### Persistence Adapter Pattern
- **Interface**: Define a simple `PersistenceAdapter` interface:
    - `save(state: AppState): void`
    - `load(): AppState | null`
    - `clear(): void`
- **Implementation**: Create a `LocalStorageAdapter` that implements this interface, using `window.localStorage`.
    - Key: `flowboard-state-v1` (versioning allows for future migrations).
    - Serialization: `JSON.stringify` with a replacer for Dates? Or rely on ISO strings.
    - Deserialization: `JSON.parse` with a reviver to restore Dates if needed.

### Store Integration (Zustand Middleware?)
- Since we are likely using Zustand (as per PRD suggestion), we can leverage its built-in `persist` middleware.
- **Configuration**:
    - `name`: 'flowboard-storage' (unique name)
    - `storage`: `createJSONStorage(() => localStorage)` (default, but explicit is good)
    - `partialize`: Ideally persist only necessary state (boards, columns, tasks), excluding UI transient state (modals, drag status).

### Data Model Impact
- **Dates**: Ensure `createdAt` and `updatedAt` are consistently handled. If stored as ISO strings, the store/components must either work with strings or convert them back to Date objects on load. *Decision: Store as ISO strings, convert to Date objects in the store/selector layer or component layer if strictly needed, but ISO strings are often sufficient for display.*

## Error Handling Strategy
- Wrap `localStorage` access in `try-catch` blocks within the adapter or middleware configuration (Zustand handles some of this).
- If `quotaExceededError` occurs, log a warning to the console. For MVP, a user-facing toast might be overkill but good to have if easy.

## Constraints & Trade-offs
- **Synchronous Blocking**: `localStorage` is synchronous. Large datasets could block the main thread. For an MVP with < 100 tasks, this is negligible.
- **Security**: Data is accessible via dev tools. No sensitive info should be stored (not an issue for this MVP).
- **No Conflict Resolution**: Last write wins. Opening multiple tabs might overwrite state race-conditions. Acceptable for MVP single-user scope.
