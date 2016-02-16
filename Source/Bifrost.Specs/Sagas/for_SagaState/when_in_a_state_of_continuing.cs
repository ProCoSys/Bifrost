using System;
using Bifrost.Sagas;
using Bifrost.Sagas.Exceptions;
using Machine.Specifications;

namespace Bifrost.Specs.Sagas.for_SagaState
{
    [Subject(typeof(SagaState))]
    public class when_in_a_state_of_continuing : given.a_state_of_continuing
    {
        static Exception exception_when_transitioning_to_an_invalid_state;
        static Exception exception_when_transitioning_to_a_valid_state;

        static bool can_transition_to_new;
        static bool can_transition_to_begun;
        static bool can_transition_to_continuing;
        static bool can_transition_to_concluded;

        Because of = () =>
                         {
                             can_transition_to_new = state.CanTransitionTo(SagaState.NEW);
                             can_transition_to_begun = state.CanTransitionTo(SagaState.BEGUN);
                             can_transition_to_continuing = state.CanTransitionTo(SagaState.CONTINUING);
                             can_transition_to_concluded = state.CanTransitionTo(SagaState.CONCLUDED);

                             exception_when_transitioning_to_an_invalid_state = exception_when_transitioning_to_an_invalid_state = Catch.Exception(() => state.TransitionTo(SagaState.BEGUN));
                             exception_when_transitioning_to_a_valid_state = exception_when_transitioning_to_a_valid_state = Catch.Exception(() => state.TransitionTo(SagaState.CONCLUDED));
                         };

        It should_not_support_transitioning_to_new = () => can_transition_to_new.ShouldBeFalse();
        It should_not_support_transitioning_to_begun = () => can_transition_to_begun.ShouldBeFalse();
        It should_support_transitioning_to_itself = () => can_transition_to_continuing.ShouldBeTrue();
        It should_support_transitioning_to_concluded = () => can_transition_to_concluded.ShouldBeTrue();

        It should_throw_an_invalid_saga_state_transition_exception_when_transitioning_to_an_invalid_state =
            () => exception_when_transitioning_to_an_invalid_state.ShouldBeOfExactType<InvalidSagaStateTransitionException>();

        It should_not_throw_an_invalid_saga_state_transition_exception_when_transitioning_to_a_valid_state =
            () => exception_when_transitioning_to_a_valid_state.ShouldBeNull();

        It should_have_the_new_state_after_transitioning = () => state.IsConcluded.ShouldBeTrue();
    }
}