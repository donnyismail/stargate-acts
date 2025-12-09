using StargateAPI.Business.Data;

namespace StargateAPI.Business.Services
{
    public interface IProcessLogService
    {
        Task LogSuccess(string message, string? requestPath = null);
        Task LogError(string message, Exception? exception = null, string? requestPath = null);
    }

    public class ProcessLogService : IProcessLogService
    {
        private readonly StargateContext _context;

        public ProcessLogService(StargateContext context)
        {
            _context = context;
        }

        public async Task LogSuccess(string message, string? requestPath = null)
        {
            var log = new ProcessLog
            {
                Timestamp = DateTime.UtcNow,
                Level = "SUCCESS",
                Message = message,
                RequestPath = requestPath
            };

            await _context.ProcessLogs.AddAsync(log);
            await _context.SaveChangesAsync();
        }

        public async Task LogError(string message, Exception? exception = null, string? requestPath = null)
        {
            var log = new ProcessLog
            {
                Timestamp = DateTime.UtcNow,
                Level = "ERROR",
                Message = message,
                Exception = exception?.Message,
                StackTrace = exception?.StackTrace,
                RequestPath = requestPath
            };

            await _context.ProcessLogs.AddAsync(log);
            await _context.SaveChangesAsync();
        }
    }
}
