﻿using System;

namespace Bifrost.Execution
{
    /// <summary>
    /// The exception that is thrown if classes injected into <see cref="IOrderedInstancesOf{T}"/> have cyclic
    /// dependencies.
    /// </summary>
    public class CyclicDependencyException : Exception
    {
        /// <summary>
        /// Initializes a new instance of <see cref="CyclicDependencyException"/>.
        /// </summary>
        public CyclicDependencyException()
        {
        }

        /// <summary>
        /// Initializes a new instance of <see cref="CyclicDependencyException"/>.
        /// </summary>
        /// <param name="message">The exception message.</param>
        public CyclicDependencyException(string message) : base(message)
        {
        }
    }
}