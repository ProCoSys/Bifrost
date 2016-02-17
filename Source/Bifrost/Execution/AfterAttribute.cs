using System;

namespace Bifrost.Execution
{
    /// <summary>
    /// Indicates that a class used for injecting into an <see cref="IOrderedInstancesOf{T}"/> must be ordered after
    /// another class injected into the same <see cref="IOrderedInstancesOf{T}"/>.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    public class AfterAttribute : Attribute
    {
        /// <summary>
        /// Initializes a new instance of <see cref="AfterAttribute"/>.
        /// </summary>
        /// <param name="dependantTypes">The types the decorated type is dependant upon, and must come after.</param>
        public AfterAttribute(params Type[] dependantTypes)
        {
            DependantTypes = dependantTypes;
        }

        /// <summary>
        /// List of startup module types that must be executed before this startup module is executed.
        /// </summary>
        /// <remarks>This will take precedence over any <see cref="OrderAttribute"/> attributes.</remarks>
        public Type[] DependantTypes { get; set; }
    }
}