using Bifrost.Extensions;
using Machine.Specifications;

namespace Bifrost.Specs.Extensions.for_StringExtensions
{
    public class when_removing_existing_prefix
    {
        static string result;

        Because of = () => result = "PrefixToAString".RemovePrefix("Prefix");

        It should_remove_the_prefix = () => result.ShouldEqual("ToAString");
    }
}
