using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Capstone.DAL
{
    public class HelpDeskDbContextFactory : 
        IDesignTimeDbContextFactory<HelpDeskDbContext>
    {
        public HelpDeskDbContext CreateDbContext(string[] args)
        {
            var options = new DbContextOptionsBuilder<HelpDeskDbContext>()
                .UseSqlite("Data Source=Database\\ServiceDeskDB.db")
                .Options;

            return new HelpDeskDbContext(options);
        }
    }
}
