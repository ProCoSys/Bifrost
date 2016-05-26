using System;

namespace Bifrost.Entities
{
    /// <summary>
    /// Defines an interface for serializing and deserializing configuration files.
    /// </summary>
    public interface IConfigFileCache
    {
        /// <summary>
        /// Gets or sets the location of the cached config file.
        /// </summary>
        string CacheFile { get; set; }

        /// <summary>
        /// Saves the configuration object to disk.
        /// </summary>
        /// <typeparam name="T">The type of the configuration object.</typeparam>
        /// <param name="configuration">The configuration object to save.</param>
        /// <returns>The configuration object.</returns>
        T SaveConfiguration<T>(T configuration);

        /// <summary>
        /// Loads the configuration object from disk if it is newer than the time stamp.
        /// </summary>
        /// <typeparam name="T">The type of the configuration object.</typeparam>
        /// <param name="timestamp">The last time the configuration object was valid.</param>
        /// <returns>The loaded configuration object, or <c>null</c> if it too old or otherwise could not be loaded.</returns>
        T LoadConfiguration<T>(DateTime timestamp) where T : class;
    }
}
