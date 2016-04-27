using System;
using System.Collections.Generic;
using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Types.for_TypeCollector
{
    public sealed class when_feeding_i_collect_types : given.a_type_collector
    {
        class X { }

        class Y { }

        class CollectTypes2 : KeepLastCreated<CollectTypes2>, ICollectTypes
        {
            public List<Type> Types { get; } = new List<Type>();

            public void Feed(ICollection<Type> types)
            {
                Types.AddRange(types);
            }
        }

        Because of = () =>
        {
            Feed(typeof(string));
            Feed(typeof(X), typeof(TestCollectTypes), typeof(int));
            Feed(typeof(Y), typeof(CollectTypes2));
            Feed(typeof(bool));
        };

        It should_feed_all_types_to_first_collector = () => TestCollectTypes.LastCreated.Types.Count.ShouldEqual(7);

        It should_feed_all_types_to_second_collector = () => CollectTypes2.LastCreated.Types.Count.ShouldEqual(7);
    }
}
