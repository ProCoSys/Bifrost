using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Bifrost.Execution;
using Machine.Specifications;
using Moq;
using It = Machine.Specifications.It;

namespace Bifrost.Specs.Execution.for_AssemblyProvider
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

        Establish context = () =>
        {
            assembly_info1 = new AssemblyInfo("x", "y");
            types1 = new[] { typeof(string) };
            assembly1 = new TestAssembly("x", "location1.dll", types1);
            assembly_info2 = new AssemblyInfo("z", "t");
            types2 = new[] { typeof(AssemblyProvider) };
            assembly2 = new TestAssembly("z", "location2.dll", types2);

            provider = Get<AssemblyProvider>();
        };

        Because of = () =>
        {
            // Don't include the first time
            GetMock<IAssemblySpecifiers>().Setup(m => m.SpecifyUsingSpecifiersFrom(assembly1)).Returns(false);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location1.dll")).Returns(false);
            GetMock<ICanProvideAssemblies>().Raise(x => x.AssemblyAdded += null, assembly1);
            result1 = provider.GetAll().ToList();

            // Include the second time
            GetMock<IAssemblySpecifiers>().Setup(m => m.SpecifyUsingSpecifiersFrom(assembly2)).Returns(true);
            GetMock<ICanProvideAssemblies>().Setup(m => m.AvailableAssemblies).Returns(new[] { assembly_info1, assembly_info2 });
            GetMock<IAssemblyUtility>().Setup(m => m.IsAssembly(assembly_info1)).Returns(true);
            GetMock<IAssemblyUtility>().Setup(m => m.IsAssembly(assembly_info2)).Returns(true);
            GetMock<ICanProvideAssemblies>().Setup(m => m.Get(assembly_info1)).Returns(assembly1);
            GetMock<ICanProvideAssemblies>().Setup(m => m.Get(assembly_info2)).Returns(assembly2);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location2.dll")).Returns(true);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location1.dll")).Returns(true);
            GetMock<ICanProvideAssemblies>().Raise(x => x.AssemblyAdded += null, assembly2);

            result2 = provider.GetAll().ToList();
        };

        It should_specify_the_assemblies = () => GetMock<IAssemblySpecifiers>().VerifyAll();

        It should_return_no_assemblies_the_first_time = () => result1.ShouldBeEmpty();

        It should_return_both_assemblies_the_second_time = () => result2.ShouldContainOnly(assembly1, assembly2);

        It should_feed_the_first_types = () => GetMock<IContractToImplementorsMap>().Verify(m => m.Feed(types1), Times.Once);

        It should_feed_the_second_types = () => GetMock<IContractToImplementorsMap>().Verify(m => m.Feed(types2), Times.Once);
    }
}