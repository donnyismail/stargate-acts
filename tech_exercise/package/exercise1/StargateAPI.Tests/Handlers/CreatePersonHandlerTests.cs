using Microsoft.EntityFrameworkCore;
using StargateAPI.Business.Commands;
using StargateAPI.Business.Data;
using Xunit;

namespace StargateAPI.Tests.Handlers;

public class CreatePersonHandlerTests
{
    private StargateContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<StargateContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new StargateContext(options);
    }

    [Fact]
    public async Task Handle_ValidName_CreatesPersonAndReturnsId()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var handler = new CreatePersonHandler(context);
        var request = new CreatePerson { Name = "John Doe" };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.True(result.Id > 0);
        Assert.Single(context.People);
        Assert.Equal("John Doe", context.People.First().Name);
    }

    [Fact]
    public async Task Handle_MultiplePeople_CreatesEachWithUniqueId()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var handler = new CreatePersonHandler(context);

        // Act
        var result1 = await handler.Handle(new CreatePerson { Name = "Person 1" }, CancellationToken.None);
        var result2 = await handler.Handle(new CreatePerson { Name = "Person 2" }, CancellationToken.None);

        // Assert
        Assert.NotEqual(result1.Id, result2.Id);
        Assert.Equal(2, context.People.Count());
    }
}
