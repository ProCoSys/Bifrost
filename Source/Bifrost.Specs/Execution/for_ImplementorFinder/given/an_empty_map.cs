using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Execution.for_ImplementorFinder.given
{
    public class an_empty_map
    {
        protected static ImplementorFinder map;

        Establish context = () => map = new ImplementorFinder();
    }
}
