using System.Linq;
using System.Reflection;
using Bifrost.Bootstrap.Assemblies;
using Bifrost.Collections;
using Bifrost.Execution;
using Machine.Specifications;
using Moq;
using It = Machine.Specifications.It;

namespace Bifrost.Specs.Bootstrap.Assemblies.for_AssemblyProvider
{
    [Subject(typeof(AssemblyProvider))]
    public class when_providing_from_no_providers : given.an_assembly_provider
    {
        static IObservableCollection<Assembly> result;

        Establish context = () =>
        {
            provider = new AssemblyProvider(
                Enumerable.Empty<ICanProvideAssemblies>(),
                Get<IAssemblyFilters>(),
                Get<IAssemblySpecifiers>(),
                Get<IContractToImplementorsMap>());
        };

        Because of = () => result = provider.GetAll();

        It should_return_no_assemblies = () => result.ShouldBeEmpty();

        It should_not_filter_anything = () =>
            GetMock<IAssemblyFilters>().Verify(m => m.ShouldInclude(Moq.It.IsAny<string>()), Times.Never);

        It should_not_specify_anything = () =>
            GetMock<IAssemblySpecifiers>()
                .Verify(m => m.SpecifyUsingSpecifiersFrom(Moq.It.IsAny<Assembly>()), Times.Never);
    }
}
