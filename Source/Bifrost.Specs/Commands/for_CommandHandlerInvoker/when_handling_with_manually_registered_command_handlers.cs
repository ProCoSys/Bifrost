using System;
using Bifrost.Commands;
using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Commands.for_CommandHandlerInvoker
{
    [Subject(Subjects.handling_commands)]
    public class when_handling_with_manually_registered_command_handlers : given.a_command_handler_invoker
    {
        static bool result;

        Establish context = () =>
        {
            GetMock<ITypeDiscoverer>()
                .Setup(t => t.FindMultiple<IHandleCommands>())
                .Returns(new Type[0]);
            GetMock<IContainer>()
                .Setup(c => c.Get(typeof(CommandHandler)))
                .Returns(new CommandHandler());

            invoker.Register(typeof(CommandHandler));
        };

        Because of = () =>
        {
            var command = new Command();
            result = invoker.TryHandle(command);
        };

        It should_return_true_when_trying_to_handle = () => result.ShouldBeTrue();
    }
}
