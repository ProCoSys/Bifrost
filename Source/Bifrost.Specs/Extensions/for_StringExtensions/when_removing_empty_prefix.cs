using Bifrost.Extensions;
using Machine.Specifications;

namespace Bifrost.Specs.Extensions.for_StringExtensions
{
    public class when_removing_empty_prefix
    {
        static string result;

        Because of = () => result = "TheString".RemovePrefix(string.Empty);

        It should_return_the_string = () => result.ShouldEqual("TheString");
    }
}
