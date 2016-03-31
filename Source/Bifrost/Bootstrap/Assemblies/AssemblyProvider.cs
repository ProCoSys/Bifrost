using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using Bifrost.Collections;
using Bifrost.Execution;

namespace Bifrost.Bootstrap.Assemblies
{
    /// <summary>
    /// Represents an implementation of <see cref="IAssemblyProvider"/>.
    /// </summary>
    public class AssemblyProvider : IAssemblyProvider
    {
        int _processing;

        // The implementation strategy is to enqueue all discovered assemblies in this queue..
        readonly ConcurrentQueue<AssemblyInfo> _assembliesToBeSpecified = new ConcurrentQueue<AssemblyInfo>();

        // ..and after they have been checked for specifiers move them to this list..
        readonly IList<AssemblyInfo> _specifiedAssemblies = new List<AssemblyInfo>();

        // ..And then, each time a new specification is discovered, all assemblies in the list above
        // are checked for inclusion and moved to this collection of assemblies if they should be included.
        readonly ObservableCollection<Assembly> _assemblies = new ObservableCollection<Assembly>();

        readonly AssemblyInfoComparer _comparer = new AssemblyInfoComparer();

        readonly IAssemblyFilters _assemblyFilters;
        readonly IAssemblySpecifiers _assemblySpecifiers;
        readonly IContractToImplementorsMap _contractToImplementorsMap;

        /// <summary>
        /// Initializes a new instance of <see cref="AssemblyProvider"/>
        /// </summary>
        /// <param name="assemblyProviders">
        /// <see cref="IEnumerable{ICanProvideAssemblies}">Providers</see> to provide assemblies.
        /// </param>
        /// <param name="assemblyFilters">
        /// <see cref="IAssemblyFilters"/> to use for filtering assemblies through.
        /// </param>
        /// <param name="assemblySpecifiers">
        /// <see cref="IAssemblySpecifiers"/> used for specifying what assemblies to include or not.
        /// </param>
        /// <param name="contractToImplementorsMap">
        /// <see cref="IContractToImplementorsMap"/> for keeping track of the relationship between contracts and implementors.
        /// </param>
        public AssemblyProvider(
            IEnumerable<ICanProvideAssemblies> assemblyProviders,
            IAssemblyFilters assemblyFilters,
            IAssemblySpecifiers assemblySpecifiers,
            IContractToImplementorsMap contractToImplementorsMap)
        {
            var providers = assemblyProviders.ToList();
            _assemblyFilters = assemblyFilters;
            _assemblySpecifiers = assemblySpecifiers;
            _contractToImplementorsMap = contractToImplementorsMap;

            foreach (var provider in providers)
            {
                provider.AvailableAssemblies.Added += (_, assemblies) => Enqueue(assemblies);
            }

            Enqueue(providers.SelectMany(p => p.AvailableAssemblies));
        }

#pragma warning disable 1591 // Xml Comments
        public IObservableCollection<Assembly> GetAll()
        {
            return _assemblies;
        }
#pragma warning restore 1591 // Xml Comments

        void Enqueue(IEnumerable<AssemblyInfo> assemblies)
        {
            foreach (var assembly in assemblies)
            {
                _assembliesToBeSpecified.Enqueue(assembly);
            }

            Process();
        }

        // The implementation of this method is complicated by the mechanism that loading an assembly
        // might trigger an assembly load event of referenced assemblies.
        void Process()
        {
            if (Interlocked.CompareExchange(ref _processing, 1, 0) == 1)
            {
                return;
            }

            try
            {
                DoProcess();
            }
            finally
            {
                _processing = 0;
            }
        }

        void DoProcess()
        {
            do
            {
                var newSpecifications = false;
                // First, specify from all assemblies in queue.
                // (Loading an assembly in the queue might add more assemblies to the queue.)
                while (_assembliesToBeSpecified.Count > 0)
                {
                    AssemblyInfo next;
                    if (_assembliesToBeSpecified.TryDequeue(out next) && 
                        !_specifiedAssemblies.Contains(next, _comparer))
                    {
                        var assembly = next.Assembly.Value;
                        newSpecifications |= _assemblySpecifiers.SpecifyUsingSpecifiersFrom(assembly);
                        _specifiedAssemblies.Add(next);
                    }
                }

                // No more assemblies in queue, add all new assemblies.
                // (This might again add more assemblies to the queue.)
                if (newSpecifications)
                {
                    AddNewAssemblies();
                }
            } while (_assembliesToBeSpecified.Count > 0);
        }

        void AddNewAssemblies()
        {
            foreach (var assembly in _specifiedAssemblies.Select(ai => ai.Assembly.Value))
            {
                if (!_assemblies.Contains(assembly) &&
                    _assemblyFilters.ShouldInclude(new FileInfo(assembly.Location).Name))
                {
                    _contractToImplementorsMap.Feed(assembly.GetTypes());
                    _assemblies.Add(assembly);
                }
            }
        }

        private class AssemblyInfoComparer : IEqualityComparer<AssemblyInfo>
        {
            public bool Equals(AssemblyInfo x, AssemblyInfo y)
            {
                return x.Name == y.Name;
            }

            public int GetHashCode(AssemblyInfo obj)
            {
                return obj.Name.GetHashCode();
            }
        }
    }
}
