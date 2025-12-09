using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using StargateAPI.Business.Commands;
using StargateAPI.Business.Data;
using Xunit;

namespace StargateAPI.Tests.Handlers;

public class CreatePersonPreProcessorTests
{
    private StargateContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<StargateContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new StargateContext(options);
    }

    [Fact]
    public async Task Process_NewPerson_DoesNotThrow()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var preProcessor = new CreatePersonPreProcessor(context);
        var request = new CreatePerson { Name = "New Person" };

        // Act & Assert - should not throw
        await preProcessor.Process(request, CancellationToken.None);
    }

    [Fact]
    public async Task Process_DuplicatePerson_ThrowsBadHttpRequestException()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        context.People.Add(new Person { Name = "Existing Person" });
        await context.SaveChangesAsync();

        var preProcessor = new CreatePersonPreProcessor(context);
        var request = new CreatePerson { Name = "Existing Person" };

        // Act & Assert
        await Assert.ThrowsAsync<BadHttpRequestException>(() =>
            preProcessor.Process(request, CancellationToken.None));
    }
}
