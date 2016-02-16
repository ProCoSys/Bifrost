using System;

namespace Bifrost.Exceptions
{
    /// <summary>
    /// Publishes exceptions to all <see cref="IExceptionSubscriber"/>s.
    /// </summary>
    public interface IExceptionPublisher
    {
        /// <summary>
        /// Publishes the exception to all <see cref="IExceptionSubscriber"/>.
        /// </summary>
        /// <param name="exception"></param>
        void Publish(Exception exception);
    }
}