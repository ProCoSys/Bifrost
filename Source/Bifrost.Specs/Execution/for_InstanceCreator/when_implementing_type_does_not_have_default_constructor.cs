using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Execution.for_InstanceCreator
{
    [Subject(typeof(InstanceCreator))]
    public class when_implementing_type_does_not_have_default_constructor : given.an_instance_creator
    {
        class ImplementingType : ITestInterface
        {
            public ImplementingType(bool value)
            {
            }
        };

        Establish context = () => SetupImplementations(typeof(ImplementingType));

        Because of = () =>
            exception = Catch.Only<MissingDefaultConstructorException>(() => instance_creator.Create<ITestInterface>());

        It should_throw_exception = () => exception.ShouldNotBeNull();
    }
}
