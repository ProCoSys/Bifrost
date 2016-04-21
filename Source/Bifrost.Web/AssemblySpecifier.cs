using Bifrost.Configuration.Assemblies;
using Bifrost.Execution;

namespace Bifrost.Web
{
    public class AssemblySpecifier : ICanSpecifyAssemblies
    {
        public void Specify(IAssembliesConfiguration configuration)
        {
            configuration.IncludeAssembliesStartingWith("Web");
        }
    }
}
