using System;

namespace Bifrost.Specs.Bootstrap.Types.for_TypeCollector
{
    public class KeepLastCreated<T> where T : KeepLastCreated<T>
    {
        [ThreadStatic]
        // ReSharper disable once StaticMemberInGenericType
        static object _lastCreated;

        public static T LastCreated => _lastCreated as T;

        public KeepLastCreated()
        {
            _lastCreated = this;
        }
    }
}
