using Bifrost.Bootstrap.Instances;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Instances.for_InstanceCreator
{
    [Subject(typeof(InstanceCreator))]
    public class when_single_implementing_type_exist : given.an_instance_creator
    {
        class ImplementingType : ITestInterface { }

        static object instance;

        Establish context = () => SetupImplementation(typeof(ImplementingType));

        Because of = () =>
        {
            can_create = instance_creator.CanCreate(typeof(ITestInterface));
            instance = instance_creator.Create(typeof(ITestInterface));
        };

        It should_be_able_to_create = () => can_create.ShouldBeTrue();

        It should_create_type = () => instance.GetType().ShouldEqual(typeof(ImplementingType));
    }
}
