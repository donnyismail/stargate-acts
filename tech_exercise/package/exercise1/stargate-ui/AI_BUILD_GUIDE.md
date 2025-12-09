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

## Live Demo Prompts for Interview

These are the exact prompts to demonstrate AI-assisted development during the interview.
Each prompt is designed to generate a complete, production-ready dialog component in one shot.

---

### PROMPT 1: Add Person Dialog

Use this to create the "Add New Astronaut" dialog on the main roster page.

```
Create an Angular Material dialog component for adding a new astronaut to the system.

CONTEXT:
- This is for the Stargate ACTS (Astronaut Career Tracking System)
- API endpoint: POST /Person takes a JSON string name, then POST /AstronautDuty creates the first duty
- A new astronaut needs: name, initial rank, initial duty title, and start date
- Business rule: "RETIRED" cannot be used as an initial duty title

REQUIREMENTS:
1. Standalone component named AddPersonDialogComponent
2. Use Angular 18 features: Signals for state (saving, errorMessage), @if syntax
3. Reactive form with validation:
   - name: required, minLength(2)
   - rank: required
   - dutyTitle: required, custom validator to block "RETIRED" (case-insensitive)
   - dutyStartDate: required, use mat-datepicker
4. On submit: chain createPerson() then createAstronautDuty() using switchMap
5. Show spinner while saving, show error messages on failure
6. Match the space theme: dark background (#0a0e17), cyan accent (#00f0ff)

STRUCTURE:
- Two sections: "Personal Information" (name) and "Initial Assignment" (rank, duty, date)
- Section labels styled as uppercase cyan text with bottom border
- Error message box with red background and error icon
- Gradient button (cyan to purple)

Return the complete component file with template and styles inline.
```

---

### PROMPT 2: Add Duty Dialog

Use this to create the "Add New Duty" dialog on the astronaut detail page.

```
Create an Angular Material dialog component for adding a new duty to an existing astronaut.

CONTEXT:
- This is for the Stargate ACTS (Astronaut Career Tracking System)
- API endpoint: POST /AstronautDuty with { name, rank, dutyTitle, dutyStartDate }
- The astronaut's name is passed via MAT_DIALOG_DATA
- Business rule: "RETIRED" should not be entered here - there's a separate retire action

REQUIREMENTS:
1. Standalone component named AddDutyDialogComponent
2. Use Angular 18 features: Signals for state, @if syntax, OnPush change detection
3. Inject MAT_DIALOG_DATA to get { name: string }
4. Reactive form with:
   - rank: required
   - dutyTitle: required, custom validator blocking "RETIRED" with message "Use the Retire action instead"
   - dutyStartDate: required, mat-datepicker
5. On submit: call createAstronautDuty(), close with true on success
6. Show spinner during save, error message on failure
7. Space theme styling matching the app

STYLING:
- Dialog title with icon (add_task) and cyan color
- Form fields with outline appearance
- Error messages in red with error icon
- Gradient submit button (cyan to purple)
- Dark dialog background

Return the complete component file with inline template and styles.
```

---

### PROMPT 3: Retire Astronaut Dialog

Use this to create the "Retire Astronaut" confirmation dialog.

```
Create an Angular Material dialog component for retiring an astronaut from active duty.

CONTEXT:
- This is for the Stargate ACTS (Astronaut Career Tracking System)
- Retiring an astronaut means creating a duty with title "RETIRED"
- API: POST /AstronautDuty with { name, rank: currentRank, dutyTitle: "RETIRED", dutyStartDate }
- Business rules:
  - Career End Date is set to one day before retirement date (handled by API)
  - Previous duty ends the day before (handled by API)
  - Once retired, astronaut cannot have more duties added

REQUIREMENTS:
1. Standalone component named RetireDialogComponent
2. Inject MAT_DIALOG_DATA with { name: string, currentRank: string }
3. Use Signals for saving state and error message
4. Show a WARNING message explaining what retirement does:
   - Ends current duty assignment
   - Sets career end date
   - Marks as RETIRED
   - Cannot be undone
5. Single form field: retirement date (mat-datepicker, defaults to today)
6. On confirm: call createAstronautDuty with dutyTitle="RETIRED"
7. Use ORANGE/AMBER warning theme instead of cyan:
   - Title background: rgba(255, 152, 0, 0.1)
   - Warning icon and border: #ff9800
   - Confirm button: mat-raised-button color="warn"

STYLING:
- Warning box with orange border, warning icon, bullet list of consequences
- Astronaut name highlighted in cyan within the warning
- Dark dialog content background
- Orange-themed header and footer

Return the complete component file with inline template and styles.
```

---

## Demo Script for Interview

1. **Show the app running** - "Here's the Angular frontend I built"
2. **Open Claude/AI assistant** - "Let me show you how I use AI to accelerate development"
3. **Pick one prompt above** - "I need to add [feature]. Here's my prompt..."
4. **Paste the prompt** - Show the level of specificity and context
5. **Generate the code** - Let AI produce the component
6. **Integrate it** - Add imports, wire up the dialog.open() call
7. **Test it live** - Show it working in the browser

**Key talking points:**
- "I front-load context so AI understands the system"
- "I specify business rules to avoid back-and-forth"
- "I include styling requirements for consistency"
- "One detailed prompt vs 10 vague ones"
