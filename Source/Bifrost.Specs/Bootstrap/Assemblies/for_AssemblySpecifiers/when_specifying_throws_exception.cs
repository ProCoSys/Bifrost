using System;
using Bifrost.Bootstrap.Assemblies;
using Bifrost.Configuration.Assemblies;
using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Assemblies.for_AssemblySpecifiers
{
    [Subject(typeof(AssemblySpecifiers))]
    public class when_specifying_throws_exception : given.an_assembly_specifiers
    {
        static AssemblySpecificationException exception;

        Establish context = () =>
        {
            TestSpecifier.Mock = GetMock<ICanSpecifyAssemblies>();
            TestSpecifier.Mock
                .Setup(m => m.Specify(Get<IAssembliesConfiguration>()))
                .Throws(new Exception("x"));
        };

        Because of = () =>
            exception =
                Catch.Only<AssemblySpecificationException>(
                    () => specifiers.SpecifyUsingSpecifiersFrom(typeof(TestSpecifier).Assembly));

        It should_throw_exception = () => exception.ShouldNotBeNull();
    }
}
