using Microsoft.EntityFrameworkCore;
using StargateAPI.Business.Data;
using StargateAPI.Business.Queries;
using Xunit;

namespace StargateAPI.Tests.Handlers;

public class GetPeopleHandlerTests
{
    private StargateContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<StargateContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new StargateContext(options);
    }

    [Fact]
    public async Task Handle_NoPeople_ReturnsEmptyList()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var handler = new GetPeopleHandler(context);

        // Act
        var result = await handler.Handle(new GetPeople(), CancellationToken.None);

        // Assert
        Assert.Empty(result.People);
    }

    [Fact]
    public async Task Handle_WithPeople_ReturnsAllPeople()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        context.People.AddRange(
            new Person { Name = "Person 1" },
            new Person { Name = "Person 2" },
            new Person { Name = "Person 3" }
        );
        await context.SaveChangesAsync();

        var handler = new GetPeopleHandler(context);

        // Act
        var result = await handler.Handle(new GetPeople(), CancellationToken.None);

        // Assert
        Assert.Equal(3, result.People.Count);
    }

    [Fact]
    public async Task Handle_WithAstronautDetails_IncludesDetails()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var person = new Person { Name = "Astronaut" };
        context.People.Add(person);
        await context.SaveChangesAsync();

        context.AstronautDetails.Add(new AstronautDetail
        {
            PersonId = person.Id,
            CurrentRank = "Colonel",
            CurrentDutyTitle = "Commander",
            CareerStartDate = DateTime.Today
        });
        await context.SaveChangesAsync();

        var handler = new GetPeopleHandler(context);

        // Act
        var result = await handler.Handle(new GetPeople(), CancellationToken.None);

        // Assert
        Assert.Single(result.People);
        var astronaut = result.People.First();
        // PersonAstronaut is a flattened DTO - astronaut details are directly on the object
        Assert.Equal("Colonel", astronaut.CurrentRank);
    }
}
