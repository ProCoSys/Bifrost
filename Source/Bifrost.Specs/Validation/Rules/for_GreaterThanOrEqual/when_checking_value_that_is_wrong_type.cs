﻿using System;
using Bifrost.Rules;
using Bifrost.Validation;
using Bifrost.Validation.Rules;
using Machine.Specifications;
using Moq;
using It = Machine.Specifications.It;

namespace Bifrost.Specs.Validation.Rules.for_GreaterThanOrEqual
{
    public class when_checking_value_that_is_wrong_type
    {
        static GreaterThanOrEqual<double> rule;
        static Mock<IRuleContext> rule_context_mock;
        static Exception exception;

        Establish context = () =>
        {
            rule = new GreaterThanOrEqual<double>(null, 42.0);
            rule_context_mock = new Mock<IRuleContext>();
        };

        Because of = () => rule.Evaluate(rule_context_mock.Object, "string");

        It should_fail_with_wrong_type_as_reason = () => rule_context_mock.Verify(r => r.Fail(rule, Moq.It.IsAny<object>(), ValueRule.ValueTypeMismatch), Times.Once());
    }
}
