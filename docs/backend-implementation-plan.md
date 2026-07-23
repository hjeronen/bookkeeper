# Tauri and SQLite implementation plan

Status: Planned  
Last updated: 2026-07-23

## Purpose

Package Bookkeeper as a local application for Windows and macOS using Tauri 2,
and replace the frontend's in-memory transaction fixtures with persistent
SQLite storage.

The first implementation targets desktop use. The architecture should remain
compatible with a later iOS build, but cross-device synchronization is outside
the initial scope.

## Architecture

```text
React views
    |
Application-level transaction state
    |
Typed TransactionRepository
    |
Tauri SQL plugin
    |
SQLite database in the per-user application data directory
```

Tauri is the application host and local backend boundary. The application does
not need an HTTP server, an open network port, or a separately managed database
process.

The initial implementation will load all transactions into application state.
The existing pure bookkeeping functions can then continue calculating yearly
and monthly summaries. This is appropriate for a personal bookkeeping dataset
and avoids moving presentation-specific aggregation into SQL prematurely.

All SQL access must remain behind the transaction repository. React components
must not import the Tauri SQL plugin or contain SQL statements.

References:

- [Tauri 2 documentation](https://v2.tauri.app/)
- [Tauri SQL plugin](https://v2.tauri.app/plugin/sql/)
- [Tauri distribution guide](https://v2.tauri.app/distribute/)
- [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)

## Planned project structure

```text
frontend/
  src/
    app/
      BookkeepingProvider.tsx
    hooks/
      useTransactions.ts
    services/
      database.ts
      transactionRepository.ts
      sqliteTransactionRepository.ts
      transactionMapper.ts
  src-tauri/
    capabilities/
      default.json
    migrations/
      0001_create_transactions.sql
    src/
      lib.rs
      main.rs
    Cargo.toml
    tauri.conf.json
```

Names may change during implementation if Tauri's generated structure or an
existing project convention makes another location clearer.

## Database design

The first migration will create a single transactions table:

```sql
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  direction TEXT NOT NULL
    CHECK (direction IN ('income', 'expense')),
  amount_minor INTEGER NOT NULL
    CHECK (amount_minor >= 0),
  currency TEXT NOT NULL
    CHECK (length(currency) = 3),
  category TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX transactions_by_date
  ON transactions(date DESC);
```

Design rules:

- IDs are UUIDs stored as text. They remain suitable if synchronization is
  introduced later.
- Bookkeeping dates use the unambiguous `YYYY-MM-DD` format.
- Monetary values use integer minor units; persisted calculations must not use
  binary floating-point values.
- Currency is stored on every transaction and normalized to an uppercase
  three-letter code.
- Creation and update timestamps are stored in UTC.
- Category remains text initially. A separate categories table should only be
  added when categories gain their own behavior.
- Schema changes are made through ordered, transactional migrations.

Database initialization should also enable foreign keys and set a finite busy
timeout. WAL mode is optional and should only be enabled after verifying its
behavior in desktop and mobile builds.

## Repository contract

The fixture export in `frontend/src/services/transactionRepository.ts` will be
replaced by a typed repository contract similar to:

```ts
interface TransactionRepository {
  list(): Promise<Transaction[]>
  create(input: CreateTransaction): Promise<Transaction>
  update(id: string, input: UpdateTransaction): Promise<Transaction>
  delete(id: string): Promise<void>
}
```

The SQLite implementation will:

- Reuse one database initialization promise, including under React Strict Mode.
- Use bound parameters for every value included in SQL.
- Map database column names to the TypeScript domain model in one place.
- Validate unknown database rows before returning domain objects.
- Convert database failures into errors the UI can display or retry.
- Use a SQLite transaction for multi-record operations such as imports.

## Application data flow

An application-level provider will own transaction loading and mutations
because the data is consumed by the navigation and multiple unrelated views.
It will expose explicit states:

```ts
type TransactionState =
  | { status: 'loading' }
  | { status: 'error'; error: Error; retry: () => void }
  | {
      status: 'ready'
      transactions: Transaction[]
      createTransaction: (input: CreateTransaction) => Promise<void>
      updateTransaction: (
        id: string,
        input: UpdateTransaction,
      ) => Promise<void>
      deleteTransaction: (id: string) => Promise<void>
    }
```

The home, year, month, and navigation components will read this state instead
of importing the current fixture array. Loading, empty, error, and ready states
must be distinct so database initialization does not briefly appear as an
empty ledger.

## Implementation phases

### Phase 1: Tauri application shell

Status: Planned

1. Initialize Tauri 2 against the existing Vite application.
2. Configure the application identifier, product name, development command,
   frontend build command, and packaged frontend directory.
3. Add the official SQL plugin with SQLite as its only database feature.
4. Configure the minimum required Tauri capabilities.
5. Add npm scripts for Tauri development and packaging.
6. Verify navigation in development and packaged builds. If direct route
   reloads are not reliable with `BrowserRouter`, use `HashRouter`.

Acceptance criteria:

- The existing UI opens inside a Tauri window.
- Development hot reload works.
- A packaged application launches without a Vite or Node server.
- Existing reporting behavior remains unchanged.

### Phase 2: SQLite initialization and migrations

Status: Planned

1. Add the initial schema migration.
2. Register migrations with the SQL plugin.
3. Open the database from the per-user application data directory.
4. Ensure initialization is safe to call more than once.
5. Keep development fixtures separate from production migrations; a fresh
   installation starts with an empty database.

Acceptance criteria:

- First launch creates the database and applies the migration.
- Later launches do not rerun completed migrations.
- Invalid directions, negative amounts, and malformed currencies are rejected.
- Updating the installed application does not replace user data.

### Phase 3: SQLite-backed repository

Status: Planned

1. Define repository input and output types.
2. Implement list, create, update, and delete operations.
3. Add row mapping and runtime validation.
4. Generate stable UUIDs for new transactions.
5. Add validation for dates, descriptions, directions, amounts, currencies,
   and categories.

Acceptance criteria:

- All queries use bound parameters.
- Created transactions survive an application restart.
- Updates and deletes address transactions by stable ID.
- Components do not import Tauri or SQL APIs.

### Phase 4: Asynchronous frontend integration

Status: Planned

1. Add the application-level provider and transaction hook.
2. Replace fixture imports in the home, year, month, and navigation components.
3. Add explicit loading and database-error views with retry behavior.
4. Preserve the existing pure summary and grouping functions.
5. Refresh application state safely after successful mutations.

Acceptance criteria:

- No production component imports the fixture transaction array.
- Loading is not displayed as an empty-data state.
- Existing totals match the totals calculated from the same SQLite records.
- A mutation updates every affected summary without restarting the application.

### Phase 5: Transaction management

Status: Planned

1. Add an accessible create/edit transaction form.
2. Add delete confirmation.
3. Show mutation errors without discarding entered data.
4. Prevent duplicate submissions while a mutation is running.
5. Verify keyboard, narrow-screen, and touch behavior.

Acceptance criteria:

- Users can create, edit, and delete transactions.
- Invalid values receive visible, non-color-only feedback.
- Reopening the application shows the previously saved state.

### Phase 6: Backup and restore

Status: Planned

The first backup format will be versioned JSON rather than a raw copy of a live
SQLite file. Import will validate the complete file before changing the
database and will run inside one transaction.

The UI must make conflict behavior explicit, for example:

- Replace the current ledger.
- Merge records by stable ID.

Acceptance criteria:

- An export can recreate the ledger in another installation.
- A malformed import leaves the existing database unchanged.
- Reimporting the same backup does not silently duplicate records.
- The backup contains an explicit format version.

The live SQLite database should not be placed directly in iCloud Drive,
Dropbox, OneDrive, or another file-synchronization directory.

### Phase 7: Desktop packaging

Status: Planned

1. Configure Windows NSIS or MSI output.
2. Configure the macOS application and DMG output.
3. Add application icons and product metadata.
4. Verify normal application shortcuts and launch behavior.
5. Document unsigned-build warnings and later code-signing requirements.
6. Decide and document whether uninstalling retains the per-user database.

Acceptance criteria:

- The installed application needs no separate Node, Rust, or SQLite runtime.
- Windows and macOS installations launch through normal OS application entry
  points.
- Reinstalling or upgrading retains user data.
- A packaged create, quit, reopen, edit, and delete test succeeds.

### Phase 8: iOS readiness

Status: Planned, not part of the initial desktop release

1. Keep IDs and timestamps synchronization-friendly.
2. Avoid desktop-only paths and APIs in frontend services.
3. Confirm every selected Tauri plugin supports iOS.
4. Test layouts, forms, safe areas, and touch targets on an iPhone simulator
   and a physical device.
5. Treat cross-device synchronization as a separate design and implementation
   project.

An iPhone build will have its own local SQLite database. Desktop and mobile
data will not synchronize automatically.

## Verification

Run the frontend checks after each coherent change:

```sh
cd frontend
npm run lint
npm run build
```

Run the Rust and Tauri checks once the shell exists:

```sh
cargo check --manifest-path src-tauri/Cargo.toml
npm run tauri build
```

Before a release, manually verify:

1. A fresh installation creates an empty database.
2. Income and expense transactions can be added.
3. Transactions and totals remain after quitting and reopening.
4. Editing and deleting recalculate every affected summary.
5. Export, clear, and restore recreates the ledger.
6. A malformed import does not partially change the database.
7. An older database is upgraded by migrations without losing data.
8. The packaged application works without a development server.

Commands must only be marked successful in project documentation or change
summaries after they have actually run successfully.

## Delivery sequence

The work should be delivered as three coherent increments:

1. **Persistence foundation:** Tauri shell, SQLite migration, repository,
   asynchronous reads, and removal of production fixture usage.
2. **Usable bookkeeping:** Create, edit, and delete operations plus their user
   interface.
3. **Personal distribution:** Backup and restore, platform packaging, icons,
   and installer verification.

As work progresses, update each phase status and revise this document to match
the implemented architecture. After completion, this file should be converted
from a task plan into an architecture and operations reference rather than
left as a stale proposal.
