using System;
using Bifrost.Bootstrap.Types;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Types.for_TypeCollector.given
{
    public class a_type_collector
    {
        protected static TypeCollector type_collector;

        Establish context = () => type_collector = new TypeCollector();

        protected static void Feed(params Type[] types)
        {
            type_collector.Feed(types);
        }
    }
}
