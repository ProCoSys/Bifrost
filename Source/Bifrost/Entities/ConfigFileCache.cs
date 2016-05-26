using System;
using System.IO;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;

namespace Bifrost.Entities
{
    /// <summary>
    /// Represents an implementation of <see cref="IConfigFileCache"/>.
    /// </summary>
    public class ConfigFileCache : IConfigFileCache
    {
#pragma warning disable 1591 // Xml Comments
        public string CacheFile { get; set; }

        private bool IsConfigValid(DateTime newest)
        {
            var configInfo = new FileInfo(CacheFile);
            if (!configInfo.Exists)
            {
                return false;
            }

            return configInfo.LastWriteTimeUtc >= newest;
        }

        public T SaveConfiguration<T>(T configuration)
        {
            using (var file = File.Open(CacheFile, FileMode.Create))
            {
                new BinaryFormatter().Serialize(file, configuration);
            }

            return configuration;
        }

        public T LoadConfiguration<T>(DateTime timestamp) where T : class
        {
            if (!IsConfigValid(timestamp))
            {
                return null;
            }

            using (var file = File.Open(CacheFile, FileMode.Open, FileAccess.Read))
            {
                try
                {
                    return new BinaryFormatter().Deserialize(file) as T;
                }
                catch (SerializationException)
                {
                    return null;
                }
            }
        }
#pragma warning restore 1591 // Xml Comments
    }
}
