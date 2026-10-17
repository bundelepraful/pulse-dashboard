# Pulse – Operations Dashboard

Pulse is a shipment management dashboard I built using Next.js and TypeScript. The main goal of this project is to make it easier to view shipment information, track delivery statuses, and manage shipments from one place.

## What can you do with Pulse?

- View and search shipment records.
- Filter shipments by status, region, and date range.
- Sort shipment data using different columns.
- Browse through 1,200 mock shipment records using pagination.
- Open a shipment to view its details and simulated carrier history.
- Update shipment statuses and see changes reflected in the UI.
- View delayed shipments in the exceptions section.
- Handle loading states and API errors.
- Use the dashboard on desktop and smaller screens.

The project also simulates API delays and occasional failures to test how the dashboard behaves when a request takes longer than expected or doesn't succeed.

## Built With

- Next.js and React
- TypeScript
- Tailwind CSS
- Next.js API Route Handlers
- Mock shipment data

## Getting Started

To run the project on your computer, follow these steps.

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

Now open [http://localhost:3000](http://localhost:3000) in your browser.

## Useful Commands

Check the TypeScript code:

```bash
npx tsc --noEmit
```

Create a production build:

```bash
npm run build
```

Start the development server:

```bash
npm run dev
```

## API Endpoints

The project uses Next.js Route Handlers to work with shipment data.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/shipments` | Get a list of shipments |
| PATCH | `/api/shipments/[id]` | Update a shipment's status |

The shipments API supports cursor-based pagination and uses mock data for testing.

You can test the list endpoint with:

```bash
curl "http://localhost:3000/api/shipments?cursor=0"
```

## Project Structure

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
├── page.tsx
├── layout.tsx
└── globals.css
```

## Testing

During development, I checked the project by running the TypeScript check and production build. I also tested the dashboard's search, filters, sorting, pagination, shipment status updates, detail page, and responsive layout.

The production build completed successfully, and the TypeScript check reported no errors.

## GitHub Repository

You can find the source code here:

[Pulse Dashboard on GitHub](https://github.com/bundelepraful/pulse-dashboard)

## Note

This project currently uses mock shipment data. It is intended for demonstration and testing, rather than tracking real shipments or connecting to a live logistics system.
