using System;
using System.Web;
using System.Web.Routing;
using Bifrost.Extensions;
using Bifrost.Web.Routing;

namespace Bifrost.Web.Services
{
    public static class RouteExtensions
    {
        const string ServicePostfix = "Service";
        const string HttpHandlerPostfix = "HttpHandler";

        /// <summary>
        /// Registers a rest-like http service.
        /// </summary>
        /// <typeparam name="T">The type of the service to register.</typeparam>
        /// <param name="routes">The route collection to register the service at.</param>
        /// <param name="path">An optional path to the service.</param>
        /// <remarks>
        /// Bifrost will use a <see cref="RestServiceRouteHttpHandler"/> and a <see cref="RestServiceMethodInvoker"/>
        /// to convert the http request into a method call on the service. The returned value will be serialized to an
        /// http response using the registered <see cref="Serialization.ISerializer"/>.
        /// </remarks>
        /// <example>
        /// <c>RouteTable.Routes.AddService&lt;FooService&gt;("Folder");</c> will route all calls to paths under
        /// <c>/Folder/Foo/</c> to methods of <c>FooService</c>.
        /// </example>
        public static void AddService<T>(this RouteCollection routes, string path = null)
        {
            routes.AddService(typeof(T), path);
        }

        /// <summary>
        /// Registers a rest-like http service.
        /// </summary>
        /// <param name="routes">The route collection to register the service at.</param>
        /// <param name="service">The type of the service to register.</param>
        /// <param name="path">An optional path to the service.</param>
        /// <remarks>
        /// Bifrost will use a <see cref="RestServiceRouteHttpHandler"/> and a <see cref="RestServiceMethodInvoker"/>
        /// to convert the http request into a method call on the service. The returned value will be serialized to an
        /// http response using the registered <see cref="Serialization.ISerializer"/>.
        /// </remarks>
        /// <example>
        /// <c>RouteTable.Routes.AddService(typeof(FooService), "Folder");</c> will route all calls to paths under
        /// <c>/Folder/Foo/</c> to methods of <c>FooService</c>.
        /// </example>
        public static void AddService(this RouteCollection routes, Type service, string path = null)
        {
            var url = service.Name.RemovePostfix(ServicePostfix);
            if (path != null)
            {
                url = path.RemovePostfix("/") + "/" + url;
            }

            routes.AddFirst(new BasicRouteIncludingSubfolders(new RestServiceRouteHttpHandler(service, url), url));
        }

        /// <summary>
        /// Registers a custom http handler.
        /// </summary>
        /// <param name="routes">The route collection to register the service at.</param>
        /// <param name="httpHandler">The http handler to register.</param>
        /// <param name="path">An optional path to the service.</param>
        /// <param name="ignoreHandlerName">Whether to ignore the name of the handler.</param>
        /// <example>
        /// If <c>handler</c> is of type FooHttpHandler, <c>RouteTable.Routes.AddHttpHandler(handler, "Folder");</c>
        /// will route all calls to paths under <c>/Folder/Foo/</c> to the <c>handler</c>.
        /// </example>
        public static void AddHttpHandler(
            this RouteCollection routes,
            IHttpHandler httpHandler,
            string path = null,
            bool ignoreHandlerName = false)
        {
            var url = ComposeUrl(httpHandler.GetType(), path, ignoreHandlerName);
            routes.AddFirst(new BasicRouteIncludingSubfolders(httpHandler, url));
        }

        /// <summary>
        /// Registers a custom http handler.
        /// </summary>
        /// <param name="routes">The route collection to register the service at.</param>
        /// <param name="httpHandler">The type of the http handler to register.</param>
        /// <param name="path">An optional path to the service.</param>
        /// <param name="ignoreHandlerName">Whether to ignore the name of the handler.</param>
        /// <example>
        /// If <c>handler</c> is of type FooHttpHandler, <c>RouteTable.Routes.AddHttpHandler(handler, "Folder");</c>
        /// will route all calls to paths under <c>/Folder/Foo/</c> to the <c>handler</c>.
        /// </example>
        public static void AddHttpHandler(
            this RouteCollection routes,
            Type httpHandler,
            string path = null,
            bool ignoreHandlerName = false)
        {
            var url = ComposeUrl(httpHandler, path, ignoreHandlerName);
            routes.AddFirst(new BasicRouteIncludingSubfolders(httpHandler, url));
        }

        static string ComposeUrl(Type httpHandler, string path, bool ignoreHandlerName)
        {
            string url;
            if (ignoreHandlerName)
            {
                url = path.RemovePostfix("/");
            }
            else
            {
                url = httpHandler.Name.RemovePostfix(HttpHandlerPostfix);
                if (path != null)
                {
                    url = path.RemovePostfix("/") + "/" + url;
                }
            }

            return url;
        }

        public static void AddFirst(this RouteCollection routeCollection, RouteBase item)
        {
            routeCollection.Insert(0, item);
        }
    }
}
