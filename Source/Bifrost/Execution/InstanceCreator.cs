using System;
using Bifrost.Extensions;

namespace Bifrost.Execution
{
    /// <summary>
    /// Implementation of an instance creator which creates instances using the default constructor.
    /// </summary>
    public class InstanceCreator : IInstanceCreator
    {
        readonly ITypeFinder _typeFinder;
        readonly IContractToImplementorsMap _contractToImplementorsMap;

        /// <summary>
        /// Creates an instance of the <see cref="InstanceCreator"/> class.
        /// </summary>
        public InstanceCreator(ITypeFinder typeFinder, IContractToImplementorsMap contractToImplementorsMap)
        {
            _typeFinder = typeFinder;
            _contractToImplementorsMap = contractToImplementorsMap;
        }

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
        /// <exception cref="MissingDefaultConstructorException">
        /// If the implementing type of <typeparamref name="T"/> does not have a default constructur.
        /// </exception>
        public T Create<T>() where T : class
        {
            var implementingType = _typeFinder.FindSingle<T>(_contractToImplementorsMap);
            if (implementingType == null)
            {
                throw new NoTypesFoundException(typeof(T));
            }
            else if (!implementingType.HasDefaultConstructor())
            {
                throw new MissingDefaultConstructorException(implementingType);
            }

            return Activator.CreateInstance(implementingType) as T;
        }
    }
}
