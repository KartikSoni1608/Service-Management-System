using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Capstone.DAL.Models
{
    public class User
    {
        [Key]
        [StringLength(20)]
        public string UserName { get; set; }

        [Required]
        [StringLength(20)]
        public string Password { get; set; }
        
        [Required]
        public DateTime CreatedOn { get; set; }
        
        [Required]
        public int RoleId   { get; set; }
        
        [ForeignKey("RoleId")]
        public Role Role { get; set; }
    }
}
