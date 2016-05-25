using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Execution.for_DefaultConvention
{
    [Subject(typeof(DefaultConvention))]
    public class when_asking_to_resolve_an_interface_that_has_a_binding_for_the_implementation
        : given.a_default_convention
    {
        static bool result;

        Establish context = () => GetMock<IContainer>().Setup(c => c.HasBindingFor(typeof(Something))).Returns(true);

        Because of = () => result = convention.CanResolve(Get<IContainer>(), typeof(ISomething));

        It should_return_false = () => result.ShouldBeFalse();
    }
}
