namespace Bifrost.Specifications
{
    /// <summary>
    /// Represents a <see cref="Specification{T}">rule</see> that matches no values.
    /// </summary>
    public class MatchNone<T> : Specification<T>
    {
        /// <summary>
        /// Initializes an instance of <see cref="MatchNone{T}"/>.
        /// </summary>
        public MatchNone()
        {
            Predicate = a => false;
        }
    }
}
