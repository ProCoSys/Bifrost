using Bifrost.Bootstrap.Types;
using Bifrost.Execution;
using Machine.Specifications;
using Moq;
using It = Machine.Specifications.It;

namespace Bifrost.Specs.Bootstrap.Types.for_AutoBinder
{
    [Subject(typeof(AutoBinder))]
    public class when_binding_an_object_in_a_type_hierarchy : given.an_auto_binder
    {
        interface I1 { }

        interface I2 : I1 { }

        interface I3 { }

        abstract class A : I2 { }

        class B : A, I3 { }

        static readonly B obj = new B();

        Because of = () => auto_binder.Bind(obj);

        It should_not_bind_the_concrete_class = () =>
            GetMock<IContainer>().Verify(m => m.Bind(typeof(B), obj), Times.Never);

        It should_bind_the_abstract_class = () =>
            GetMock<IContainer>().Verify(m => m.Bind(typeof(A), obj), Times.Once);

        It should_bind_the_direct_interface = () =>
            GetMock<IContainer>().Verify(m => m.Bind(typeof(I3), obj), Times.Once);

        It should_bind_the_indirect_interface = () =>
            GetMock<IContainer>().Verify(m => m.Bind(typeof(I2), obj), Times.Once);

        It should_bind_the_root_interface = () =>
            GetMock<IContainer>().Verify(m => m.Bind(typeof(I1), obj), Times.Once);
    }
}
