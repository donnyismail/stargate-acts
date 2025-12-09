# AI-Assisted Angular Build

How this UI was built using elite prompting techniques.

## Quick Start

```bash
npm install
ng serve
# http://localhost:4200
```

---

## The Prompting Strategy

### Step 1: Context Loading + Clarification

Before writing any code, give AI the full context and ask it to confirm understanding:

```
I need to build an Angular frontend for this .NET API.

Here are the API endpoints:
- GET /Person - returns { people: PersonAstronaut[], success, message }
- GET /Person/{name} - returns single person
- POST /Person - body: string name
- GET /AstronautDuty/{name} - returns { person, astronautDuties[] }
- POST /AstronautDuty - body: { name, rank, dutyTitle, dutyStartDate }

Here are the data models from the backend:
[paste PersonAstronaut and AstronautDuty interfaces]

Business rules:
- Person is uniquely identified by Name
- "RETIRED" duty title means retired status
- Current duty has no end date
- Duties sorted by start date descending

Before you start coding, tell me:
1. What clarifying questions do you have?
2. What's your proposed component structure?
3. What Angular patterns will you use and why?
```

**Why this works**: AI asks smart questions, catches edge cases, proposes architecture. You correct misunderstandings BEFORE code is written.

---

### Step 2: Build with Specificity

After clarification, give precise requirements:

```
Create the Angular 18 app with these specifics:

SETUP:
- Standalone components (no NgModules)
- Angular Material for UI
- Angular Signals for state (not RxJS subjects)

ROUTING:
- / → PeopleListComponent
- /astronaut/:name → AstronautDetailComponent

PEOPLE LIST:
- Mat-table: name, rank, duty title, career start, status badge
- Search input filtering by name/rank/title (use computed signal)
- Stats bar: total | active | retired counts
- Row click → navigate to detail
- FAB → add person (prompt for name)

ASTRONAUT DETAIL:
- Profile card: name, rank, active/retired badge
- Timeline of duties (newest first)
- Current duty highlighted green
- Back button
- FAB → add duty (leave as TODO placeholder)

THEME:
- Dark background (#0a0e17)
- Cyan accent (#00f0ff)
- Neon glow effects
- Space/sci-fi aesthetic
```

---

### Step 3: Review + Iterate

After code is generated:

```
Review the code you just wrote:
1. Are there any potential issues with change detection?
2. Is the error handling complete?
3. Are signals being called correctly in templates?

Fix any issues you find.
```

---

## Prompts That Built This UI

### Prompt 1: Analysis + Questions
```
Read the API service and models. Before building components,
tell me what questions you have and propose the component structure.
```

### Prompt 2: Full Implementation
```
Build both components with:
- Signals for all state
- Computed signals for derived data
- Space theme with cyan/purple gradient accents
- Loading states and error handling
- [specific requirements as above]
```

### Prompt 3: Self-Review
```
Check for:
- Signal syntax in templates (people() not people)
- Null safety
- CORS configuration needed
- Material icons font loading
```

---

## Result: 3 Prompts vs 10+

Elite prompting = fewer iterations because:
1. **Context first** - AI understands the system
2. **Questions asked** - misunderstandings caught early
3. **Specific requirements** - less back-and-forth
4. **Self-review** - AI catches its own mistakes

---

## Structure

```
src/app/
├── components/
│   ├── people-list/        # Signals + computed for filtering
│   └── astronaut-detail/   # Timeline view
├── services/
│   └── astronaut.service.ts
└── models/
    └── astronaut.models.ts
```

---

## Live Demo Feature

`astronaut-detail.component.ts:85-88` has an incomplete Add Duty dialog.

**Demo prompt for interview**:
```
I need to add a dialog to create new astronaut duties.
The dialog should have fields for: rank, duty title, start date.
It should call POST /AstronautDuty and refresh the duty list.
Use Angular Material dialog with reactive forms.
```
