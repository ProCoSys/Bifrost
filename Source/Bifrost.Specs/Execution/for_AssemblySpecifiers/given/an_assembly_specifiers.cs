using Bifrost.Execution;
using Bifrost.Testing;
using Machine.Specifications;

namespace Bifrost.Specs.Execution.for_AssemblySpecifiers.given
{
    public class an_assembly_specifiers : dependency_injection
    {
        protected static AssemblySpecifiers specifiers;

        Establish context = () => specifiers = Get<AssemblySpecifiers>();
    }
}
