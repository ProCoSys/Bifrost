using Bifrost.Web.Services;
using Machine.Specifications;

namespace Bifrost.Web.Specs.Services.for_RestServiceMethodInvoker
{
    public class when_invoking_with_an_invalid_concept_int_as_a_parameter
        : given.a_rest_service_method_invoker_and_a_service_call_for_int_concept_input_and_no_output
    {
        const string invalid = "x42";

        static HttpStatus.HttpStatusException exception;

        Establish context = () => parameters.Add("input", invalid);

        Because of = () =>
            exception =
                Catch.Only<HttpStatus.HttpStatusException>(
                    () => invoker.Invoke(base_url, service_instance, uri, parameters));

        It should_throw_exception = () => exception.ShouldNotBeNull();
    }
}
