using System.Collections.Generic;
using System.Collections.Specialized;
using Bifrost.Extensions;
using Machine.Specifications;

namespace Bifrost.Specs.Extensions.for_NameValueCollectionExtensions
{
    [Subject(typeof(NameValueCollectionExtensions))]
    public class when_converting_empty_collection
    {
        static IDictionary<string, string> result;

        Because of = () => result = new NameValueCollection().ToDictionary();

        It should_create_empty_dictionary = () => result.ShouldBeEmpty();
    }
}
