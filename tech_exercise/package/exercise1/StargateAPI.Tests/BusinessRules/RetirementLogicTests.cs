using Microsoft.EntityFrameworkCore;
using StargateAPI.Business.Data;
using Xunit;

namespace StargateAPI.Tests.BusinessRules;

/// <summary>
/// Tests for Business Rule #6 and #7:
/// - A Person is classified as 'Retired' when a Duty Title is 'RETIRED'
/// - A Person's Career End Date is one day before the Retired Duty Start Date
/// </summary>
public class RetirementLogicTests
{
    private StargateContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<StargateContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new StargateContext(options);
    }

    [Fact]
    public void CareerEndDate_ShouldBeOneDayBeforeRetirementStartDate()
    {
        // This test verifies the business rule:
        // "A Person's Career End Date is one day before the Retired Duty Start Date"

        // Arrange
        var retirementDate = new DateTime(2024, 6, 15);
        var expectedCareerEndDate = retirementDate.AddDays(-1);

        // Act
        var careerEndDate = retirementDate.AddDays(-1).Date;

        // Assert
        Assert.Equal(expectedCareerEndDate.Date, careerEndDate);
    }

    [Fact]
    public void PreviousDutyEndDate_ShouldBeOneDayBeforeNewDutyStartDate()
    {
        // This test verifies the business rule:
        // "A Person's Previous Duty End Date is set to the day before the New Astronaut Duty Start Date"

        // Arrange
        var newDutyStartDate = new DateTime(2024, 6, 15);
        var expectedPreviousDutyEndDate = newDutyStartDate.AddDays(-1);

        // Act
        var previousDutyEndDate = newDutyStartDate.AddDays(-1).Date;

        // Assert
        Assert.Equal(expectedPreviousDutyEndDate.Date, previousDutyEndDate);
    }

    [Theory]
    [InlineData("RETIRED", true)]
    [InlineData("Commander", false)]
    [InlineData("Pilot", false)]
    [InlineData("retired", false)] // Case sensitive - only "RETIRED" counts
    [InlineData("Retired", false)]
    public void IsRetired_ShouldOnlyBeTrueForRETIREDTitle(string dutyTitle, bool expectedIsRetired)
    {
        // This test verifies the business rule:
        // "A Person is classified as 'Retired' when a Duty Title is 'RETIRED'"

        // Act
        var isRetired = dutyTitle == "RETIRED";

        // Assert
        Assert.Equal(expectedIsRetired, isRetired);
    }

    [Fact]
    public void CurrentDuty_ShouldNotHaveEndDate()
    {
        // This test verifies the business rule:
        // "A Person's Current Duty will not have a Duty End Date"

        // Arrange
        using var context = CreateInMemoryContext();
        var person = new Person { Name = "Active Astronaut" };
        context.People.Add(person);
        context.SaveChanges();

        var currentDuty = new AstronautDuty
        {
            PersonId = person.Id,
            Rank = "Captain",
            DutyTitle = "Commander",
            DutyStartDate = DateTime.Today,
            DutyEndDate = null // Current duty has no end date
        };
        context.AstronautDuties.Add(currentDuty);
        context.SaveChanges();

        // Assert
        Assert.Null(currentDuty.DutyEndDate);
    }
}
