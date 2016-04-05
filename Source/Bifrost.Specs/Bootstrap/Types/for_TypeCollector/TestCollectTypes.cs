using System;
using System.Collections.Generic;
using Bifrost.Execution;

namespace Bifrost.Specs.Bootstrap.Types.for_TypeCollector
{
    public class TestCollectTypes : KeepLastCreated<TestCollectTypes>, ICollectTypes
    {
        public List<Type> Types { get; } = new List<Type>();

        public void Feed(ICollection<Type> types)
        {
            Types.AddRange(types);
        }
    }
}
