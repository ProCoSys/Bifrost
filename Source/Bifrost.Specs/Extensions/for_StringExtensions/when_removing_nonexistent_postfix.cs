using Bifrost.Extensions;
using Machine.Specifications;

namespace Bifrost.Specs.Extensions.for_StringExtensions
{
    public class when_removing_nonexistent_postfix
    {
        static string result;

        Because of = () => result = "AStringWithJustFix".RemovePostfix("Postfix");

        It should_not_do_anything = () => result.ShouldEqual("AStringWithJustFix");
    }
}
