using System;
using System.Collections.Generic;
using System.Linq;
using Bifrost.Execution;
using Machine.Specifications;

namespace Bifrost.Specs.Bootstrap.Types.for_TypeCollector
{
    public sealed class when_feeding_duplicate_types : given.a_type_collector
    {
        class X { }

        static IEnumerable<Type> types;

        static Exception exception;

        Because of = () =>
        {
            Feed(typeof(X), typeof(X));
            types = type_collector.Types;
            exception = Catch.Only<MultipleTypesFoundException>(() => type_collector.ByFullName(typeof(X).FullName));
        };

        It should_list_both_types = () => types.Count().ShouldEqual(2);

        It should_throw_exception_when_retrieving = () => exception.ShouldNotBeNull();
    }
}
