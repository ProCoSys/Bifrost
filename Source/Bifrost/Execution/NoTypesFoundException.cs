using System;

namespace Bifrost.Execution
{
    /// <summary>
    /// The exception that is thrown when no implementing types are found.
    /// </summary>
    public class NoTypesFoundException : ArgumentException
    {
        /// <summary>
        /// Initializes an instance of <see cref="NoTypesFoundException"/>
        /// </summary>
        /// <param name="type">The type that has no implementations.</param>
        public NoTypesFoundException(Type type)
            : base(string.Format(ExceptionStrings.CanCreateContainerNotFoundException, type.FullName))
        {
        }
    }
}
