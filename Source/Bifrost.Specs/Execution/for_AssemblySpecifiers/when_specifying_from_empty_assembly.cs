using Bifrost.Configuration.Assemblies;
using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Execution.for_AssemblySpecifiers
{
    [Subject(typeof(AssemblySpecifiers))]
    public class when_specifying_from_framework_assembly : given.an_assembly_specifiers
    {
        static bool result;

        Establish context = () => TestSpecifier.Mock = GetMock<ICanSpecifyAssemblies>();

        Because of = () => result = specifiers.SpecifyUsingSpecifiersFrom(typeof(string).Assembly);

        It should_not_specify_anything = () =>
            GetMock<ICanSpecifyAssemblies>()
                .Verify(c => c.Specify(GetMock<IAssembliesConfiguration>().Object), Moq.Times.Never);

        It should_return_false = () => result.ShouldBeFalse();
    }
}