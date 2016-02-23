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
    public class when_providing_from_one_provider_with_one_fake_assembly : given.an_assembly_provider
    {
        static IObservableCollection<Assembly> result;
        static AssemblyInfo assembly_info;

        Establish context = () =>
        {
            assembly_info = new AssemblyInfo("x", "y");
            GetMock<ICanProvideAssemblies>().Setup(m => m.AvailableAssemblies).Returns(new[] {assembly_info});
            GetMock<IAssemblyUtility>().Setup(m => m.IsAssembly(assembly_info)).Returns(false);

            provider = Get<AssemblyProvider>();
        };

        Because of = () => result = provider.GetAll();

        It should_not_specify_from_the_assembly = () =>
            GetMock<IAssemblySpecifiers>().Verify(m => m.SpecifyUsingSpecifiersFrom(Moq.It.IsAny<Assembly>()), Times.Never);

        It should_not_return_the_assembly = () => result.ShouldBeEmpty();

        It should_not_feed_the_types = () =>
            GetMock<IContractToImplementorsMap>().Verify(m => m.Feed(Moq.It.IsAny<Type[]>()), Times.Never);
    }
}