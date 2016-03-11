using Bifrost.Commands;
using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Commands.for_CommandHandlerInvoker
{
    [Subject(Subjects.handling_commands)]
    public class when_handling_with_automatically_discovered_command_handlers : given.a_command_handler_invoker
    {
        static bool result;

        Because of = () =>
        {
            GetMock<ITypeDiscoverer>()
                .Setup(t => t.FindMultiple<IHandleCommands>())
                .Returns(new[] { typeof(CommandHandler) });
            GetMock<IContainer>()
                .Setup(c => c.Get(typeof(CommandHandler)))
                .Returns(new CommandHandler());
            result = invoker.TryHandle(new Command());
        };

        It should_return_true_when_trying_to_handle = () => result.ShouldBeTrue();
    }
}
