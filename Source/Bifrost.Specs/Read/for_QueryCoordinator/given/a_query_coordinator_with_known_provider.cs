using System;
using Bifrost.Execution;
using Bifrost.Read;
using Bifrost.Security;
using Machine.Specifications;
using Moq;

namespace Bifrost.Specs.Read.for_QueryCoordinator.given
{
    public class a_query_coordinator_with_known_provider : a_query_coordinator
    {
        protected static Mock<IQueryProviderFor<QueryType>> query_provider_mock;
        protected static QueryCoordinator coordinator;
        protected static Type provider_type;

        Establish context = () =>
        {
            query_provider_mock = new Mock<IQueryProviderFor<QueryType>>();
            provider_type = query_provider_mock.Object.GetType();

            GetMock<ITypeDiscoverer>()
                .Setup(t => t.FindMultiple(typeof (IQueryProviderFor<>)))
                .Returns(new[] {provider_type});
            GetMock<IContainer>().Setup(c => c.Get(provider_type)).Returns(query_provider_mock.Object);
            GetMock<IFetchingSecurityManager>()
                .Setup(f => f.Authorize(Moq.It.IsAny<IQuery>()))
                .Returns(new AuthorizationResult());

            coordinator = GetNew<QueryCoordinator>();
        };
    }
}