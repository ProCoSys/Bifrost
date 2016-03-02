using System;
using Bifrost.Execution;
using Bifrost.Testing;
using Machine.Specifications;

namespace Bifrost.Specs.Execution.for_InstanceCreator.given
{
    public class an_instance_creator : dependency_injection
    {
        protected static Exception exception;

        protected static InstanceCreator instance_creator;

        Establish context = () =>
        {
            Rebind<ITypeFinder>().To<TypeFinder>();
            instance_creator = Get<InstanceCreator>();
        };

        protected static void SetupImplementations(params Type[] types)
        {
            GetMock<IContractToImplementorsMap>()
                .Setup(m => m.GetImplementorsFor(typeof(ITestInterface)))
                .Returns(types);
        }
    }
}
