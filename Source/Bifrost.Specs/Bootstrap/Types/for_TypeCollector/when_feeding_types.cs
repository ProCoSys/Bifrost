using System.Linq;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Types.for_TypeCollector
{
    public sealed class when_feeding_types : given.a_type_collector
    {
        class X { }

        Because of = () =>
            Feed(typeof(string), typeof(int), typeof(X));

        It should_have_the_types = () => type_collector.Types.Count().ShouldEqual(3);

        It should_find_string_based_on_full_name = () =>
            type_collector.ByFullName("System.String").ShouldEqual(typeof(string));

        It should_find_int_based_on_full_name = () =>
            type_collector.ByFullName("System.Int32").ShouldEqual(typeof(int));

        It should_find_type_based_on_full_name = () =>
            type_collector.ByFullName(typeof(X).FullName).ShouldEqual(typeof(X));
    }
}
