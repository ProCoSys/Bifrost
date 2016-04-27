using System;
using Bifrost.Execution;
using Bifrost.Extensions;

namespace Bifrost.Bootstrap.Instances
{
    /// <summary>
    /// Implementation of an <see cref="IInstanceCreator"/> which creates instances by looking up implementors of a type.
    /// </summary>
    public class InstanceCreator : IInstanceCreator
    {
        readonly IImplementorFinder _implementorFinder;

        /// <summary>
        /// Creates an instance of the <see cref="InstanceCreator"/> class.
        /// </summary>
        public InstanceCreator(IImplementorFinder implementorFinder)
        {
            _implementorFinder = implementorFinder;
        }

        /// <summary>
        /// Gets whether this creator can create an instance of a given type.
        /// </summary>
        /// <param name="type">The type to check.</param>
        public bool CanCreate(Type type)
        {
            var implementingType = _implementorFinder.GetImplementorFor(type);
            return implementingType != null && implementingType.HasDefaultConstructor();
        }

        /// <summary>
        /// Creates an instance of the type or the single implementation of an interface type.
        /// </summary>
        /// <param name="type">The interface type to find a single implementation of.</param>
        /// <returns>An instance of the implementing type.</returns>
        /// <exception cref="NoTypesFoundException">
        /// If no implementing types of <paramref name="type"/> was found.
        /// </exception>
        /// <exception cref="MultipleTypesFoundException">
        /// If multiple implementing types of <paramref name="type"/> were found.
        /// </exception>
        public object Create(Type type)
        {
            var implementingType = _implementorFinder.GetImplementorFor(type);
            if (implementingType == null)
            {
                throw new NoTypesFoundException(type);
            }

            if (!implementingType.HasDefaultConstructor())
            {
                throw new MissingDefaultConstructorException(implementingType);
            }

            return Activator.CreateInstance(implementingType);
        }
    }
}
