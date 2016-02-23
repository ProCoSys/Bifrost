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
    public class when_loading_assembly_again : given.an_assembly_provider
    {
        static IObservableCollection<Assembly> result;
        static AssemblyInfo assembly_info;
        static Type[] types;
        static Assembly assembly;

        Establish context = () =>
        {
            assembly_info = new AssemblyInfo("x", "y");
            types = new Type[0];
            assembly = new TestAssembly("x", "location.dll", types);
            GetMock<ICanProvideAssemblies>().Setup(m => m.AvailableAssemblies).Returns(new[] { assembly_info });
            GetMock<IAssemblyUtility>().Setup(m => m.IsAssembly(assembly_info)).Returns(true);
            GetMock<ICanProvideAssemblies>().Setup(m => m.Get(assembly_info)).Returns(assembly);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location.dll")).Returns(true);

            provider = Get<AssemblyProvider>();
        };

        Because of = () => GetMock<ICanProvideAssemblies>().Raise(x => x.AssemblyAdded += null, assembly);

        It should_specify_from_the_assembly_once = () =>
            GetMock<IAssemblySpecifiers>().Verify(m => m.SpecifyUsingSpecifiersFrom(assembly), Times.Once);

        It should_return_the_assembly_only_once = () => provider.GetAll().ShouldContainOnly(assembly);

        It should_feed_the_types_only_once = () => GetMock<IContractToImplementorsMap>().Verify(m => m.Feed(types), Times.Once);
    }
}