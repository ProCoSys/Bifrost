using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Types.for_TypeCollector
{
    public sealed class when_initialized : given.a_type_collector
    {
        It should_keep_have_no_types = () => type_collector.Types.ShouldBeEmpty();

        It should_return_null_when_asked_by_full_name = () => type_collector.ByFullName("X").ShouldBeNull();

        It can_create_concrete_type = () => type_collector.Get<int>().ShouldEqual(0);
    }
}
