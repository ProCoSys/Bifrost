using System;
using System.Collections.Generic;
using Machine.Specifications;

namespace Bifrost.Web.Specs.Services.for_RestServiceMethodInvoker
{
    public class when_invoking_and_method_does_not_exist : given.a_rest_service_method_invoker
    {
        const string base_url = "ServiceWithoutMethod";
        const string method_name = "SomeMethod";
        static ServiceWithoutMethods service_instance;
        static Uri uri;
        static IDictionary<string, string> parameters;

        static Exception exception;

        Establish context = () =>
        {
            service_instance = new ServiceWithoutMethods();
            uri = new Uri($"http://localhost/{base_url}/{method_name}");
            parameters = new Dictionary<string, string>();
        };

        Because of = () =>
            exception = Catch.Exception(() => invoker.Invoke(base_url, service_instance, uri, parameters));

        It should_throw_missing_method_exception = () => exception.ShouldBeOfExactType<MissingMethodException>();
    }
}
