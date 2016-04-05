using Bifrost.Bootstrap.Types;
using Bifrost.Testing;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Types.for_AutoBinder.given
{
    public class an_auto_binder : dependency_injection
    {
        protected static AutoBinder auto_binder;

        Establish context = () => auto_binder = Get<AutoBinder>();
    }
}
