using System;
using Bifrost.Configuration;
using Bifrost.Execution;
using Moq;

namespace Bifrost.Specs.Bootstrap.Types.for_TypeCollector
{
    public class TestContainerCreator : KeepLastCreated<TestContainerCreator>, ICanCreateContainer
    {
        [ThreadStatic]
        static Mock<IContainer> _containerMock;

        public static void SetContainer(Mock<IContainer> mock)
        {
            _containerMock = mock;
        }

        public IContainer CreateContainer()
        {
            return _containerMock.Object;
        }
    }
}
