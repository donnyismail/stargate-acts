# Backend Solution

## Quick Start

```bash
cd api
dotnet ef database update
dotnet run
# Swagger: http://localhost:5001/swagger
```

---

## Bugs Fixed

### 1. SQL Injection (CRITICAL)
**Files**: CreateAstronautDuty.cs, GetAstronautDutiesByName.cs, GetPersonByName.cs

```csharp
// BAD - attacker can inject: '; DROP TABLE Person; --
var query = $"SELECT * FROM [Person] WHERE '{request.Name}' = Name";

// GOOD - parameterized, input treated as data not code
var query = "SELECT * FROM [Person] WHERE Name = @Name";
```
**Danger**: Attacker controls SQL. Can read/delete entire database. OWASP #1 vulnerability.

---

### 2. Wrong Handler Called
**File**: AstronautDutyController.cs:24

```csharp
// BAD - endpoint says "duties" but calls wrong handler
new GetPersonByName()

// GOOD
new GetAstronautDutiesByName()
```
**Danger**: API lies. Clients expect duty data, get person data. Silent failure.

---

### 3. Null Reference Exception
**File**: GetAstronautDutiesByName.cs:34

```csharp
// BAD - crashes if person doesn't exist
var duties = ... WHERE {person.PersonId} = PersonId

// GOOD - check first, return 404
if (person == null) return NotFound();
```
**Danger**: Unhandled exception = 500 error. App crashes instead of graceful 404.

---

### 4. Missing PreProcessor Registration
**File**: Program.cs:18

```csharp
// BAD - CreatePersonPreProcessor exists but never runs
cfg.AddRequestPreProcessor<CreateAstronautDutyPreProcessor>();

// GOOD - register both
cfg.AddRequestPreProcessor<CreatePersonPreProcessor>();
cfg.AddRequestPreProcessor<CreateAstronautDutyPreProcessor>();
```
**Danger**: Validation code exists but doesn't execute. Duplicates allowed.

---

### 5. Missing Error Handling
**File**: AstronautDutyController.cs:42-47

```csharp
// BAD - no try-catch, raw exceptions leak to client
var result = await _mediator.Send(request);

// GOOD - consistent with other endpoints
try { ... } catch { return error response }
```
**Danger**: Stack traces leak to users. Security risk. No logging.

---

### 6. Wrong Retirement Date
**File**: CreateAstronautDuty.cs:73

```csharp
// BAD - violates Rule 7
CareerEndDate = request.DutyStartDate.Date;

// GOOD - career ends day BEFORE retirement
CareerEndDate = request.DutyStartDate.AddDays(-1).Date;
```
**Danger**: Business rule violation. Data integrity issue.

---

## Added

| Feature | Location |
|---------|----------|
| Unit Tests | `StargateAPI.Tests/` |
| DB Logging | `ProcessLog` table via `ProcessLogService` |
| CORS | `Program.cs` - allows Angular frontend |

---

## Architecture

```
Controller --> MediatR --> PreProcessor --> Handler --> Database
                              (validates)    (executes)
```

- **CQRS**: Commands/ for writes, Queries/ for reads
- **MediatR**: Decouples controllers from business logic
- **Dapper + EF Core**: Mixed ORM usage

---

## Key Files

| What | Where |
|------|-------|
| Duty creation | `api/Business/Commands/CreateAstronautDuty.cs` |
| SQL queries | `api/Business/Queries/*.cs` |
| DI setup | `api/Program.cs` |
| DB context | `api/Business/Data/StargateContext.cs` |

---

## Run Tests

```bash
cd StargateAPI.Tests
dotnet test
```
