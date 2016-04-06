using System;
using Bifrost.Conventions;

namespace Bifrost.Exceptions
{
    /// <summary>
    /// Implement this interface to subscribe to exceptions.
    /// </summary>
    /// <remarks>
    /// Types inheriting from this interface will be automatically registered.
    /// An application can implement any number of these conventions.
    /// </remarks>
    public interface IExceptionSubscriber : IConvention
    {
        /// <summary>
        /// Handle the exception.
        /// </summary>
        void Handle(Exception exception);
    }
}
