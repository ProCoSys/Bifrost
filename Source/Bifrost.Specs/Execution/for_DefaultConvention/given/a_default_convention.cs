using Bifrost.Bootstrap;
using Bifrost.Execution;
using Bifrost.Testing;
using Machine.Specifications;

namespace Bifrost.Specs.Execution.for_DefaultConvention.given
{
    public class a_default_convention : dependency_injection
    {
        protected static DefaultConvention convention;

        Establish context = () =>
        {
            GetMock<IImplementorFinder>()
                .Setup(m => m.GetImplementorsFor(typeof(ISomethingWithMultipleImplementations)))
                .Returns(
                    new[]
                    {
                        typeof(SomethingWithMultipleImplementations),
                        typeof(SomethingWithMultipleImplementationsSecond),
                    });

            GetMock<IImplementorFinder>()
                .Setup(m => m.GetImplementorsFor(typeof(ISomething)))
                .Returns(new[] { typeof(Something) });
            convention = Get<DefaultConvention>();
        };
    }
}
