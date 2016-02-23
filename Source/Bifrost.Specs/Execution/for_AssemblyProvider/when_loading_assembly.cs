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
    public class when_loading_assembly : given.an_assembly_provider
    {
        static IObservableCollection<Assembly> result;
        static Type[] types;
        static Assembly assembly;

        Establish context = () =>
        {
            types = new Type[0];
            assembly = new TestAssembly("x", "location.dll", types);
            provider = Get<AssemblyProvider>();
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location.dll")).Returns(true);
        };

        Because of = () => GetMock<ICanProvideAssemblies>().Raise(x => x.AssemblyAdded += null, assembly);

        It should_specify_from_the_assembly = () =>
            GetMock<IAssemblySpecifiers>().Verify(m => m.SpecifyUsingSpecifiersFrom(assembly), Times.Once);

        It should_return_the_assembly = () => provider.GetAll().ShouldContainOnly(assembly);

        It should_feed_the_types = () => GetMock<IContractToImplementorsMap>().Verify(m => m.Feed(types), Times.Once);
    }
}