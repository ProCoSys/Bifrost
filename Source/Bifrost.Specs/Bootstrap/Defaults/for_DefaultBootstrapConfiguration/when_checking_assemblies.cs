using System.Collections.Generic;
using System.Linq;
using Bifrost.Bootstrap.Defaults;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Defaults.for_DefaultBootstrapConfiguration
{
    [Subject(typeof(DefaultBootstrapConfiguration))]
    public class when_checking_assemblies : given.a_default_bootstrap_configuration
    {
        static IEnumerable<bool> results;

        Because of = () =>
        {
            results = new[]
            {
                "mscorlib.dll",
                "x",
                "Bifrost.dll",
                "just_a_random_string",
                "",
            }
                .Select(configuration.AssembliesConfiguration.Specification.IsSatisfiedBy);
        };

        It should_include_none = () => results.ShouldNotContain(true);
    }
}
