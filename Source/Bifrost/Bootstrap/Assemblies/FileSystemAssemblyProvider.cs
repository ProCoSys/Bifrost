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
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using Bifrost.Collections;
using Bifrost.Execution;

namespace Bifrost.Bootstrap.Assemblies
{
    /// <summary>
    /// Represents an implementation of <see cref="ICanProvideAssemblies"/> that is capable of
    /// discovering assembly files from the directory in which the application resides.
    /// </summary>
    public class FileSystemAssemblyProvider : ICanProvideAssemblies
    {
        /// <summary>
        /// Initializes a new instance of <see cref="FileSystemAssemblyProvider"/>
        /// </summary>
        /// <param name="fileSystem"></param>
        /// <param name="assemblyUtility"></param>
        public FileSystemAssemblyProvider(IFileSystem fileSystem, IAssemblyUtility assemblyUtility)
        {
            var codeBase = typeof(FileSystemAssemblyProvider).Assembly.GetName().CodeBase;
            var uri = new Uri(codeBase);
            var assemblyFileInfo = new FileInfo(uri.LocalPath);

            AvailableAssemblies = new ObservableCollection<AssemblyInfo>(
                fileSystem.GetFilesFrom(assemblyFileInfo.Directory.ToString(), "*.dll")
                    .Concat(fileSystem.GetFilesFrom(assemblyFileInfo.Directory.ToString(), "*.exe"))
                    .Select(fi => fi.FullName)
                    .Select(AssemblyInfoFromFileInfo)
                    .Where(assemblyUtility.IsAssembly));
        }

#pragma warning disable 1591 // Xml Comments
        public IObservableCollection<AssemblyInfo> AvailableAssemblies { get; }
#pragma warning restore 1591 // Xml Comments

        static AssemblyInfo AssemblyInfoFromFileInfo(string path)
        {
            return new AssemblyInfo(
                Path.GetFileNameWithoutExtension(path),
                path,
                new Lazy<Assembly>(() => Assembly.LoadFile(path)));
        }
    }
}
