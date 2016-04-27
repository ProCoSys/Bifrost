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
    public class when_providing_from_one_provider_with_two_assemblies : given.an_assembly_provider
    {
        static IObservableCollection<Assembly> result;
        static AssemblyInfo assembly_info1;
        static Type[] types1;
        static Assembly assembly1;

        static AssemblyInfo assembly_info2;
        static Type[] types2;
        static Assembly assembly2;

        Establish context = () =>
        {
            types1 = new[] { typeof(string) };
            assembly1 = new TestAssembly("x", "location1.dll", types1);
            assembly_info1 = new AssemblyInfo("x", "y", new Lazy<Assembly>(() => assembly1));
            types2 = new[] { typeof(AssemblyProvider) };
            assembly2 = new TestAssembly("z", "location2.dll", types2);
            assembly_info2 = new AssemblyInfo("z", "t", new Lazy<Assembly>(() => assembly2));
            GetMock<ICanProvideAssemblies>()
                .Setup(m => m.AvailableAssemblies)
                .Returns(new ObservableCollection<AssemblyInfo> { assembly_info1, assembly_info2 });
            GetMock<IAssemblySpecifiers>().Setup(m => m.SpecifyUsingSpecifiersFrom(assembly1)).Returns(true);
            GetMock<IAssemblySpecifiers>().Setup(m => m.SpecifyUsingSpecifiersFrom(assembly2)).Returns(true);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location1.dll")).Returns(true);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location2.dll")).Returns(true);

            provider = Get<AssemblyProvider>();
        };

        Because of = () => result = provider.GetAll();

        It should_specify_from_the_assemblies = () => GetMock<IAssemblySpecifiers>().VerifyAll();

        It should_return_the_assemblies = () => result.ShouldContainOnly(assembly1, assembly2);

        It should_feed_the_first_types = () => GetMock<ITypeCollector>().Verify(m => m.Feed(types1), Times.Once);

        It should_feed_the_second_types = () => GetMock<ITypeCollector>().Verify(m => m.Feed(types2), Times.Once);
    }
}
