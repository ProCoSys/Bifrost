using Bifrost.Configuration;
using Machine.Specifications;
using Moq;
using It = Machine.Specifications.It;

namespace Bifrost.Specs.Configuration.for_Configure
{
    public class when_initializing : given.a_configure_instance
    {
        Because of = () => configure_instance.Initialize();

        It should_call_i_can_configure = () =>
            GetMock<ICanConfigure>().Verify(e => e.Configure(configure_instance), Times.Once());

        It should_save_container = () =>
            configure_instance.Container.ShouldEqual(container_mock.Object);

        It should_call_initialize_on_commands_configuration = () =>
            GetMock<ICommandsConfiguration>().Verify(c => c.Initialize(configure_instance.Container), Times.Once());

        It should_save_commands_configuration = () =>
            configure_instance.Commands.ShouldEqual(Get<ICommandsConfiguration>());

        It should_call_initialize_on_events_configuration = () =>
            GetMock<IEventsConfiguration>().Verify(e => e.Initialize(configure_instance.Container), Times.Once());

        It should_save_events_configuration = () =>
            configure_instance.Events.ShouldEqual(Get<IEventsConfiguration>());

        It should_call_initialize_on_task_configuration = () =>
            GetMock<ITasksConfiguration>().Verify(e => e.Initialize(configure_instance.Container), Times.Once());

        It should_save_task_configuration = () =>
            configure_instance.Tasks.ShouldEqual(Get<ITasksConfiguration>());

        It should_call_initialize_on_views_configuration = () =>
            GetMock<IViewsConfiguration>().Verify(e => e.Initialize(configure_instance.Container), Times.Once());

        It should_save_views_configuration = () =>
            configure_instance.Views.ShouldEqual(Get<IViewsConfiguration>());

        It should_call_initialize_on_sagas_configuration = () =>
            GetMock<ISagasConfiguration>().Verify(e => e.Initialize(configure_instance.Container), Times.Once());

        It should_save_sagas_configuration = () =>
            configure_instance.Sagas.ShouldEqual(Get<ISagasConfiguration>());

        It should_call_initialize_on_serialization_configuration = () =>
            GetMock<ISerializationConfiguration>().Verify(e => e.Initialize(configure_instance.Container), Times.Once());

        It should_save_serialization_configuration = () =>
            configure_instance.Serialization.ShouldEqual(Get<ISerializationConfiguration>());

        It should_call_initialize_on_default_storage_configuration = () =>
            GetMock<IDefaultStorageConfiguration>().Verify(d => d.Initialize(configure_instance.Container), Times.Once());

        It should_save_default_storage_configuration = () =>
            configure_instance.DefaultStorage.ShouldEqual(Get<IDefaultStorageConfiguration>());

        It should_call_initialize_on_frontend_configuration = () =>
            GetMock<IFrontendConfiguration>().Verify(d => d.Initialize(configure_instance.Container), Times.Once());

        It should_save_frontend_configuration = () =>
            configure_instance.Frontend.ShouldEqual(Get<IFrontendConfiguration>());

        It should_call_initialize_on_call_context_configuration = () =>
            GetMock<ICallContextConfiguration>().Verify(d => d.Initialize(configure_instance.Container), Times.Once());

        It should_save_call_context_configuration = () =>
            configure_instance.CallContext.ShouldEqual(Get<ICallContextConfiguration>());

        It should_call_initialize_on_execution_context_configuration = () =>
            GetMock<IExecutionContextConfiguration>().Verify(d => d.Initialize(configure_instance.Container), Times.Once());

        It should_save_execution_context_configuration = () =>
            configure_instance.ExecutionContext.ShouldEqual(Get<IExecutionContextConfiguration>());

        It should_call_initialize_on_security_configuration = () =>
            GetMock<ISecurityConfiguration>().Verify(d => d.Initialize(configure_instance.Container), Times.Once());

        It should_save_security_configuration = () =>
            configure_instance.Security.ShouldEqual(Get<ISecurityConfiguration>());

        It should_call_i_want_to_know_when_configuration_is_done = () =>
            GetMock<IWantToKnowWhenConfigurationIsDone>().Verify(e => e.Configured(configure_instance), Times.Once());
    }
}
