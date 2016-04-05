using Bifrost.Bootstrap;
using Bifrost.Bootstrap.Types;
using Bifrost.Configuration;
using Bifrost.Conventions;
using Bifrost.Execution;
using Machine.Specifications;
using Moq;
using It = Machine.Specifications.It;

namespace Bifrost.Specs.Bootstrap.Types.for_TypeCollector
{
    public sealed class when_bootstrapping_container_from_implementor_finder : given.a_type_collector
    {
        static Mock<IContainer> container_mock;
        static IContainer container;

        interface I { }

        class X : I { }

        Because of = () =>
        {
            container_mock = new Mock<IContainer>();
            TestContainerCreator.SetContainer(container_mock);
            type_collector.Get<X>();
            Feed(typeof(TestImplementorFinder), typeof(TestCollectTypes));
            container = type_collector.BootstrapContainer();
        };

        It should_create_container = () => container.ShouldEqual(container_mock.Object);

        It should_bind_the_auto_binder = () =>
            container_mock.Verify(m => m.Bind(typeof(IAutoBinder), Moq.It.IsAny<AutoBinder>()), Times.Once);

        It should_bind_the_container_creator = () =>
            container_mock.Verify(m => m.Bind(typeof(ICanCreateContainer), TestContainerCreator.LastCreated), Times.Once);

        It should_bind_the_container = () =>
            container_mock.Verify(m => m.Bind(typeof(IContainer), container), Times.Once);

        It should_bind_the_type_collector = () =>
            container_mock.Verify(m => m.Bind(typeof(ITypeCollector), type_collector), Times.Once);

        It should_bind_the_implementor_finder = () =>
            container_mock.Verify(m => m.Bind(typeof(IImplementorFinder), TestImplementorFinder.LastCreated), Times.Once);

        It should_bind_the_collect_types = () =>
            container_mock.Verify(m => m.Bind(typeof(ICollectTypes), TestCollectTypes.LastCreated), Times.Once);

        It should_bind_the_created_type = () =>
            container_mock.Verify(m => m.Bind(typeof(I), Moq.It.IsAny<X>()), Times.Once);

        It should_not_bind_the_implementation = () =>
            container_mock.Verify(m => m.Bind(typeof(X), Moq.It.IsAny<X>()), Times.Never);
    }
}
