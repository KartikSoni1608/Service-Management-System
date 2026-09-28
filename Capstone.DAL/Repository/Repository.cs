using Capstone.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Capstone.DAL.Repository
{
    public class Repository : IRepository
    {

        private readonly HelpDeskDbContext _context;

        public Repository(HelpDeskDbContext context)
        {
            _context = context;
        }
        public bool Authenticate(User user)
        {
            var existingUser = _context.Users
                .Include(u => u.Role)
                .FirstOrDefault(u=> 
                u.UserName == user.UserName && 
                u.Password == user.Password);
            return existingUser != null;
        }

        public bool CloseRequest(int requestId)
        {
            var request = _context.ServiceRequests
        .FirstOrDefault(r => r.RequestId == requestId);

            if (request == null)
                return false;

            request.ReqStatus = 2;

            _context.SaveChanges();

            return true;
        }

        public bool DeleteRequest(int requestId)
        {
            var request = _context.ServiceRequests
         .FirstOrDefault(r => r.RequestId == requestId);

            if (request == null)
                return false;

            _context.ServiceRequests.Remove(request);
            _context.SaveChanges();

            return true;
        }

        public ServiceRequest GetRequestById(int requestId)
        {
            return _context.ServiceRequests
        .Include(r => r.Status)
        .FirstOrDefault(r => r.RequestId == requestId);
        }

        public List<ServiceRequest> GetRequestBySP(string userName)
        {
            return _context.ServiceRequests
        .Where(r => r.RaisedBy == userName)
        .ToList();
        }

        public User GetUser(string userName)
        {
            return _context.Users
        .Include(u => u.Role)
        .FirstOrDefault(u => u.UserName == userName);
        }

        public int RaiseRequest(ServiceRequest newRequest)
        {
            newRequest.Status = null;
            newRequest.RaisedOn = DateTime.Now;

            _context.ServiceRequests.Add(newRequest);
            _context.SaveChanges();

            return newRequest.RequestId;
        }

        public bool ReOpenRequest(ServiceRequest request)
        {
            var existingRequest = _context.ServiceRequests
                .FirstOrDefault(r => r.RequestId == request.RequestId);

            if (existingRequest == null)
                return false;

            existingRequest.Justification = request.Justification;

            // 1 = Open
            existingRequest.ReqStatus = 1;

            _context.SaveChanges();

            return true;
        }

        public List<ServiceRequest> ViewRequests()
        {
            return _context.ServiceRequests
        .Include(r => r.Status)
        .ToList();
        }

        public List<ServiceRequest> ViewRequests(string userName)
        {
            return _context.ServiceRequests
        .Include(r => r.Status)
        .Where(r => r.RaisedBy == userName)
        .ToList();
        }
    }
}
