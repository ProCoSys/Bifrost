using System;
using Bifrost.Commands;
using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Commands.for_CommandHandlerInvoker
{
    [Subject(Subjects.handling_commands)]
    public class when_handling_with_no_command_handlers : given.a_command_handler_invoker
    {
        protected static bool result;

        Because of = () =>
        {
            GetMock<ITypeDiscoverer>()
                .Setup(t => t.FindMultiple<IHandleCommands>())
                .Returns(new Type[0]);
            result = invoker.TryHandle(new Command());
        };

        It should_return_false_when_trying_to_handle = () => result.ShouldBeFalse();
    }
}
