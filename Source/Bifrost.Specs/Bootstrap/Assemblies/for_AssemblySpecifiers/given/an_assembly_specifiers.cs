using Bifrost.Bootstrap.Assemblies;
using Bifrost.Testing;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Assemblies.for_AssemblySpecifiers.given
{
    public class an_assembly_specifiers : dependency_injection
    {
        protected static AssemblySpecifiers specifiers;

        Establish context = () => specifiers = Get<AssemblySpecifiers>();
    }
}
