using System.Collections.Generic;
using Bifrost.Execution;
using Bifrost.Extensions;

namespace Bifrost.Bootstrap.Types
{
    /// <summary>
    /// Represents an implementation of <see cref="IAutoBinder"/>.
    /// </summary>
    public class AutoBinder : IAutoBinder
    {
        readonly IContainer _container;

#pragma warning disable 1591 // Xml Comments
        public AutoBinder(IContainer container)
        {
            _container = container;
            Bind(container);
            Bind(this);
        }

        public void BindAll(IEnumerable<object> instances)
            => instances.ForEach(Bind);

        public void Bind(object instance)
            => instance
                .GetType()
                .AllBaseAndImplementingTypes()
                .ForEach(s => _container.Bind(s, instance));
#pragma warning restore 1591 // Xml Comments
    }
}
