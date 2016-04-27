using Bifrost.Bootstrap.Defaults;
using Bifrost.Testing;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Defaults.for_DefaultBootstrapConfiguration.given
{
    public class a_default_bootstrap_configuration : dependency_injection
    {
        protected static DefaultBootstrapConfiguration configuration;

        Establish context = () => configuration = new DefaultBootstrapConfiguration();
    }
}
