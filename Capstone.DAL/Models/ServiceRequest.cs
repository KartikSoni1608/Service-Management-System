using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Capstone.DAL.Models
{
    public class ServiceRequest
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RequestId { get; set; }
        [Required]
        [StringLength(50)]
        public string Description { get; set; }

        [Required]
        [StringLength(100)]
        public string Details { get; set; }

        [Required]
        [StringLength(20)]
        public string RaisedBy { get; set; }

        [Required]
        public DateTime RaisedOn { get; set; }
       
        [StringLength(50)]
        public string? Justification { get; set; }

        [Required]
        public int ReqStatus { get; set; }

        [ForeignKey("ReqStatus")]
        public Status? Status { get; set; }
    }
}
