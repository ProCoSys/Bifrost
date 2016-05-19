using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Execution.for_DefaultConvention
{
    [Subject(typeof(DefaultConvention))]
    public class when_asking_to_resolve_an_interface_with_a_default_implementation_and_a_second_implementation
        : given.a_default_convention
    {
        static bool result;

        Because of = () =>
            result = convention.CanResolve(Get<IContainer>(), typeof(ISomethingWithMultipleImplementations));

        It should_return_false = () => result.ShouldBeFalse();
    }
}
