using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.ExceptionLogger.Interfaces
{
    public interface IExceptionLoggerServices
    {
        Task LogExceptionAsync(Exception ex);
    }
}
