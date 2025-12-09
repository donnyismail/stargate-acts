using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using StargateAPI.Business.Commands;
using StargateAPI.Business.Data;
using Xunit;

namespace StargateAPI.Tests.Handlers;

public class CreateAstronautDutyPreProcessorTests
{
    private StargateContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<StargateContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new StargateContext(options);
    }

    [Fact]
    public async Task Process_PersonDoesNotExist_ThrowsBadHttpRequestException()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var preProcessor = new CreateAstronautDutyPreProcessor(context);
        var request = new CreateAstronautDuty
        {
            Name = "Non-existent Person",
            Rank = "Captain",
            DutyTitle = "Commander",
            DutyStartDate = DateTime.Today
        };

        // Act & Assert
        await Assert.ThrowsAsync<BadHttpRequestException>(() =>
            preProcessor.Process(request, CancellationToken.None));
    }

    [Fact]
    public async Task Process_PersonExists_DoesNotThrow()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        context.People.Add(new Person { Name = "John Doe" });
        await context.SaveChangesAsync();

        var preProcessor = new CreateAstronautDutyPreProcessor(context);
        var request = new CreateAstronautDuty
        {
            Name = "John Doe",
            Rank = "Captain",
            DutyTitle = "Commander",
            DutyStartDate = DateTime.Today
        };

        // Act & Assert - should not throw
        await preProcessor.Process(request, CancellationToken.None);
    }

    [Fact]
    public async Task Process_DuplicateDuty_ThrowsBadHttpRequestException()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var person = new Person { Name = "John Doe" };
        context.People.Add(person);
        await context.SaveChangesAsync();

        var dutyDate = DateTime.Today;
        context.AstronautDuties.Add(new AstronautDuty
        {
            PersonId = person.Id,
            Rank = "Captain",
            DutyTitle = "Commander",
            DutyStartDate = dutyDate
        });
        await context.SaveChangesAsync();

        var preProcessor = new CreateAstronautDutyPreProcessor(context);
        var request = new CreateAstronautDuty
        {
            Name = "John Doe",
            Rank = "Captain",
            DutyTitle = "Commander",
            DutyStartDate = dutyDate
        };

        // Act & Assert
        await Assert.ThrowsAsync<BadHttpRequestException>(() =>
            preProcessor.Process(request, CancellationToken.None));
    }
}
