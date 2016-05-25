using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Execution.for_DefaultConvention
{
    [Subject(typeof(DefaultConvention))]
    public class when_resolving_an_interface_with_an_implementation_following_convention_with_a_singleton_attribute
        : given.a_default_convention
    {
        Because of = () => convention.Resolve(Get<IContainer>(), typeof(ISomething));

        It should_bind_with_singleton_lifecycle = () =>
            GetMock<IContainer>().Verify(c => c.Bind(typeof(ISomething), typeof(Something), BindingLifecycle.Singleton));
    }
}
