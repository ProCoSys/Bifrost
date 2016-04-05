using System;
using System.Reflection;
using Bifrost.Bootstrap.Assemblies;
using Bifrost.Bootstrap.Types;
using Bifrost.Collections;
using Machine.Specifications;
using Moq;
using It = Machine.Specifications.It;

namespace Bifrost.Specs.Bootstrap.Assemblies.for_AssemblyProvider
{
    [Subject(typeof(AssemblyProvider))]
    public class when_loading_assembly : given.an_assembly_provider
    {
        static IObservableCollection<Assembly> result;
        static IObservableCollection<AssemblyInfo> available_assemblies;
        static Type[] types;
        static Assembly assembly;

        Establish context = () =>
        {
            types = new Type[0];
            assembly = new TestAssembly("x", "location.dll", types);
            available_assemblies = new ObservableCollection<AssemblyInfo>();
            GetMock<ICanProvideAssemblies>().Setup(m => m.AvailableAssemblies).Returns(available_assemblies);

            provider = Get<AssemblyProvider>();
            GetMock<IAssemblySpecifiers>().Setup(m => m.SpecifyUsingSpecifiersFrom(assembly)).Returns(true);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location.dll")).Returns(true);
        };

        Because of = () => available_assemblies.Add(new AssemblyInfo("x", "location.dll", new Lazy<Assembly>(() => assembly)));

        It should_specify_from_the_assembly = () => GetMock<IAssemblySpecifiers>().VerifyAll();

        It should_return_the_assembly = () => provider.GetAll().ShouldContainOnly(assembly);

        It should_feed_the_types = () => GetMock<ITypeCollector>().Verify(m => m.Feed(types), Times.Once);
    }
}