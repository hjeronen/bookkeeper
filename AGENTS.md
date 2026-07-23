# Project instructions

These instructions apply to the entire repository. Follow existing conventions
unless this file explicitly replaces them.

## Working principles

- Make the smallest coherent change that solves the requested problem.
- Preserve existing behavior unless the task explicitly calls for a behavior
  change.
- Do not mix unrelated refactors, formatting changes, or dependency upgrades
  into a feature or fix.
- Prefer clear, boring code over clever abstractions. Extract an abstraction
  only when it gives a concrete benefit.
- Before finishing, remove dead code, unused imports, temporary logging, and
  placeholder comments introduced by the change.

## Project structure

The frontend lives in `frontend/`. Organize code by feature first:

```text
frontend/src/
  common/             # Reusable, domain-agnostic UI building blocks
    Button/
    Input/
    Select/
    Table/
  components/         # App-wide composed components, such as navigation
  views/              # Route-level features and their private implementation
    MonthlyView/
      index.tsx
      MonthlyTable.tsx
      Summary.tsx
      helpers.ts
      types.ts
      MonthlyView.css
  hooks/              # Hooks shared across otherwise unrelated features
  services/           # API and persistence boundaries
  types/              # Truly application-wide domain types
```

- Keep feature-specific components, hooks, helpers, types, styles, fixtures,
  and tests in the feature directory where they are used.
- A route-level view should primarily compose its feature components and
  coordinate data. Move substantial rendering or logic into focused
  subcomponents and helpers in the same directory.
- Do not create a global helper, hook, or type merely because it could
  theoretically be reused.
- When backend code is added, keep its conventions and structure separate from
  the frontend rather than sharing frontend-specific modules across the
  boundary.

## Shared and common code

- Put domain-agnostic UI primitives in `frontend/src/common/`. Examples include
  buttons, form fields, selects, dialogs, and generic tables.
- Common components must be reusable through typed props and must not import
  from `views/` or contain bookkeeping-specific behavior or copy.
- Keep a component local to its feature at first. Promote it to `common/` when
  it has at least two real consumers in unrelated features, or when it is an
  intentional foundational primitive such as an input or button.
- Prefer composition and native element props over many narrowly tailored
  boolean props.
- Put app-wide composed UI, such as the header and navigation, in
  `frontend/src/components/`. These components may know about the application
  and its routes but should not own feature-specific business logic.
- Import a feature through its public entry point where practical. Do not reach
  into another feature's private helpers or subcomponents; promote genuinely
  shared code to an appropriate shared location instead.

## React and TypeScript

- Use functional React components and TypeScript.
- Define explicit props and domain types. Avoid `any`; use generics, unions, or
  `unknown` with narrowing when the value is not known yet.
- Keep state as close as possible to the component that owns it. Lift state
  only when multiple components need the same source of truth.
- Derive values during rendering when possible. Use effects only to synchronize
  with systems outside React, not to calculate values that can be derived from
  props or state.
- Keep business calculations in pure functions, separate from rendering, when
  they are non-trivial or need independent testing.
- Use stable domain identifiers as React keys; do not use array indexes when
  items can be inserted, removed, or reordered.
- Handle loading, empty, error, and success states explicitly for asynchronous
  views.
- Use `import type` for type-only imports.

## Bookkeeping and data correctness

- Treat financial correctness as a core requirement. Do not use binary
  floating-point arithmetic for persisted monetary calculations. Represent
  money in integer minor units or use an explicitly chosen decimal type at data
  boundaries.
- Do not silently mix currencies. Include currency in domain data when more
  than one currency can occur.
- Keep dates in an unambiguous serialized format at data boundaries and format
  them for users only in the presentation layer.
- Centralize repeated money and date formatting instead of formatting values
  ad hoc in individual views.
- Prefer pure, testable functions for totals, balances, grouping, and other
  financial transformations.

## Styling and accessibility

- Co-locate feature styles with the feature and common-component styles with
  the common component.
- Reuse existing design tokens and class naming patterns before adding new
  global styles. Keep global CSS limited to resets, tokens, and app-wide
  defaults.
- Use semantic HTML and native controls whenever possible.
- Every form control must have an associated label. Interactive elements must
  be keyboard accessible, and visible focus states must not be removed.
- Do not rely on color alone to convey financial state or validation feedback.

## Tests and verification

- Add or update tests for business calculations, validation, and regressions
  when a test setup exists. Test behavior and public interfaces rather than
  component implementation details.
- Until dedicated automated tests are configured, verify frontend changes from
  `frontend/` with:

```sh
npm run lint
npm run build
```

- Do not claim a command passed unless it was run successfully. If verification
  is not possible, state what was not run and why.

## Dependencies and documentation

- Prefer the platform and existing dependencies before adding a package.
- Add a dependency only when it materially reduces risk or complexity; explain
  the reason in the change summary.
- Update relevant documentation when commands, configuration, architecture, or
  user-visible behavior changes.
