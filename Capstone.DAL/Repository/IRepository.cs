using Capstone.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Capstone.DAL.Repository
{
    public interface IRepository
    {
        bool Authenticate(User user);
        List<ServiceRequest> ViewRequests();
        List<ServiceRequest> ViewRequests(string userName);
        int RaiseRequest(ServiceRequest newRequest);
        ServiceRequest GetRequestById   (int requestId);
        bool ReOpenRequest(ServiceRequest request);
        List<ServiceRequest> GetRequestBySP(string userName);
        bool CloseRequest(int requestId);
        bool DeleteRequest(int  requestId);
        User GetUser(string userName);


    }
}
