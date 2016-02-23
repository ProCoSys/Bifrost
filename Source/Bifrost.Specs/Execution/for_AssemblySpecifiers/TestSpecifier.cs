using System;
using Bifrost.Configuration.Assemblies;
using Bifrost.Execution;
using Moq;

namespace Bifrost.Specs.Execution.for_AssemblySpecifiers
{
    public class TestSpecifier : ICanSpecifyAssemblies
    {
        [ThreadStatic]
        public static Mock<ICanSpecifyAssemblies> Mock;

        public void Specify(IAssembliesConfiguration configuration)
        {
            Mock.Object.Specify(configuration);
        }
    }
}