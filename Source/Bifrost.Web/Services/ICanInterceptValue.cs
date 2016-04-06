using Bifrost.Conventions;

namespace Bifrost.Web.Services
{
    /// <summary>
    /// Defines a system that can intercept values during JSON serialization.
    /// </summary>
    /// <typeparamref name="T">The types to intercept.</typeparamref>
    /// <remarks>
    /// Types implementing this interface will be automatically registered and invoked during JSON serialization.
    /// </remarks>
    public interface ICanInterceptValue<T> : IConvention
    {
        T Intercept(T value);
    }
}
