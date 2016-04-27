using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Types.for_TypeCollector
{
    public sealed class when_feeding_implementation_finder : given.a_type_collector
    {
        interface IX { }

        class X : IX { }

        static IX ix;

        static X x;

        Because of = () =>
        {
            Feed(typeof(TestImplementorFinder));

            ix = type_collector.Get<IX>();
            x = type_collector.Get<X>();
        };

        It should_create_concrete_class_from_contract = () => ix.ShouldBeOfExactType(typeof(X));
        It should_create_concrete_class = () => x.ShouldBeOfExactType(typeof(X));
    }
}
