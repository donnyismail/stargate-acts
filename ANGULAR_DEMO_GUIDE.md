# Angular Live Demo Guide (KEEP PRIVATE - DELETE BEFORE SHARING REPO)

---

## EXACT STARTUP INSTRUCTIONS

### Terminal 1: Start the API

```bash
cd /Users/donny/Github/technical-exercise/tech_exercise/package/exercise1/api

# IMPORTANT: Use dotnet 8 path (run this first in every terminal)
export DOTNET_ROOT=/opt/homebrew/Cellar/dotnet@8/8.0.122/libexec
export PATH="/opt/homebrew/opt/dotnet@8/bin:$PATH:/Users/donny/.dotnet/tools"

# Create the database (only needed once, already done)
# dotnet ef database update

# Run the API
dotnet run
```

**API will be at:** http://localhost:5204
**Swagger UI:** http://localhost:5204/swagger

**To verify it's working:**
```bash
curl http://localhost:5204/Person
```
Should return: `{"success":true,"message":"Successful","responseCode":200,"people":[]}`

### Terminal 2: Start Angular (after we create it)

```bash
cd /Users/donny/Github/technical-exercise/tech_exercise/package/exercise1/stargate-ui
npm install   # only first time
ng serve
```

**Angular will be at:** http://localhost:4200

---

## IF YOU NEED TO RESTART

**API died?**
```bash
cd /Users/donny/Github/technical-exercise/tech_exercise/package/exercise1/api
dotnet run
```

**Angular died?**
```bash
cd /Users/donny/Github/technical-exercise/tech_exercise/package/exercise1/stargate-ui
ng serve
```

---

## THE DEMO FLOW

### The Opening

Say:
> "I'd love to show you how I use AI to rapidly build UIs. I'll start a fresh Claude session and have it analyze the backend first, then build an Angular frontend. This is exactly how I'd work on a real project."

---

### PROMPT 1: Context & Analysis (THE SMART START)

```
I need to build an Angular frontend for a .NET API. Before we start coding, analyze the backend:

1. Read the API controllers in tech_exercise/package/exercise1/api/Controllers/ to understand the endpoints
2. Read the DTOs and response types in Business/Dtos/ and Business/Queries/ to understand the data shapes
3. Read the README.md to understand the business domain (Astronaut Career Tracking System)

Then give me a summary of:
- All available endpoints (method, route, request/response types)
- The data models we'll need in Angular
- Any business rules I should reflect in the UI

Don't write any code yet - just analyze and summarize.
```

**What to say while it's analyzing:**
> "I always start by having Claude understand the existing system. This ensures the frontend matches the backend contracts exactly."

---

### PROMPT 2: Project Setup

```
Create an Angular 18 project called "stargate-ui" in the tech_exercise/package/exercise1 folder with:
- Standalone components (no modules)
- Angular Material with a dark indigo-pink theme
- Routing configured
- An environment file with apiUrl pointing to http://localhost:5204

Just the scaffold - we'll add components next.
```

**What to say:**
> "I'm using standalone components - that's the modern Angular approach since version 17."

---

### PROMPT 3: Service + Models

```
Based on the API analysis, create:

1. TypeScript interfaces in src/app/models/ matching the API response types:
   - Person, PersonAstronaut, AstronautDuty, AstronautDetail
   - Include the BaseResponse wrapper type

2. An AstronautService in src/app/services/ with methods for all the endpoints:
   - getPeople() - GET /Person
   - getPersonByName(name) - GET /Person/{name}
   - getAstronautDuties(name) - GET /AstronautDuty/{name}
   - createPerson(name) - POST /Person
   - createAstronautDuty(duty) - POST /AstronautDuty

Use HttpClient with proper typing and error handling.
```

**What to say:**
> "Notice I'm asking it to match the exact types from the backend. Type safety between frontend and backend is critical."

---

### PROMPT 4: The Main View

```
Create a PeopleListComponent as the home page that:
- Fetches and displays all people in a Material data table
- Columns: Name, Current Rank, Current Duty Title, Career Start Date, Status
- Status shows a chip: "Active" (green) or "Retired" (red) based on CurrentDutyTitle === 'RETIRED'
- Add a search input that filters the table client-side
- Clicking a row navigates to /astronaut/:name
- Include a FAB button to add a new person
- Add a loading spinner while fetching

Use Material components: mat-table, mat-form-field, mat-chip, mat-fab
```

**What to say:**
> "This is a production-quality table with filtering, status indicators, and proper loading states."

---

### PROMPT 5: The Detail View

```
Create an AstronautDetailComponent for route /astronaut/:name that:
- Shows a header card with the person's current info (name, rank, title, career dates)
- If retired, show a prominent "RETIRED" badge
- Below, show their duty history as Material cards in a timeline layout
- Each card shows: Duty Title, Rank, Start Date → End Date (or "Current" if no end date)
- Sort by start date descending (newest first)
- Add a "Back to List" button
- Add an "Assign New Duty" FAB button

Make it visually polished.
```

---

### PROMPT 6: The Add Duty Dialog (If Time)

```
Create an AddDutyDialogComponent that:
- Opens from the FAB on the detail page
- Has a reactive form with fields: Rank, Duty Title, Start Date (date picker)
- All fields required with validation messages
- On submit: calls the API, shows a snackbar on success/error, closes and refreshes parent
- Pre-fills the person's name from the parent component

Use MatDialogRef and MAT_DIALOG_DATA.
```

---

## POWER MOVES TO SAY

**On analysis:**
> "Context is everything with AI. The better Claude understands the system, the better code it generates."

**On type safety:**
> "I always generate TypeScript interfaces from the backend contracts. Catches bugs at compile time."

**On components:**
> "I'm thinking about UX - loading states, error handling, visual feedback. That's what separates a prototype from production."

**On speed:**
> "This took about 15 minutes. Without AI, this would be half a day. That's the force multiplier."

---

## IF SOMETHING BREAKS

Don't panic. Say:
> "This is the real workflow - when something doesn't work, I iterate."

Then prompt:
```
That didn't work because [error]. Fix it.
```

**Debugging live is actually impressive** - shows real-world skills.

---

## THE CLOSER

> "This is exactly how I'd work day-to-day. AI handles the boilerplate. I focus on UX decisions, architecture, and making sure it works. The key is knowing how to guide it with good prompts and context."

---

## EMERGENCY BACKUP

If things go badly wrong:
> "In the interest of time, let me walk you through my approach..."

Then explain the 5-prompt flow verbally.

---

## API ENDPOINTS REFERENCE

| Method | Route | Request Body | Response |
|--------|-------|--------------|----------|
| GET | /Person | - | { people: PersonAstronaut[] } |
| GET | /Person/{name} | - | { person: PersonAstronaut } |
| POST | /Person | "name" (string) | { id: number } |
| GET | /AstronautDuty/{name} | - | { person, astronautDuties[] } |
| POST | /AstronautDuty | { Name, Rank, DutyTitle, DutyStartDate } | { id: number } |

---

## NIGHT BEFORE CHECKLIST

- [ ] API runs: `dotnet run` in api folder
- [ ] Database exists: `dotnet ef database update`
- [ ] Angular CLI works: `ng version`
- [ ] You've read this guide
- [ ] You know the 5 prompts
- [ ] You're confident - you've got this
