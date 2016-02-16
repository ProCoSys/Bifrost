using System;
using Bifrost.Execution;
using Bifrost.Read;
using Bifrost.Security;
using Machine.Specifications;
using Moq;

namespace Bifrost.Specs.Read.for_QueryCoordinator.given
{
    public class a_query_coordinator_with_provider_for_known_query_and_one_for_derived_type : a_query_coordinator
    {
        protected static Mock<IQueryProviderFor<QueryType>> query_provider_mock;
        protected static QueryCoordinator coordinator;
        protected static Type provider_type;
        protected static QueryProviderForDerivedType query_provider_for_derived_type;

        Establish context = () =>
        {
            query_provider_mock = new Mock<IQueryProviderFor<QueryType>>();
            provider_type = query_provider_mock.Object.GetType();

            query_provider_for_derived_type = new QueryProviderForDerivedType();

            GetMock<ITypeDiscoverer>()
                .Setup(t => t.FindMultiple(typeof (IQueryProviderFor<>)))
                .Returns(new[] {provider_type, typeof (QueryProviderForDerivedType)});
            GetMock<IContainer>().Setup(c => c.Get(provider_type)).Returns(query_provider_mock.Object);
            GetMock<IContainer>()
                .Setup(c => c.Get(typeof (QueryProviderForDerivedType)))
                .Returns(query_provider_for_derived_type);

            GetMock<IFetchingSecurityManager>()
                .Setup(f => f.Authorize(Moq.It.IsAny<IQuery>()))
                .Returns(new AuthorizationResult());

            coordinator = GetNew<QueryCoordinator>();
        };
    }
}