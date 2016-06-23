using System.Collections.Generic;
using System.Collections.Specialized;
using Bifrost.Extensions;
using Machine.Specifications;

namespace Bifrost.Specs.Extensions.for_NameValueCollectionExtensions
{
    [Subject(typeof(NameValueCollectionExtensions))]
    public class when_converting_collection_with_two_values
    {
        static IDictionary<string, string> result;

        Because of = () => result = new NameValueCollection { { "A", "3" }, { "X", "4" } }.ToDictionary();

        It should_create_dictionary_with_two_values = () => result.Count.ShouldEqual(2);

        It should_convert_first_value = () => result["A"].ShouldEqual("3");

        It should_convert_second_value = () => result["X"].ShouldEqual("4");
    }
}
