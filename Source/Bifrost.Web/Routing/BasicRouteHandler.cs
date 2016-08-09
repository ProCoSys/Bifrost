using System;
using System.Web;
using System.Web.Routing;

namespace Bifrost.Web.Routing
{
    public class BasicRouteHandler : IRouteHandler
    {
        private readonly Lazy<IHttpHandler> _httpHandler;

        public BasicRouteHandler(Lazy<IHttpHandler> httpHandler)
        {
            _httpHandler = httpHandler;
        }

        public IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            return _httpHandler.Value;
        }
    }
}
