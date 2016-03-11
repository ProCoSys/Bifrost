using Bifrost.Commands;
using Bifrost.Testing;
using Machine.Specifications;

namespace Bifrost.Specs.Commands.for_CommandHandlerInvoker.given
{
    public class a_command_handler_invoker : dependency_injection
    {
        protected static CommandHandlerInvoker invoker;

        Establish context = () =>
        {
            invoker = Get<CommandHandlerInvoker>();
        };
    }
}
