using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Capstone.DAL.Models;
using Capstone.DAL.Repository;

namespace Capstone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ITSRPAPIController : ControllerBase
    {
        private readonly IRepository _repository;

        public ITSRPAPIController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("Authenticate")]
        public IActionResult Authenticate(string userName, string password)
        {
            var user = new User
            {
                UserName = userName,
                Password = password
            };

            var isAuthenticated = _repository.Authenticate(user);
            if (!isAuthenticated)
            {
                return NotFound();
            }

            var authenticatedUser = _repository.GetUser(userName);
            return Ok(authenticatedUser);
        }

        [HttpGet("GetAllRequest")]
        public IActionResult GetAllRequest()
        {
            var requests = _repository.ViewRequests();

            return Ok(requests ?? new List<ServiceRequest>());
        }

        [HttpGet("GetRequestByUserName")]
        public IActionResult GetRequestByUserName(string userName)
        {
            var requests = _repository.ViewRequests(userName);

            return Ok(requests ?? new List<ServiceRequest>());
        }

        [HttpPut("ReOpenRequest")]
        public IActionResult ReOpenRequest(ServiceRequest request)
        {
            // Justification is mandatory when reopening
            if (string.IsNullOrWhiteSpace(request.Justification))
            {
                return BadRequest(new
                {
                    message = "Justification is required to reopen a request."
                });
            }

            var existingRequest =
                _repository.GetRequestById(request.RequestId);

            if (existingRequest == null)
            {
                return NotFound();
            }

            var result = _repository.ReOpenRequest(request);

            if (!result)
            {
                return NotFound();
            }

            var updatedRequest =
                _repository.GetRequestById(request.RequestId);

            return Ok(updatedRequest);
        }
        [HttpPost("CreateNewServiceRequest")]
        public IActionResult CreateNewServiceRequest(
            ServiceRequest newRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var requestId = _repository.RaiseRequest(newRequest);

            return CreatedAtAction(
                nameof(GetRequestById),
                new { reqId = requestId },
                requestId);
        }
        [HttpGet("GetRequestById")]
        public ServiceRequest GetRequestById(int reqId)
        {
            return _repository.GetRequestById(reqId);
        }

        
        [HttpGet("GetUser")]
        public IActionResult GetUser(string userName)
        {
            var user = _repository.GetUser(userName);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("CloseRequest")]
        public IActionResult CloseRequest(int id)
        {
            var result = _repository.CloseRequest(id);

            if (!result)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpGet("Delete")]
        public IActionResult Delete(int id)
        {
            var result = _repository.DeleteRequest(id);

            if (!result)
            {
                return NotFound();
            }

            return Ok();
        }


    }
}
