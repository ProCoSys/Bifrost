using System;
using System.Reflection;

namespace Bifrost.Specs.Execution.for_AssemblyProvider
{
    public class TestAssembly : Assembly
    {
        readonly Type[] _types;
        private bool _isDynamic;
        public override string Location { get; }
        public override string FullName { get; }
        public override bool IsDynamic => _isDynamic;

        public override Type[] GetTypes() => _types;

        public TestAssembly(string fullName, string location, params Type[] types)
        {
            _types = types;
            FullName = fullName;
            Location = location;
        }

        public void SetDynamic()
        {
            _isDynamic = true;
        }
    }
}