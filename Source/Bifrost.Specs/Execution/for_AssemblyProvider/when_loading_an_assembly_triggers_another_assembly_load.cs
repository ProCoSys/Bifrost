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
    public class when_loading_an_assembly_triggers_another_assembly_load : given.an_assembly_provider
    {
        static IObservableCollection<Assembly> result;
        static IObservableCollection<AssemblyInfo> available_assemblies;
        static Type[] types1;
        static Assembly assembly1;

        static Type[] types2;
        static Assembly assembly2;

        Establish context = () =>
        {
            types1 = new[] { typeof(string) };
            assembly1 = new TestAssembly("x", "location1.dll", types1);
            types2 = new[] { typeof(AssemblyProvider) };
            assembly2 = new TestAssembly("z", "location2.dll", types2);
            available_assemblies = new ObservableCollection<AssemblyInfo>();
            GetMock<ICanProvideAssemblies>().Setup(m => m.AvailableAssemblies).Returns(available_assemblies);

            provider = Get<AssemblyProvider>();
            GetMock<IAssemblySpecifiers>().Setup(m => m.SpecifyUsingSpecifiersFrom(assembly1)).Returns(true);
            GetMock<IAssemblySpecifiers>().Setup(m => m.SpecifyUsingSpecifiersFrom(assembly2)).Returns(true);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location1.dll")).Returns(true);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location2.dll")).Returns(true);
        };

        Because of = () => available_assemblies.Add(new AssemblyInfo("x", "location1.dll", new Lazy<Assembly>(LoadAnotherAssembly)));

        static Assembly LoadAnotherAssembly()
        {
            available_assemblies.Add(new AssemblyInfo("y", "location2.dll", new Lazy<Assembly>(() => assembly2)));
            return assembly1;
        }

        It should_specify_from_the_assemblies = () => GetMock<IAssemblySpecifiers>().VerifyAll();

        It should_return_the_assembly = () => provider.GetAll().ShouldContain(assembly1, assembly2);

        It should_feed_the_first_types = () => GetMock<IContractToImplementorsMap>().Verify(m => m.Feed(types1), Times.Once);

        It should_feed_the_second_types = () => GetMock<IContractToImplementorsMap>().Verify(m => m.Feed(types2), Times.Once);
    }
}