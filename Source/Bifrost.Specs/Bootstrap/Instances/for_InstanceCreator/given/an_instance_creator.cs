using System;
using Bifrost.Bootstrap;
using Bifrost.Bootstrap.Instances;
using Bifrost.Testing;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Instances.for_InstanceCreator.given
{
    public class an_instance_creator : dependency_injection
    {
        protected static Exception exception;

        protected static bool can_create;

        protected static InstanceCreator instance_creator;

        Establish context = () =>
        {
            instance_creator = Get<InstanceCreator>();
        };

        protected static void SetupImplementation(Type type)
        {
            GetMock<IImplementorFinder>()
                .Setup(m => m.GetImplementorFor(typeof(ITestInterface)))
                .Returns(type);
        }
    }
}
