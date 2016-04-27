using Bifrost.Bootstrap.Instances;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Instances.for_InstanceCreator
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

        Establish context = () => SetupImplementation(typeof(ImplementingType));

        Because of = () =>
        {
            can_create = instance_creator.CanCreate(typeof(ITestInterface));
            exception =
                Catch.Only<MissingDefaultConstructorException>(() => instance_creator.Create(typeof(ITestInterface)));
        };

        It should_not_be_able_to_create = () => can_create.ShouldBeFalse();

        It should_throw_exception = () => exception.ShouldNotBeNull();
    }
}
