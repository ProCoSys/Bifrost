using System.Web;
using System.Web.Routing;

namespace Bifrost.Web.Routing
{
    public class BasicRouteHandler : IRouteHandler
    {
        private readonly IHttpHandler _httpHandler;

        public BasicRouteHandler(IHttpHandler httpHandler)
        {
            _httpHandler = httpHandler;
        }

        public IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            return _httpHandler;
        }
    }
}
