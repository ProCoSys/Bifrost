using Bifrost.Bootstrap.Instances;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Instances.for_InstanceCreator
{
    [Subject(typeof(InstanceCreator))]
    public class when_single_implementing_type_exist : given.an_instance_creator
    {
        class ImplementingType : ITestInterface
        {
        };

        static ITestInterface instance;

        Establish context = () => SetupImplementations(typeof(ImplementingType));

        Because of = () => instance = instance_creator.Create<ITestInterface>();

        It should_create_type = () => instance.GetType().ShouldEqual(typeof(ImplementingType));
    }
}
