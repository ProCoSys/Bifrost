using System;
using Bifrost.Bootstrap.Assemblies;
using Bifrost.Bootstrap.Types;
using Bifrost.Testing;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Assemblies.for_AssemblyProvider.given
{
    public class an_assembly_provider : dependency_injection
    {
        protected static AssemblyProvider provider;

        Establish context = () =>
            GetMock<ITypeFilters>().Setup(m => m.ShouldInclude(Moq.It.IsAny<Type>())).Returns(true);
    }
}
