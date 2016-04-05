using System;
using System.Collections.Generic;
using Bifrost.Bootstrap;
using Bifrost.Configuration;

namespace Bifrost.Specs.Bootstrap.Types.for_TypeCollector
{
    public class TestImplementorFinder : KeepLastCreated<TestImplementorFinder>, IImplementorFinder
    {
        public Type GetImplementorFor(Type contract)
        {
            if (contract == typeof(ICanCreateContainer))
            {
                return typeof(TestContainerCreator);
            }
            else
            {
                var contractName = contract.FullName;
                var index = contractName.LastIndexOf("I");
                return index < 0 ? null : Type.GetType(contractName.Remove(index, 1));
            }
        }

        public IEnumerable<Type> GetImplementorsFor(Type contract)
        {
            throw new NotImplementedException();
        }
    }
}
