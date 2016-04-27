using Bifrost.Bootstrap.Instances;
using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Instances.for_InstanceCreator
{
    [Subject(typeof(InstanceCreator))]
    public class when_no_implementing_types_exist : given.an_instance_creator
    {
        Because of = () =>
        {
            can_create = instance_creator.CanCreate(typeof(ITestInterface));
            exception = Catch.Only<NoTypesFoundException>(() => instance_creator.Create(typeof(ITestInterface)));
        };

        It should_not_be_able_to_create = () => can_create.ShouldBeFalse();

        It should_throw_exception = () => exception.ShouldNotBeNull();
    }
}
