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
using System.Web.Hosting;
using Bifrost.Execution;
using Bifrost.Web.Configuration;

namespace Bifrost.Web.Assets
{
    [Singleton]
    public class AssetsManager : IAssetsManager
    {
        readonly WebConfiguration _webConfiguration;
        readonly Dictionary<string, IList<string>> _assetsByExtension = new Dictionary<string, IList<string>>();

        public AssetsManager(WebConfiguration webConfiguration)
        {
            _webConfiguration = webConfiguration;
            Initialize();
        }

        public IEnumerable<string> GetFilesForExtension(string extension)
        {
            extension = MakeSureExtensionIsPrefixedWithADot(extension);
            IList<string> files;
            return !_assetsByExtension.TryGetValue(extension, out files) ? Enumerable.Empty<string>() : files;
        }

        public IEnumerable<string> GetStructureForExtension(string extension)
        {
            extension = MakeSureExtensionIsPrefixedWithADot(extension);
            IList<string> files;
            if (!_assetsByExtension.TryGetValue(extension, out files))
            {
                return Enumerable.Empty<string>();
            }

            return files
                .Select(Path.GetDirectoryName)
                .Select(FormatPath)
                .Distinct();
        }

        static string MakeSureExtensionIsPrefixedWithADot(string extension)
        {
            return !extension.StartsWith(".") ? "." + extension : extension;
        }

        static string FormatPath(string input)
        {
            return input.Replace("\\", "/");
        }

        void Initialize()
        {
            var root = HostingEnvironment.ApplicationPhysicalPath;
            var files = Directory.GetFiles(root, "*.*", SearchOption.AllDirectories);
            foreach (var file in files)
            {
                var relativePath = FormatPath(file.Replace(root, string.Empty));
                if (!_webConfiguration.Assets.PathsToExclude.Any(relativePath.StartsWith))
                {
                    AddAsset(relativePath);
                }
            }
        }

        public void AddAsset(string relativePath)
        {
            var extension = Path.GetExtension(relativePath);

            IList<string> assets;
            if (!_assetsByExtension.TryGetValue(extension, out assets))
            {
                assets = new List<string>();
                _assetsByExtension[extension] = assets;
            }

            assets.Add(relativePath);
        }

        public void AddAssetsFromAssembly(Assembly assembly, string path)
        {
            var rootNamespace = assembly.GetName().Name;
            var resources = assembly.GetManifestResourceNames();
            foreach (var resource in resources)
            {
                var resourceName = resource.Replace(rootNamespace + ".", string.Empty);
                resourceName = resourceName.Replace(".", "/");
                resourceName = $"{path}/{resourceName}";

                var lastSlash = resourceName.LastIndexOf("/");
                var formatted = $"{resourceName.Substring(0, lastSlash)}.{resourceName.Substring(lastSlash + 1)}";
                AddAsset(formatted);
            }
        }
    }
}
