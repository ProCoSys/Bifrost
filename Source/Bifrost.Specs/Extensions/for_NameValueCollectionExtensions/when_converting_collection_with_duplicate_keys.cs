using System.Collections.Generic;
using System.Collections.Specialized;
using Bifrost.Extensions;
using Machine.Specifications;

namespace Bifrost.Specs.Extensions.for_NameValueCollectionExtensions
{
    [Subject(typeof(NameValueCollectionExtensions))]
    public class when_converting_collection_with_duplicate_keys
    {
        static IDictionary<string, string> result;

        Because of = () => result = new NameValueCollection { { "A", "3" }, { "A", "4" } }.ToDictionary();

        It should_create_dictionary_with_one_value = () => result.Count.ShouldEqual(1);

        It should_concatenate_values = () => result["A"].ShouldEqual("3,4");
    }
}
