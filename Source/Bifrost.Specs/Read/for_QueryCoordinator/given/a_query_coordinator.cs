using Bifrost.Read;
using Bifrost.Read.Validation;
using Bifrost.Rules;
using Bifrost.Security;
using Bifrost.Testing;
using Machine.Specifications;

namespace Bifrost.Specs.Read.for_QueryCoordinator.given
{
    public class a_query_coordinator : dependency_injection
    {
        protected static QueryCoordinator coordinator;
        protected static QueryValidationResult validation_result;

        Establish context = () =>
        {
            GetMock<IFetchingSecurityManager>()
                .Setup(f => f.Authorize(Moq.It.IsAny<IQuery>()))
                .Returns(new AuthorizationResult());
            validation_result = new QueryValidationResult(new BrokenRule[0]);
            GetMock<IQueryValidator>().Setup(q => q.Validate(Moq.It.IsAny<IQuery>())).Returns(validation_result);

            coordinator = Get<QueryCoordinator>();
        };
    }
}