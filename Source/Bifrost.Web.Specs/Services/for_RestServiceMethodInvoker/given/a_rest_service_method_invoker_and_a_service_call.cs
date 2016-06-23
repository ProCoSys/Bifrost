using System;
using System.Collections.Generic;
using Machine.Specifications;

namespace Bifrost.Web.Specs.Services.for_RestServiceMethodInvoker.given
{
    public class a_rest_service_method_invoker_and_a_service_call : a_rest_service_method_invoker
    {
        protected const string base_url = "ServiceWithMethods";
        protected static ServiceWithMethods service_instance;
        protected static Uri uri;
        protected static IDictionary<string, string> parameters;

        Establish context = () =>
        {
            service_instance = new ServiceWithMethods();
            uri = new Uri($"http://localhost/{base_url}/{ServiceWithMethods.ComplexInputNoOutputMethod}");
            parameters = new Dictionary<string, string>();
        };
    }
}
