using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bifrost.Bootstrap.Instances;
using Bifrost.Configuration;
using Bifrost.Execution;
using Bifrost.Extensions;

namespace Bifrost.Bootstrap.Types
{
    /// <summary>
    /// Represents an implementation of <see cref="ITypeCollector"/>.
    /// </summary>
    public class TypeCollector : ITypeCollector
    {
        readonly IList<Type> _types = new List<Type>();

        readonly IDictionary<string, IList<Type>> _typesByFullName = new Dictionary<string, IList<Type>>();

        readonly List<ICollectTypes> _collectTypes = new List<ICollectTypes>();

        readonly List<object> _forAutoBind = new List<object>();

        readonly Stack<IInstanceCreator> _instanceCreators = new Stack<IInstanceCreator>();

#pragma warning disable 1591 // Xml Comments
        public TypeCollector()
        {
            _instanceCreators.Push(new DefaultInstanceCreator());
            RegisterForAutoBind(this);
        }

        public T Get<T>() => (T)Create(typeof(T));

        internal void RegisterForAutoBind(object instance) => _forAutoBind.Add(instance);

        /// <summary>
        /// Creates the real container by finding and instantiating an implementation of <see cref="ICanCreateContainer"/>.
        /// </summary>
        /// <returns>The real container, with the vital contracts already bound.</returns>
        /// <remarks>
        /// The following contracts will be bound by this collector to its respective object:
        /// <ul>
        /// <li><see cref="IAutoBinder"/>.</li>
        /// <li><see cref="IContainer"/>.</li>
        /// <li><see cref="ICanCreateContainer"/>.</li>
        /// <li><see cref="ITypeCollector"/>.</li>
        /// <li>All created instances of <see cref="ICollectTypes"/> and <see cref="IImplementorFinder"/>.</li>
        /// <li>All instances that was previously registered with <see cref="RegisterForAutoBind"/>.</li>
        /// <li>All instances that was previously created using <see cref="Get{T}"/>.</li>
        /// </ul>
        /// </remarks>
        public IContainer BootstrapContainer()
        {
            var container = Get<ICanCreateContainer>().CreateContainer();
            var autoBinder = new AutoBinder(container);
            autoBinder.BindAll(_forAutoBind);
            return container;
        }

        public IEnumerable<Type> Types => _types;

        public Type ByFullName(string fullName)
        {
            IList<Type> types;
            if (!_typesByFullName.TryGetValue(fullName, out types))
            {
                return null;
            }
            else if (types.Count > 1)
            {
                throw new MultipleTypesFoundException(string.Format(ExceptionStrings.MultipleTypesFoundException, fullName));
            }

            return types[0];
        }

        public void Feed(ICollection<Type> types)
        {
            var newCollectors = new List<ICollectTypes>();
            foreach (var type in types)
            {
                if (type.IsImplementation() && IsInterestingType(type))
                {
                    var obj = Create(type);
                    MaybeCreateNewInstanceCreator(obj as IImplementorFinder);
                    MaybeAddCollector(obj as ICollectTypes, newCollectors);
                }

                IList<Type> typesByFullName;
                if (!_typesByFullName.TryGetValue(type.FullName, out typesByFullName))
                {
                    _typesByFullName[type.FullName] = new List<Type> { type };
                }
                else
                {
                    typesByFullName.Add(type);
                }

                _types.Add(type);
            }

            // Feed new types to old collectors.
            Parallel.ForEach(_collectTypes, c => c.Feed(types));


            // Feed all types to new collectors
            Parallel.ForEach(newCollectors, c => c.Feed(_types));

            _collectTypes.AddRange(newCollectors);
        }

#pragma warning restore 1591 // Xml Comments

        void MaybeCreateNewInstanceCreator(IImplementorFinder implementorFinder)
        {
            if (implementorFinder != null)
            {
                _instanceCreators.Push(new InstanceCreator(implementorFinder));
            }
        }

        static void MaybeAddCollector(ICollectTypes collectTypes, ICollection<ICollectTypes> newCollectors)
        {
            if (collectTypes != null)
            {
                newCollectors.Add(collectTypes);
            }
        }

        static bool IsInterestingType(Type type)
        {
            return
                typeof(IImplementorFinder).IsAssignableFrom(type) ||
                typeof(ICollectTypes).IsAssignableFrom(type);
        }

        object Create(Type type)
        {
            var instance = _instanceCreators.First(i => i.CanCreate(type)).Create(type);
            RegisterForAutoBind(instance);
            return instance;
        }
    }
}
