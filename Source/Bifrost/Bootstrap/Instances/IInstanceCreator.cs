using Bifrost.Execution;

namespace Bifrost.Bootstrap.Instances
{
    /// <summary>
    /// Defines an interface for creating instances of types.
    /// </summary>
    public interface IInstanceCreator
    {
        /// <summary>
        /// Creates an instance of the single implementation of an interface type.
        /// </summary>
        /// <typeparam name="T">The interface type to find a single implementation of.</typeparam>
        /// <returns>An instance of the implementing type.</returns>
        /// <exception cref="NoTypesFoundException">
        /// If no implementing types of <typeparamref name="T"/> was found.
        /// </exception>
        /// <exception cref="MultipleTypesFoundException">
        /// If multiple implementing types of <typeparamref name="T"/> were found.
        /// </exception>
        T Create<T>() where T : class;
    }
}
