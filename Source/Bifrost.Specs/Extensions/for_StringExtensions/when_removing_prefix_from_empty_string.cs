using Bifrost.Extensions;
using Machine.Specifications;

namespace Bifrost.Specs.Extensions.for_StringExtensions
{
    public class when_removing_prefix_from_empty_string
    {
        static string result;

        Because of = () => result = string.Empty.RemovePrefix("xyz");

        It should_return_the_empty_string = () => result.ShouldBeEmpty();
    }
}
