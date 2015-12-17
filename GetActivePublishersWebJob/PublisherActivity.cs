using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GetActivePublishersWebJob
{
    class PublisherActivity
    {
        //We probably want the PartitionKey to be Company and Tenant so that if it has to split it can do so
        //at that division.
        //For the RowKey this needs to be a GUID for uniqueness
        public Guid Id { get; set; }
        public string Company { get; set; }
        public Uri TenantURL { get; set; }
        public string Author { get; set; }
        public string FileRef { get; set; }
        public string ChangeType { get; set; }

    }
}
