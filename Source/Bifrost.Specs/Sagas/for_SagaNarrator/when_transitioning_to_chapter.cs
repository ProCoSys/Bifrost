﻿using Bifrost.Execution;
using Bifrost.Sagas;
using Bifrost.Testing.Fakes.Sagas;
using Machine.Specifications;
using Moq;
using It = Machine.Specifications.It;

namespace Bifrost.Specs.Sagas.for_SagaNarrator
{
    [Subject(typeof(SagaNarrator))]
    public class when_transitioning_to_chapter : given.a_saga_narrator
    {
        static Saga saga;
        static IChapter transitioned_chapter;

        Establish context = () =>
        {
            GetMock<IContainer>()
                .Setup(c => c.Get<TransitionalChapter>())
                .Returns(new TransitionalChapter());
            saga = new Saga();
        };

        Because of = () => transitioned_chapter = narrator.TransitionTo<TransitionalChapter>(saga).TransitionedTo;

        It should_record_saga = () => GetMock<ISagaLibrarian>().Verify(a => a.Catalogue(saga), Times.Once());
        It should_return_a_chapter = () => transitioned_chapter.ShouldNotBeNull();
        It should_return_the_chapter_transitioned_to = () => transitioned_chapter.ShouldBeOfExactType<TransitionalChapter>();
        It should_call_the_on_transitioned_to_method_on_the_chapter = () => ((TransitionalChapter) transitioned_chapter).OnTransitionedToWasCalled.ShouldBeTrue();
    }
}