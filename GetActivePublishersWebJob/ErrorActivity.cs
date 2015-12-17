using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GetActivePublishersWebJob
{
    class ErrorActivity
    {
        public Guid Id { get; set; }
        public string Company { get; set; }
        public Uri TenantURL { get; set; }
        public string InnerException { get; set; }
        public string Message { get; set; }
        public string Source { get; set; }
    }
}
