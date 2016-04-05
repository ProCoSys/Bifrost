using System;
using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Types.for_TypeCollector
{
    public sealed class when_bootstrapping_container_with_no_types : given.a_type_collector
    {
        static Exception exception;

        Because of = () => exception = Catch.Only<NoTypesFoundException>(() => type_collector.BootstrapContainer());

        It should_throw_exception = () => exception.ShouldNotBeNull();
    }
}
