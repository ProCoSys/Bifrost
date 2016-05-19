#region License
//
// Copyright (c) 2008-2015, Dolittle (http://www.dolittle.com)
//
// Licensed under the MIT License (http://opensource.org/licenses/MIT)
//
// You may not use this file except in compliance with the License.
// You may obtain a copy of the license at
//
//   http://github.com/dolittle/Bifrost/blob/master/MIT-LICENSE.txt
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
#endregion
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Bifrost.Bootstrap;
using Bifrost.Entities;
using Bifrost.Execution;
using Bifrost.Extensions;
using FluentNHibernate;
using FluentNHibernate.Cfg;
using FluentNHibernate.Conventions.Helpers;
using NHibernate;
using NHConfig = NHibernate.Cfg.Configuration;

namespace Bifrost.NHibernate.Entities
{
    public class EntityContextConnection : IEntityContextConnection, IConnection
    {
        public string ConfigCacheFile { get; set; }
        public ISessionFactory SessionFactory { get; private set; }
        public FluentConfiguration FluentConfiguration { get; }
        public NHConfig Configuration { get; private set; }

        public EntityContextConnection()
        {
            FluentConfiguration = Fluently.Configure();
        }

        static IList<Assembly> DiscoverAssembliesWithFluentMappings(IContainer container)
        {
            return container
                .Get<IImplementorFinder>()
                .GetImplementorsFor(typeof(IMappingProvider))
                .Select(t => t.Assembly)
                .Distinct()
                .ToList();
        }

        static IList<Assembly> DiscoverAssembliesWithHbmMappings(IContainer container)
        {
            return container
                .Get<IAssemblies>()
                .GetAll()
                .Where(a => a.GetManifestResourceNames().Any(s => s.EndsWith(".hbm.xml")))
                .ToList();
        }

        static void AddAssemblies(
            IEnumerable<Assembly> assembliesWithFluentMappings,
            IEnumerable<Assembly> assembliesWithHbmMappings,
            MappingConfiguration mappings)
        {
            assembliesWithFluentMappings.ForEach(
                a => mappings.FluentMappings.AddFromAssembly(a).Conventions.Add(DefaultLazy.Never(), AutoImport.Never()));
            assembliesWithHbmMappings.ForEach(
                a => mappings.HbmMappings.AddFromAssembly(a));
        }

        public void Initialize(IContainer container)
        {
            var assembliesWithFluentMappings = DiscoverAssembliesWithFluentMappings(container);
            var assembliesWithHbmMappings = DiscoverAssembliesWithHbmMappings(container);
            if (ConfigCacheFile == null)
            {
                Configuration = BuildConfiguration(assembliesWithFluentMappings, assembliesWithHbmMappings);
            }
            else
            {
                var newestAssemblyTime = assembliesWithFluentMappings
                    .Concat(assembliesWithHbmMappings)
                    .Max(a => new FileInfo(a.Location).LastWriteTimeUtc);

                var cache = container.Get<IConfigFileCache>();
                cache.CacheFile = ConfigCacheFile;
                Configuration = cache.LoadConfiguration<NHConfig>(newestAssemblyTime) ??
                    cache.SaveConfiguration(BuildConfiguration(assembliesWithFluentMappings, assembliesWithHbmMappings));
            }

            SessionFactory = Configuration.BuildSessionFactory();
        }

        NHConfig BuildConfiguration(
            IEnumerable<Assembly> assembliesWithFluentMappings,
            IEnumerable<Assembly> assembliesWithHbmMappings)
        {
            FluentConfiguration.Mappings(m => AddAssemblies(assembliesWithFluentMappings, assembliesWithHbmMappings, m));
            return FluentConfiguration.BuildConfiguration();
        }
    }
}
