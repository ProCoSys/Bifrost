using System;
using Machine.Specifications;

namespace Bifrost.Web.Specs.Services.for_RestServiceMethodInvoker
{
    public class when_invoking_with_many_underscore_parameters_and_target_method_has_no_parameter
        : given.a_rest_service_method_invoker_and_a_service_call
    {
        static Exception exception;

        Establish context = () =>
        {
            uri = new Uri($"http://localhost/{base_url}/{ServiceWithMethods.NoInputOrOutputMethod}");
            parameters.Add("_", "Something");
            parameters.Add("_foo", "SomethingElse");
            parameters.Add("__bar_baz", "ShouldBeIgnored");
        };

        Because of = () => exception =
            Catch.Exception(() => invoker.Invoke(base_url, service_instance, uri, parameters));

        It should_not_throw_parameter_count_mismatch_exception = () => exception.ShouldBeNull();
    }
}
