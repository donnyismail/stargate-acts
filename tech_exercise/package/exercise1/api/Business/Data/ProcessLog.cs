using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StargateAPI.Business.Data
{
    public class ProcessLog
    {
        public int Id { get; set; }
        public DateTime Timestamp { get; set; }
        public string Level { get; set; } = string.Empty; // "INFO", "ERROR", "SUCCESS"
        public string Message { get; set; } = string.Empty;
        public string? Exception { get; set; }
        public string? StackTrace { get; set; }
        public string? RequestPath { get; set; }
    }

    public class ProcessLogConfiguration : IEntityTypeConfiguration<ProcessLog>
    {
        public void Configure(EntityTypeBuilder<ProcessLog> builder)
        {
            builder.ToTable("ProcessLog");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Timestamp).IsRequired();
            builder.Property(x => x.Level).HasMaxLength(20).IsRequired();
            builder.Property(x => x.Message).IsRequired();
        }
    }
}
