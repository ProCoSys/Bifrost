using Bifrost.Bootstrap.Instances;
using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Instances.for_InstanceCreator
{
    [Subject(typeof(InstanceCreator))]
    public class when_type_is_concrete : given.an_instance_creator
    {
        Because of = () =>
        {
            can_create = instance_creator.CanCreate(typeof(int));
            exception = Catch.Only<NoTypesFoundException>(() => instance_creator.Create(typeof(int)));
        };

        It should_not_be_able_to_create = () => can_create.ShouldBeFalse();

        It should_throw_exception = () => exception.ShouldNotBeNull();
    }
}
