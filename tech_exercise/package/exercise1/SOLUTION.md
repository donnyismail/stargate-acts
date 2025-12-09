# Stargate ACTS - Solution

## Quick Start

### Backend API
```bash
cd api
dotnet ef database update
dotnet run
```
- **API:** http://localhost:5204
- **Swagger:** http://localhost:5204/swagger

### Frontend (Angular 18)
```bash
cd stargate-ui
npm install
ng serve
```
- **App:** http://localhost:4200

---

## What I Built

### Backend Fixes & Enhancements

| Task | Status |
|------|--------|
| Fix bugs in existing code | ✅ 6 bugs fixed |
| Enforce business rules | ✅ All 7 rules implemented |
| Add unit tests (>50% coverage) | ✅ Tests in `StargateAPI.Tests/` |
| Implement database logging | ✅ `ProcessLog` table |
| Improve defensive coding | ✅ Null checks, error handling |

### Frontend (Angular 18)

| Feature | Implementation |
|---------|----------------|
| Astronaut roster view | Material data table with search/filter |
| Astronaut detail view | Profile card + duty timeline |
| Add astronaut | Dialog with full duty assignment |
| Add new duty | Dialog with validation |
| Retire astronaut | Confirmation dialog with warnings |
| Status indicators | Active (green) / Retired (red) chips |
| Loading states | Spinners during API calls |
| Error handling | Snackbar notifications |

**Tech Stack:**
- Angular 18 with standalone components
- Angular Material UI
- Signals for reactive state management
- OnPush change detection
- RxJS for API calls

---

## Bugs Fixed

### 1. SQL Injection (CRITICAL)
**Files:** CreateAstronautDuty.cs, GetAstronautDutiesByName.cs, GetPersonByName.cs

```csharp
// BEFORE - vulnerable to: '; DROP TABLE Person; --
var query = $"SELECT * FROM [Person] WHERE '{request.Name}' = Name";

// AFTER - parameterized query
var query = "SELECT * FROM [Person] WHERE Name = @Name";
```

### 2. Wrong Handler Called
**File:** AstronautDutyController.cs:24

```csharp
// BEFORE - returns person data instead of duties
new GetPersonByName()

// AFTER
new GetAstronautDutiesByName()
```

### 3. Null Reference Exception
**File:** GetAstronautDutiesByName.cs:34

```csharp
// BEFORE - crashes if person doesn't exist
var duties = ... WHERE {person.PersonId} = PersonId

// AFTER - proper null check with 404 response
if (person == null) return NotFound();
```

### 4. Missing PreProcessor Registration
**File:** Program.cs:18

```csharp
// BEFORE - CreatePersonPreProcessor never executed
cfg.AddRequestPreProcessor<CreateAstronautDutyPreProcessor>();

// AFTER - both processors registered
cfg.AddRequestPreProcessor<CreatePersonPreProcessor>();
cfg.AddRequestPreProcessor<CreateAstronautDutyPreProcessor>();
```

### 5. Missing Error Handling
**File:** AstronautDutyController.cs:42-47

```csharp
// BEFORE - raw exceptions leaked to client

// AFTER - try-catch with consistent error responses
```

### 6. Wrong Retirement Date Calculation
**File:** CreateAstronautDuty.cs:73

```csharp
// BEFORE - violates Rule 7 (career ends day BEFORE retirement)
CareerEndDate = request.DutyStartDate.Date;

// AFTER
CareerEndDate = request.DutyStartDate.AddDays(-1).Date;
```

---

## Business Rules Enforced

| Rule | Implementation |
|------|----------------|
| 1. Person uniquely identified by Name | Duplicate check in `CreatePersonPreProcessor` |
| 2. No astronaut records until assignment | `AstronautDetail` created on first duty |
| 3. One current duty at a time | Previous duty auto-closed on new duty |
| 4. Current duty has no end date | `DutyEndDate = null` for current |
| 5. Previous duty ends day before new | `DutyEndDate = NewStart.AddDays(-1)` |
| 6. "RETIRED" = retired status | Checked in `CreateAstronautDuty` |
| 7. Career ends day before retirement | `CareerEndDate = RetireStart.AddDays(-1)` |

---

## Project Structure

```
exercise1/
├── api/                          # .NET 8 API
│   ├── Controllers/              # REST endpoints
│   ├── Business/
│   │   ├── Commands/             # Write operations (CQRS)
│   │   ├── Queries/              # Read operations (CQRS)
│   │   ├── Data/                 # EF Core context
│   │   └── Dtos/                 # Data transfer objects
│   └── Program.cs                # DI configuration
│
├── StargateAPI.Tests/            # Unit tests (xUnit)
│
└── stargate-ui/                  # Angular 18 frontend
    └── src/app/
        ├── components/
        │   ├── people-list/      # Roster table
        │   └── astronaut-detail/ # Profile + timeline
        ├── services/             # API client
        └── models/               # TypeScript interfaces
```

---

## Run Tests

```bash
cd StargateAPI.Tests
dotnet test --collect:"XPlat Code Coverage"
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/Person` | Get all people |
| GET | `/Person/{name}` | Get person by name |
| POST | `/Person` | Create new person |
| GET | `/AstronautDuty/{name}` | Get astronaut duties |
| POST | `/AstronautDuty` | Create astronaut duty |
