using Bifrost.Extensions;
using Machine.Specifications;

namespace Bifrost.Specs.Extensions.for_StringExtensions
{
    [Subject(typeof(StringExtensions))]
    public class when_converting_an_overflowing_short
    {
        static string invalid_string;
        static ConvertException exception;

        Establish context = () => invalid_string = (1 << 17).ToString();

        Because of = () => exception = Catch.Only<ConvertException>(() => invalid_string.ParseTo(typeof(short)));

        It should_throw_exception = () => exception.ShouldNotBeNull();
        It should_include_error_message = () => exception.Message.ShouldContain(invalid_string);
    }
}
