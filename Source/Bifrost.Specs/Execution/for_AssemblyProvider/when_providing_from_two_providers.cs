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
    public class when_providing_from_two_providers : given.an_assembly_provider
    {
        static IObservableCollection<Assembly> result;
        static AssemblyInfo assembly_info1;
        static Type[] types1;
        static Assembly assembly1;

        static AssemblyInfo assembly_info2;
        static Type[] types2;
        static Assembly assembly2;

        static Mock<ICanProvideAssemblies> provider1;
        static Mock<ICanProvideAssemblies> provider2;

        Establish context = () =>
        {
            assembly_info1 = new AssemblyInfo("x", "y");
            types1 = new[] {typeof(string)};
            assembly1 = new TestAssembly("x", "location1.dll", types1);
            assembly_info2 = new AssemblyInfo("z", "t");
            types2 = new[] { typeof(AssemblyProvider) };
            assembly2 = new TestAssembly("z", "location2.dll", types2);
            provider1 = new Mock<ICanProvideAssemblies>();
            provider2 = new Mock<ICanProvideAssemblies>();
            RebindMultiple(provider1.Object, provider2.Object);
            provider1.Setup(m => m.AvailableAssemblies).Returns(new[] {assembly_info1});
            provider2.Setup(m => m.AvailableAssemblies).Returns(new[] {assembly_info2});
            GetMock<IAssemblyUtility>().Setup(m => m.IsAssembly(assembly_info1)).Returns(true);
            GetMock<IAssemblyUtility>().Setup(m => m.IsAssembly(assembly_info2)).Returns(true);
            provider1.Setup(m => m.Get(assembly_info1)).Returns(assembly1);
            provider2.Setup(m => m.Get(assembly_info2)).Returns(assembly2);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location1.dll")).Returns(true);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location2.dll")).Returns(true);

            provider = Get<AssemblyProvider>();
        };

        Because of = () => result = provider.GetAll();

        It should_specify_from_the_first_assembly = () =>
            GetMock<IAssemblySpecifiers>().Verify(m => m.SpecifyUsingSpecifiersFrom(assembly1), Times.Once);

        It should_specify_from_the_second_assembly = () =>
            GetMock<IAssemblySpecifiers>().Verify(m => m.SpecifyUsingSpecifiersFrom(assembly2), Times.Once);

        It should_return_the_assemblies = () => result.ShouldContainOnly(assembly1, assembly2);

        It should_feed_the_first_types = () => GetMock<IContractToImplementorsMap>().Verify(m => m.Feed(types1), Times.Once);

        It should_feed_the_second_types = () => GetMock<IContractToImplementorsMap>().Verify(m => m.Feed(types2), Times.Once);
    }
}