using System;

namespace Bifrost.Exceptions
{
    /// <summary>
    /// Implement this interface to subscribe to exceptions
    /// </summary>
    public interface IExceptionSubscriber
    {
        /// <summary>
        /// Handle the exception.
        /// </summary>
        void Handle(Exception exception);
    }
}