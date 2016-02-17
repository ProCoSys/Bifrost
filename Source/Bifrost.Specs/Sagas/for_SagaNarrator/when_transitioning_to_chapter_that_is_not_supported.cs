﻿using System;
using Bifrost.Sagas;
using Bifrost.Testing.Fakes.Sagas;
using Machine.Specifications;

namespace Bifrost.Specs.Sagas.for_SagaNarrator
{
    [Subject(typeof(SagaNarrator))]
    public class when_transitioning_to_chapter_that_is_not_supported : given.a_saga_narrator
    {
        static Saga saga;
        static Exception exception;

        Establish context = () =>
        {
            saga = new Saga();
            saga.SetCurrentChapter(new NonTransitionalChapter());
        };

        Because of = () => exception = Catch.Exception(() => narrator.TransitionTo<TransitionalChapter>(saga));

        It should_throw_chapter_transition_not_allowed_exception = () => exception.ShouldBeOfExactType<ChapterTransitionNotAllowedException>();
    }
}