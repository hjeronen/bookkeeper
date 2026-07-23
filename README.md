# Bookkeeper

App for personal bookkeeping.

## Running the app

The frontend requires Node.js 20.19 or newer.

```sh
cd frontend
npm ci
npm run dev
```

## Frontend views

- `/` — overview of the current year and yearly history
- `/years/:year` — income, expenses, and balance for each month
- `/years/:year/months/:month` — expandable daily transaction groups

The shared application frame and routes live in `frontend/src/app/`.
Bookkeeping views are organized by feature in `frontend/src/views/`.
