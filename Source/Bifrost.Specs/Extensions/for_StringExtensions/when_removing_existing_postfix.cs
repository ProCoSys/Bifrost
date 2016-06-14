using Bifrost.Extensions;
using Machine.Specifications;

namespace Bifrost.Specs.Extensions.for_StringExtensions
{
    public class when_removing_existing_postfix
    {
        static string result;

        Because of = () => result = "AStringWithPostfix".RemovePostfix("Postfix");

        It should_remove_the_postfix = () => result.ShouldEqual("AStringWith");
    }
}
