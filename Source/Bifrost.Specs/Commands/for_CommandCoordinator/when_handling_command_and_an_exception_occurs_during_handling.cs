﻿using System;
using System.ComponentModel.DataAnnotations;
using Bifrost.Commands;
using Bifrost.Exceptions;
using Machine.Specifications;

namespace Bifrost.Specs.Commands.for_CommandCoordinator
{
    [Subject(typeof (CommandCoordinator))]
    public class when_handling_command_and_an_exception_occurs_during_handling : given.a_command_coordinator
    {
        static CommandResult result;
        static Exception exception;

        Establish context = () =>
        {
            exception = new Exception();
            var validationResults = new CommandValidationResult {ValidationResults = new ValidationResult[0]};
            GetMock<ICommandValidators>().Setup(cvs => cvs.Validate(command)).Returns(validationResults);
            GetMock<ICommandHandlerManager>().Setup(c => c.Handle(Moq.It.IsAny<ICommand>())).Throws(exception);
        };

        Because of = () => result = coordinator.Handle(command);

        It should_have_validated_the_command = () => GetMock<ICommandValidators>().VerifyAll();
        It should_have_authenticated_the_command = () => GetMock<ICommandSecurityManager>().VerifyAll();
        It should_have_exception_in_result = () => result.Exception.ShouldEqual(exception);
        It should_have_success_set_to_false = () => result.Success.ShouldBeFalse();
        It should_have_published_the_exception = () => GetMock<IExceptionPublisher>().Verify(m => m.Publish(exception));
    }
}