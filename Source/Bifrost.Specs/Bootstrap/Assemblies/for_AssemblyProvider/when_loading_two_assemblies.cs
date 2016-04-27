using System;
using System.Collections.Generic;
using System.Linq;
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
    public class when_loading_two_assemblies : given.an_assembly_provider
    {
        static IList<Assembly> result1;
        static IList<Assembly> result2;
        static AssemblyInfo assembly_info1;
        static Type[] types1;
        static Assembly assembly1;

        static AssemblyInfo assembly_info2;
        static Type[] types2;
        static Assembly assembly2;
        static IObservableCollection<AssemblyInfo> available_assemblies;

        Establish context = () =>
        {
            types1 = new[] { typeof(string) };
            assembly1 = new TestAssembly("x", "location1.dll", types1);
            assembly_info1 = new AssemblyInfo("x", "y", new Lazy<Assembly>(() => assembly1));
            types2 = new[] { typeof(AssemblyProvider) };
            assembly2 = new TestAssembly("z", "location2.dll", types2);
            assembly_info2 = new AssemblyInfo("z", "t", new Lazy<Assembly>(() => assembly2));

            available_assemblies = new ObservableCollection<AssemblyInfo>();
            GetMock<ICanProvideAssemblies>().Setup(m => m.AvailableAssemblies).Returns(available_assemblies);

            provider = Get<AssemblyProvider>();
        };

        Because of = () =>
        {
            // Don't include the first time
            GetMock<IAssemblySpecifiers>().Setup(m => m.SpecifyUsingSpecifiersFrom(assembly1)).Returns(false);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location1.dll")).Returns(false);
            available_assemblies.Add(assembly_info1);
            result1 = provider.GetAll().ToList();

            // Include the second time
            GetMock<IAssemblySpecifiers>().Setup(m => m.SpecifyUsingSpecifiersFrom(assembly2)).Returns(true);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location2.dll")).Returns(true);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location1.dll")).Returns(true);
            available_assemblies.Add(assembly_info1);
            available_assemblies.Add(assembly_info2);
            result2 = provider.GetAll().ToList();
        };

        It should_specify_the_assemblies = () => GetMock<IAssemblySpecifiers>().VerifyAll();

        It should_return_no_assemblies_the_first_time = () => result1.ShouldBeEmpty();

        It should_return_both_assemblies_the_second_time = () => result2.ShouldContainOnly(assembly1, assembly2);

        It should_feed_the_first_types = () => GetMock<ITypeCollector>().Verify(m => m.Feed(types1), Times.Once);

        It should_feed_the_second_types = () => GetMock<ITypeCollector>().Verify(m => m.Feed(types2), Times.Once);
    }
}
