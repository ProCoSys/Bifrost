using System;
using Bifrost.Bootstrap.Types;
using Bifrost.Execution;
using Machine.Specifications;
using Moq;
using It = Machine.Specifications.It;

namespace Bifrost.Specs.Bootstrap.Types.for_AutoBinder
{
    [Subject(typeof(AutoBinder))]
    public class when_binding_object : given.an_auto_binder
    {
        static readonly object obj = new object();

        Because of = () => auto_binder.Bind(obj);

        It should_not_bind_the_object = () =>
            GetMock<IContainer>().Verify(m => m.Bind(Moq.It.IsAny<Type>(), obj), Times.Never);
    }
}
