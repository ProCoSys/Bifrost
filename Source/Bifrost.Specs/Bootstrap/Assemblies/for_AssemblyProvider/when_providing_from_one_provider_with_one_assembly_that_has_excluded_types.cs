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
    public class when_providing_from_one_provider_with_one_assembly_that_has_excluded_types : given.an_assembly_provider
    {
        static IObservableCollection<Assembly> result;
        static AssemblyInfo assembly_info;
        static Type[] types;
        static Assembly assembly;

        Establish context = () =>
        {
            types = new[] { typeof(string), typeof(int) };
            assembly = new TestAssembly("x", "location.dll", types);
            assembly_info = new AssemblyInfo("x", "y", new Lazy<Assembly>(() => assembly));
            GetMock<ICanProvideAssemblies>()
                .Setup(m => m.AvailableAssemblies)
                .Returns(new ObservableCollection<AssemblyInfo> { assembly_info });
            GetMock<IAssemblySpecifiers>().Setup(m => m.SpecifyUsingSpecifiersFrom(assembly)).Returns(true);
            GetMock<IAssemblyFilters>().Setup(m => m.ShouldInclude("location.dll")).Returns(true);
            GetMock<ITypeFilters>().Setup(m => m.ShouldInclude(typeof(string))).Returns(false);

            provider = Get<AssemblyProvider>();
        };

        Because of = () => result = provider.GetAll();

        It should_specify_from_the_assembly = () => GetMock<IAssemblySpecifiers>().VerifyAll();

        It should_return_the_assembly = () => result.ShouldContainOnly(assembly);

        It should_only_feed_one_type = () =>
            GetMock<ITypeCollector>()
                .Verify(m => m.Feed(Moq.It.Is<ICollection<Type>>(c => c.Single() == typeof(int))), Times.Once);
    }
}
