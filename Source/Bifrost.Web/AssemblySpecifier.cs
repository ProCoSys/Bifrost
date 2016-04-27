using Bifrost.Configuration.Assemblies;

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
