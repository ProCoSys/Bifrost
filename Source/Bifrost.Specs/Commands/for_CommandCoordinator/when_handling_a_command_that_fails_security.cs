using Bifrost.Commands;
using Bifrost.Security;
using Bifrost.Testing.Fakes.Commands;
using Machine.Specifications;
using Moq;
using It = Machine.Specifications.It;

namespace Bifrost.Specs.Commands.for_CommandCoordinator
{
    [Subject(typeof(CommandCoordinator))]
    public class when_handling_a_command_that_fails_security : given.a_command_coordinator
    {
        static CommandResult result;
        static Mock<AuthorizationResult> authorization_result;

        Establish context = () =>
        {
            authorization_result = new Mock<AuthorizationResult>();
            authorization_result.Setup(r => r.IsAuthorized).Returns(false);
            authorization_result.Setup(r => r.BuildFailedAuthorizationMessages()).Returns(new[] { "Something went wrong" });
            command = new SimpleCommand();
            GetMock<ICommandSecurityManager>()
                .Setup(c => c.Authorize(command))
                .Returns(authorization_result.Object);
        };

        Because of = () => result = coordinator.Handle(command);

        It should_not_validate = () => GetMock<ICommandValidators>().Verify(c => c.Validate(command), Times.Never());
        It should_set_not_passed_in_command_result = () => result.PassedSecurity.ShouldBeFalse();
        It should_rollback_the_command_context = () => GetMock<ICommandContext>().Verify(c => c.Rollback(), Times.Once());
    }
}
