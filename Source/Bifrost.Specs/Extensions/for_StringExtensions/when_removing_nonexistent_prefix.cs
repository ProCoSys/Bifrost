using Bifrost.Extensions;
using Machine.Specifications;

namespace Bifrost.Specs.Extensions.for_StringExtensions
{
    public class when_removing_nonexistent_prefix
    {
        static string result;

        Because of = () => result = "PreString".RemovePrefix("Prefix");

        It should_not_do_anything = () => result.ShouldEqual("PreString");
    }
}
