using System.Linq;
using Bifrost.Execution;
using Bifrost.Testing;

namespace Bifrost.Specs.Execution.for_OrderedInstancesOf.given
{
    public class an_ordered_instances_of : dependency_injection
    {
        public interface IDummy { }

        protected static OrderedInstancesOf<IDummy> ordered_instances_of;

        protected static IDummy[] result;

        protected static void Register(params IDummy[] instances)
        {
            GetMock<ITypeDiscoverer>()
                .Setup(m => m.FindMultiple<IDummy>())
                .Returns(instances.Select(i => i.GetType()));
            foreach (var instance in instances)
            {
                GetMock<IContainer>()
                    .Setup(m => m.Get(instance.GetType()))
                    .Returns(instance);
            }

            ordered_instances_of = Get<OrderedInstancesOf<IDummy>>();
        }
    }
}
