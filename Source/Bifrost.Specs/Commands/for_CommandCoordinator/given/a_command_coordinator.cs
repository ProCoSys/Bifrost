using Bifrost.Commands;
using Bifrost.Globalization;
using Bifrost.Security;
using Bifrost.Testing;
using Machine.Specifications;
using Moq;

namespace Bifrost.Specs.Commands.for_CommandCoordinator.given
{
    public abstract class a_command_coordinator : dependency_injection
    {
        protected static CommandCoordinator coordinator;
        protected static ICommand command;

        Establish context = () =>
        {
            GetMock<ICommandContextManager>()
                .Setup(c => c.EstablishForCommand(Moq.It.IsAny<ICommand>()))
                .Returns(GetMock<ICommandContext>().Object);

            GetMock<ICommandSecurityManager>()
                .Setup(s => s.Authorize(Moq.It.IsAny<ICommand>()))
                .Returns(new AuthorizationResult());

            GetMock<ILocalizer>().Setup(l => l.BeginScope()).Returns(LocalizationScope.FromCurrentThread);

            coordinator = Get<CommandCoordinator>();

            command = Mock.Of<ICommand>();
        };
    }
}