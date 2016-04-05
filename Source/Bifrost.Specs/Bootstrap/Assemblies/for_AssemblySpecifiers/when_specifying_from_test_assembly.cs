using Bifrost.Bootstrap.Assemblies;
using Bifrost.Configuration.Assemblies;
using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Assemblies.for_AssemblySpecifiers
{
    [Subject(typeof(AssemblySpecifiers))]
    public class when_specifying_from_test_assembly : given.an_assembly_specifiers
    {
        static bool result;

        Establish context = () => TestSpecifier.Mock = GetMock<ICanSpecifyAssemblies>();

        Because of = () => result = specifiers.SpecifyUsingSpecifiersFrom(typeof(TestSpecifier).Assembly);

        It should_have_specified_both_specifiers = () =>
            GetMock<ICanSpecifyAssemblies>()
                .Verify(c => c.Specify(GetMock<IAssembliesConfiguration>().Object), Moq.Times.Exactly(2));

        It should_return_true = () => result.ShouldBeTrue();
    }
}