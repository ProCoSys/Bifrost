using System;

namespace Bifrost.Extensions
{
    /// <summary>
    /// The exception that is thrown when a value could not be parsed to the given type.
    /// </summary>
    public class ConvertException : Exception
    {
        /// <summary>
        /// Initializes an instance of <see cref="ConvertException"/>.
        /// </summary>
        /// <param name="input">The textual value to be parsed.</param>
        /// <param name="type">The type the value should be converted to.</param>
        /// <param name="innerException">The inner exception.</param>
        public ConvertException(string input, Type type, Exception innerException)
            : base(string.Format(ExceptionStrings.ConvertException, input, type.FullName), innerException)
        {
        }
    }
}
