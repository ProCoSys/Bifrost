using Bifrost.Extensions;
using Machine.Specifications;

namespace Bifrost.Specs.Extensions.for_StringExtensions
{
    public class when_removing_postfix_from_empty_string
    {
        static string result;

        Because of = () => result = string.Empty.RemovePostfix("xyz");

        It should_return_the_empty_string = () => result.ShouldBeEmpty();
    }
}
