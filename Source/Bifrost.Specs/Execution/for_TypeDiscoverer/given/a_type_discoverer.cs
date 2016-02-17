using System;
using System.Reflection;
using Bifrost.Execution;
using Bifrost.Testing;
using Machine.Specifications;

namespace Bifrost.Specs.Execution.for_TypeDiscoverer.given
{
    public class a_type_discoverer : dependency_injection
    {
        protected static TypeDiscoverer type_discoverer;

        class TestAssembly : Assembly
        {
            static readonly Type[] types =
            {
                typeof (ISingle),
                typeof (Single),
                typeof (IMultiple),
                typeof (FirstMultiple),
                typeof (SecondMultiple),
            };

            public override Type[] GetTypes()
            {
                return types;
            }

            public override string FullName => "A.Full.Name";
        }

        Establish context = () =>
        {
            GetMock<IAssemblies>().Setup(x => x.GetAll()).Returns(new[] {new TestAssembly()});
            type_discoverer = Get<TypeDiscoverer>();
        };
    }
}