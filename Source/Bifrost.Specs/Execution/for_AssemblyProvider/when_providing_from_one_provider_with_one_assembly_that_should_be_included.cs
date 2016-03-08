using System;
using System.Reflection;
using Bifrost.Collections;
using Bifrost.Execution;
using Machine.Specifications;
using Moq;
using It = Machine.Specifications.It;

namespace Bifrost.Specs.Execution.for_AssemblyProvider
{
    [Subject(typeof(AssemblyProvider))]
    public class when_providing_from_one_provider_with_one_assembly_that_should_be_included : given.an_assembly_provider
    {
        static IObservableCollection<Assembly> result;
        static AssemblyInfo assembly_info;
        static Type[] types;
        static Assembly assembly;

        Establish context = () =>
        {
            types = new Type[0];
            assembly = new TestAssembly("x", "location.dll", types);
            assembly_info = new AssemblyInfo("x", "y", new Lazy<Assembly>(() => assembly));
            GetMock<ICanProvideAssemblies>()
                .Setup(m => m.AvailableAssemblies)
                .Returns(new ObservableCollection<AssemblyInfo> { assembly_info });
            GetMock<IAssemblySpecifiers>().Setup(m => m.SpecifyUsingSpecifiersFrom(assembly)).Returns(true);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location.dll")).Returns(true);

            provider = Get<AssemblyProvider>();
        };

        Because of = () => result = provider.GetAll();

        It should_specify_from_the_assembly = () => GetMock<IAssemblySpecifiers>().VerifyAll();

        It should_return_the_assembly = () => result.ShouldContainOnly(assembly);

        It should_feed_the_types = () => GetMock<IContractToImplementorsMap>().Verify(m => m.Feed(types), Times.Once);
    }
}
