using Bifrost.Bootstrap.Instances;
using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Instances.for_InstanceCreator
{
    [Subject(typeof(InstanceCreator))]
    public class when_multiple_implementing_types_exist : given.an_instance_creator
    {
        class FirstType : ITestInterface
        {
        };

        class SecondType : ITestInterface
        {
        };

        Establish context = () => SetupImplementations(typeof(FirstType), typeof(SecondType));

        Because of = () =>
            exception = Catch.Only<MultipleTypesFoundException>(() => instance_creator.Create<ITestInterface>());

        It should_throw_exception = () => exception.ShouldNotBeNull();
    }
}
