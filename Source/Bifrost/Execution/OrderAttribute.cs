﻿using System;

namespace Bifrost.Execution
{
    /// <summary>
    /// Indicates that a class used for injecting into an <see cref="IOrderedInstancesOf{T}"/> has a specific
    /// ordering relative to other classes decorated with this attribute.
    /// 
    /// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    public class OrderAttribute : Attribute
    {
        /// <summary>
        /// Initializes a new instance of <see cref="AfterAttribute"/>.
        /// </summary>
        /// <param name="order">The order of the decorated class.</param>
        public OrderAttribute(int order)
        {
            Order = order;
        }

        /// <summary>
        /// The order of the decorated class.
        /// </summary>
        /// <remarks>Modules without this attribute have order 0.</remarks>
        public int Order { get; private set; }
    }
}