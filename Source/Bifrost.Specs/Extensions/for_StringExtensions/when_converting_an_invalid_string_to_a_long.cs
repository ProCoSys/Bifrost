using Bifrost.Extensions;
using Machine.Specifications;

namespace Bifrost.Specs.Extensions.for_StringExtensions
{
    [Subject(typeof(StringExtensions))]
    public class when_converting_an_invalid_string_to_a_long
    {
        static string invalid_string;
        static ConvertException exception;

        Establish context = () => invalid_string = "xyz";

        Because of = () => exception = Catch.Only<ConvertException>(() => invalid_string.ParseTo(typeof(long)));

        It should_throw_exception = () => exception.ShouldNotBeNull();
        It should_include_error_message = () => exception.Message.ShouldContain(invalid_string);
    }
}
