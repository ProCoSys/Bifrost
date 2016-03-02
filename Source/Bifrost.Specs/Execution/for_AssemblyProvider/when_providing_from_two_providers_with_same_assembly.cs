﻿using System;
using System.Reflection;
using Bifrost.Collections;
using Bifrost.Execution;
using Machine.Specifications;
using Moq;
using It = Machine.Specifications.It;

namespace Bifrost.Specs.Execution.for_AssemblyProvider
{
    [Subject(typeof(AssemblyProvider))]
    public class when_providing_from_two_providers_with_same_assembly : given.an_assembly_provider
    {
        static IObservableCollection<Assembly> result;
        static AssemblyInfo assembly_info1;
        static Type[] types1;
        static Assembly assembly1;

        static AssemblyInfo assembly_info2;

        static Mock<ICanProvideAssemblies> provider1;
        static Mock<ICanProvideAssemblies> provider2;

        Establish context = () =>
        {
            assembly_info1 = new AssemblyInfo("SameName", "y");
            types1 = new[] {typeof(string)};
            assembly1 = new TestAssembly("x", "location1.dll", types1);
            assembly_info2 = new AssemblyInfo("SameName", "t");
            provider1 = new Mock<ICanProvideAssemblies>();
            provider2 = new Mock<ICanProvideAssemblies>();
            RebindMultiple(provider1.Object, provider2.Object);
            provider1.Setup(m => m.AvailableAssemblies).Returns(new[] {assembly_info1});
            provider2.Setup(m => m.AvailableAssemblies).Returns(new[] {assembly_info2});
            GetMock<IAssemblyUtility>().Setup(m => m.IsAssembly(assembly_info1)).Returns(true);
            provider1.Setup(m => m.Get(assembly_info1)).Returns(assembly1);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location1.dll")).Returns(true);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location2.dll")).Returns(true);

            provider = Get<AssemblyProvider>();
        };

        Because of = () => result = provider.GetAll();

        It should_not_check_second_assembly = () =>
            GetMock<IAssemblyUtility>().Verify(m => m.IsAssembly(assembly_info2), Times.Never);

        It should_not_filter_second_assembly = () =>
            GetMock<IAssemblyFilters>().Verify(m => m.ShouldInclude("location2.dll"), Times.Never);

        It should_specify_from_the_first_assembly = () =>
            GetMock<IAssemblySpecifiers>().Verify(m => m.SpecifyUsingSpecifiersFrom(Moq.It.IsAny<Assembly>()), Times.Once);

        It should_only_return_the_first_assembly = () => result.ShouldContainOnly(assembly1);

        It should_feed_only_the_first_types = () =>
            GetMock<IContractToImplementorsMap>().Verify(m => m.Feed(Moq.It.IsAny<Type[]>()), Times.Once);
    }
}