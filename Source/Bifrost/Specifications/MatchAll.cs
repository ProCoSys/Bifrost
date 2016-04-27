namespace Bifrost.Specifications
{
    /// <summary>
    /// Represents a <see cref="Specification{T}">rule</see> that matches all values.
    /// </summary>
    public class MatchAll<T> : Specification<T>
    {
        /// <summary>
        /// Initializes an instance of <see cref="MatchAll{T}"/>.
        /// </summary>
        public MatchAll()
        {
            Predicate = a => true;
        }
    }
}
