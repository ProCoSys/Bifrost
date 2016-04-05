using System.Collections.Generic;
using System.Linq;
using Bifrost.Bootstrap.Defaults;
using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Defaults.for_DefaultBootstrapConfiguration
{
    [Subject(typeof(DefaultBootstrapConfiguration))]
    public class when_checking_types : given.a_default_bootstrap_configuration
    {
        static IEnumerable<bool> results;

        Because of = () =>
        {
            results = new[]
            {
                typeof(string),
                typeof(when_checking_types),
                typeof(DefaultBootstrapConfiguration),
                typeof(ImplementorFinder),
            }
                .Select(configuration.TypesConfiguration.Specification.IsSatisfiedBy);
        };

        It should_include_all = () => results.ShouldNotContain(false);
    }
}
