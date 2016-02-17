using Bifrost.Sagas;
using Bifrost.Testing;
using Machine.Specifications;

namespace Bifrost.Specs.Sagas.for_SagaNarrator.given
{
    public class a_saga_narrator : dependency_injection
    {
        protected static SagaNarrator narrator;

        Establish context = () => narrator = Get<SagaNarrator>();
    }
}