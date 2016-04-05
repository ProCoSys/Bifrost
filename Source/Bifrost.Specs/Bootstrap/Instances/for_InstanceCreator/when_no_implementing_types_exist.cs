using Bifrost.Bootstrap.Instances;
using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Instances.for_InstanceCreator
{
    [Subject(typeof(InstanceCreator))]
    public class when_no_implementing_types_exist : given.an_instance_creator
    {
        Establish context = () => SetupImplementations();

        Because of = () =>
            exception = Catch.Only<NoTypesFoundException>(() => instance_creator.Create<ITestInterface>());

        It should_throw_exception = () => exception.ShouldNotBeNull();
    }
}
