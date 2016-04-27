using Bifrost.Configuration;
using Bifrost.Execution;
using Bifrost.Testing;
using Machine.Specifications;
using Moq;

namespace Bifrost.Specs.Configuration.for_Configure.given
{
    public class a_configure_instance : dependency_injection
    {
        protected static Configure configure_instance;
        protected static Mock<IContainer> container_mock;

        Establish context = () =>
        {
            Configure.Reset();
            container_mock = new Mock<IContainer>();

            container_mock.Setup(c => c.Get<ICommandsConfiguration>()).Returns(Get<ICommandsConfiguration>());
            container_mock.Setup(c => c.Get<IEventsConfiguration>()).Returns(Get<IEventsConfiguration>());
            container_mock.Setup(c => c.Get<ITasksConfiguration>()).Returns(Get<ITasksConfiguration>());
            container_mock.Setup(c => c.Get<IViewsConfiguration>()).Returns(Get<IViewsConfiguration>());
            container_mock.Setup(c => c.Get<ISagasConfiguration>()).Returns(Get<ISagasConfiguration>());
            container_mock.Setup(c => c.Get<ISerializationConfiguration>()).Returns(Get<ISerializationConfiguration>());
            container_mock.Setup(c => c.Get<IDefaultStorageConfiguration>()).Returns(Get<IDefaultStorageConfiguration>());
            container_mock.Setup(c => c.Get<IFrontendConfiguration>()).Returns(Get<IFrontendConfiguration>());
            container_mock.Setup(c => c.Get<ICallContextConfiguration>()).Returns(Get<ICallContextConfiguration>());
            container_mock.Setup(c => c.Get<IExecutionContextConfiguration>()).Returns(Get<IExecutionContextConfiguration>());
            container_mock.Setup(c => c.Get<ISecurityConfiguration>()).Returns(Get<ISecurityConfiguration>());

            container_mock
                .Setup(c => c.Get<IInstancesOf<ICanConfigure>>())
                .Returns(new[] { Get<ICanConfigure>() }.AsInstancesOf());
            container_mock
                .Setup(c => c.Get<IInstancesOf<IWantToKnowWhenConfigurationIsDone>>())
                .Returns(new[] { Get<IWantToKnowWhenConfigurationIsDone>() }.AsInstancesOf());

            configure_instance = Configure.With(container_mock.Object);
        };
    }
}
