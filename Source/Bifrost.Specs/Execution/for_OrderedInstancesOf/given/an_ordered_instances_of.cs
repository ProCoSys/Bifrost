using System.Collections.Generic;
using Bifrost.Execution;
using Bifrost.Testing;
using Machine.Specifications;

namespace Bifrost.Specs.Execution.for_OrderedInstancesOf.given
{
    public class an_ordered_instances_of : dependency_injection
    {
        public interface IDummy { }

        protected static OrderedInstancesOf<IDummy> ordered_instances_of;

        protected static IDummy[] result;

        Establish context = () => ordered_instances_of = Get<OrderedInstancesOf<IDummy>>();

        protected static void Register(params IDummy[] instances)
        {
            GetMock<IInstancesOf<IDummy>>()
                .Setup(m => m.GetEnumerator())
                .Returns(((IEnumerable<IDummy>) instances).GetEnumerator());
        }
    }
}
