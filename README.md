
# Pulse — Operations Dashboard

Pulse is a shipment operations dashboard built with Next.js, React, and TypeScript. It helps users monitor shipment statuses, search and filter records, inspect shipment details, and handle delivery exceptions.

The project uses mock data and simulated API behavior to demonstrate server rendering, pagination, asynchronous loading, error handling, and optimistic UI updates.

## Features

### Shipment Dashboard
- Displays 1,200 mock shipment records.
- Renders the initial shipment page on the server.
- Supports searching by shipment ID and destination.
- Filters shipments by status, region, and date range.
- Sorts by shipment ID, destination, and status.
- Provides cursor-based pagination with 20 records per page.
- Reflects filter and sort selections in URL query parameters.

### Shipment Details
- Provides a dedicated detail page for each shipment.
- Uses Next.js App Router and React Server Components.
- Streams the carrier-history section using React Suspense.
- Displays a loading fallback while carrier history is prepared.
- Handles invalid shipment IDs.

### Exception Queue
- Lists delayed shipments on the current page.
- **Mark Resolved:** removes a resolved exception from the active queue.
- **Escalate:** marks an exception as escalated for further attention.
- Uses optimistic updates so the UI responds immediately.
- Rolls back changes and displays an error if an API update fails.

### Resilience and Accessibility
- Simulates API latency between 150 ms and 1,500 ms.
- Simulates approximately 3% read failures and 8% write failures.
- Displays loading and error states, with a retry option for shipment-list failures.
- Provides an empty state when no shipments match the current filters.
- Uses semantic HTML, labels for form controls, and accessible status/error announcements.
- Supports horizontal scrolling for the shipment table on smaller screens.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Frontend:** React
- **Language:** TypeScript
- **Styling:** CSS and Tailwind CSS
- **API:** Next.js Route Handlers
- **Data:** Generated in-memory mock shipment records

## Getting Started

### Prerequisites

- Node.js compatible with the installed Next.js version
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/bundelepraful/pulse-dashboard.git
cd pulse-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Verify the project

Run the TypeScript check:

```bash
npx tsc --noEmit
```

Create a production build:

```bash
npm run build
```

Both commands have completed successfully during development.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/shipments?cursor=0` | Returns a page of shipments |
| PATCH | `/api/shipments/[id]` | Updates a shipment status or exception action |

### Pagination

The shipment-list endpoint returns up to 20 records and a `nextCursor` value. The next request uses that cursor to retrieve the following page.

Example:

```bash
curl "http://localhost:3000/api/shipments?cursor=0"
```

The response contains the total number of records, the current page's data, and the next cursor.

### Updating a shipment

```bash
curl -X PATCH \
  "http://localhost:3000/api/shipments/SHP-1000" \
  -H "Content-Type: application/json" \
  -d '{"status":"Delivered"}'
```

### Resolving an exception

```bash
curl -X PATCH \
  "http://localhost:3000/api/shipments/SHP-1002" \
  -H "Content-Type: application/json" \
  -d '{"exceptionAction":"resolve"}'
```

### Escalating an exception

```bash
curl -X PATCH \
  "http://localhost:3000/api/shipments/SHP-1002" \
  -H "Content-Type: application/json" \
  -d '{"exceptionAction":"escalate"}'
```

The API intentionally simulates occasional failures. A failed write should be handled by the UI rather than treated as a successful update.

## Architecture

```text
app/
├── api/
│   └── shipments/
│       ├── data.ts
│       ├── route.ts
│       └── [id]/
│           └── route.ts
├── shipments/
│   └── [id]/
│       ├── page.tsx
│       └── loading.tsx
├── ShipmentsDashboard.tsx
├── page.tsx
├── layout.tsx
└── globals.css
```

### Rendering Strategy

**Server Components**
- `app/page.tsx` is a Server Component.
- It prepares the first 20 shipment records and passes them to the dashboard as initial props.
- The shipment detail route uses server-rendered content.

**Client Components**
- `app/ShipmentsDashboard.tsx` is a Client Component.
- It handles search, filters, sorting, pagination, status updates, exception actions, and interactive UI state.

**Streaming**
- The shipment detail page wraps the asynchronous carrier-history section in Suspense.
- A loading fallback is shown while the simulated carrier history is being prepared.

### API and Data Flow

The Route Handlers use a shared in-memory array of generated shipments. The GET endpoint returns paginated results. The PATCH endpoint updates shipment statuses and exception states.

API requests simulate latency and occasional failures to exercise loading, error, optimistic-update, and rollback behavior.

## Engineering Trade-offs

### Mock data instead of a database

An in-memory dataset keeps the assignment easy to run locally without configuring an external database. However, changes are not durable and may be lost when the development server restarts.

### Server-rendered initial page

The first 20 records are passed directly from the Server Component to the Client Component. This avoids an additional initial browser fetch and allows the first page to be rendered on the server.

One trade-off is that the initial page does not pass through the simulated GET endpoint, so its artificial latency and random read-failure behavior apply to subsequent pagination requests instead.

### Client-side filtering and sorting

Search, filters, and sorting are applied to the currently loaded page. This keeps the implementation simple, but it means the controls do not search or sort the complete 1,200-record dataset across every page.

### Optimistic updates

Status and exception actions update the interface before the API response arrives. If the request fails, the previous state is restored and an error is displayed. This improves responsiveness while making failure behavior visible.

### No persistent caching layer

The application uses generated mock data and in-memory mutation rather than a database or external service. A production implementation would need persistent storage, a defined cache invalidation strategy, and reliable synchronization between the list and detail views.

## Limitations and Future Improvements

Given more time, I would:

- Move filtering, sorting, and date-range selection to the API so they operate across all records.
- Make URL state fully navigable, including browser back and forward behavior.
- Add automated unit and integration tests for API failures, pagination, and optimistic rollback.
- Persist shipment and exception updates in a database.
- Connect the detail page to the shared shipment data source.
- Add carrier assignment, escalation notifications, and an audit history.
- Improve automated accessibility and responsive-layout testing.

## Testing

The following checks were completed during development:

- TypeScript validation with `npx tsc --noEmit`.
- Production compilation with `npm run build`.
- Dashboard search, filters, sorting, and pagination.
- Shipment detail and carrier-history loading.
- Shipment status updates and exception actions.
- Loading and error handling.

Runtime checks were performed manually. Automated test coverage has not yet been added.

## Walkthrough

**Demo video:** 

[Watch the Pulse Dashboard Walkthrough](https://drive.google.com/file/d/1OGmaSRrTMnfj9qKZnsLGL2srdRkIsP6q/view?usp=share_link)

The walkthrough should demonstrate the dashboard, filtering and pagination, shipment details, exception resolution and escalation, and the application's error handling.

## Repository

[https://github.com/bundelepraful/pulse-dashboard](https://github.com/bundelepraful/pulse-dashboard)

## Notes

This is an assignment/demo project using mock shipment data. It is not connected to a live logistics provider.
