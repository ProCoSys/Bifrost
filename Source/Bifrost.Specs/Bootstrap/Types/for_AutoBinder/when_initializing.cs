using Bifrost.Bootstrap.Types;
using Bifrost.Execution;
using Machine.Specifications;
using Moq;
using It = Machine.Specifications.It;

namespace Bifrost.Specs.Bootstrap.Types.for_AutoBinder
{
    [Subject(typeof(AutoBinder))]
    public class when_initializing : given.an_auto_binder
    {
        static readonly object obj = new object();

        Because of = () => auto_binder.Bind(obj);

        It should_bind_the_container = () =>
            GetMock<IContainer>().Verify(m => m.Bind(typeof(IContainer), Get<IContainer>()), Times.Once);

        It should_bind_itself = () =>
            GetMock<IContainer>().Verify(m => m.Bind(typeof(IAutoBinder), auto_binder), Times.Once);
    }
}
