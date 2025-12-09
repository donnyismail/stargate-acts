using MediatR;
using Microsoft.AspNetCore.Mvc;
using StargateAPI.Business.Commands;
using StargateAPI.Business.Queries;
using StargateAPI.Business.Services;
using System.Net;

namespace StargateAPI.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class PersonController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IProcessLogService _logService;

        public PersonController(IMediator mediator, IProcessLogService logService)
        {
            _mediator = mediator;
            _logService = logService;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetPeople()
        {
            try
            {
                var result = await _mediator.Send(new GetPeople());

                await _logService.LogSuccess("Retrieved all people", Request.Path);
                return this.GetResponse(result);
            }
            catch (Exception ex)
            {
                await _logService.LogError("Failed to retrieve people", ex, Request.Path);
                return this.GetResponse(new BaseResponse()
                {
                    Message = ex.Message,
                    Success = false,
                    ResponseCode = (int)HttpStatusCode.InternalServerError
                });
            }
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetPersonByName(string name)
        {
            try
            {
                var result = await _mediator.Send(new GetPersonByName()
                {
                    Name = name
                });

                await _logService.LogSuccess($"Retrieved person: {name}", Request.Path);
                return this.GetResponse(result);
            }
            catch (Exception ex)
            {
                await _logService.LogError($"Failed to retrieve person: {name}", ex, Request.Path);
                return this.GetResponse(new BaseResponse()
                {
                    Message = ex.Message,
                    Success = false,
                    ResponseCode = (int)HttpStatusCode.InternalServerError
                });
            }
        }

        [HttpPost("")]
        public async Task<IActionResult> CreatePerson([FromBody] string name)
        {
            try
            {
                var result = await _mediator.Send(new CreatePerson()
                {
                    Name = name
                });

                await _logService.LogSuccess($"Created person: {name}", Request.Path);
                return this.GetResponse(result);
            }
            catch (Exception ex)
            {
                await _logService.LogError($"Failed to create person: {name}", ex, Request.Path);
                return this.GetResponse(new BaseResponse()
                {
                    Message = ex.Message,
                    Success = false,
                    ResponseCode = (int)HttpStatusCode.InternalServerError
                });
            }
        }
    }
}
