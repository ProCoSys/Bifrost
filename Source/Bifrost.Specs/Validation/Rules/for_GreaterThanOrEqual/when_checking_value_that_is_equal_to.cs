﻿using Bifrost.Rules;
using Bifrost.Validation.Rules;
using Machine.Specifications;
using Moq;
using It = Machine.Specifications.It;

namespace Bifrost.Specs.Validation.Rules.for_GreaterThanOrEqual
{
    public class when_checking_value_that_is_equal_to
    {
        static double value = 42.0;
        static GreaterThanOrEqual<double> rule;
        static Mock<IRuleContext> rule_context_mock;

        Establish context = () =>
        {
            rule = new GreaterThanOrEqual<double>(null, value);
            rule_context_mock = new Mock<IRuleContext>();
        };

        Because of = () => rule.Evaluate(rule_context_mock.Object, value);

        It should_not_fail = () => rule_context_mock.Verify(r => r.Fail(rule, value, Moq.It.IsAny<BrokenRuleReason>()), Times.Never());
    }
}
